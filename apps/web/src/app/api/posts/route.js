import sql from "@/app/api/utils/sql";
import { getToken } from "@auth/core/jwt";

export async function GET(request) {
  const jwt = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.AUTH_URL.startsWith("https"),
  });

  if (!jwt?.sub) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userOnly = searchParams.get("user_only") === "true";

  try {
    let posts;

    if (userOnly) {
      // Fetch only the current user's posts
      posts = await sql`
        SELECT 
          p.*,
          up.name as author_name,
          up.username as author_username,
          up.profile_image as author_image,
          up.level as author_level,
          (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
          (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
          EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ${jwt.sub}) as user_has_liked
        FROM posts p
        JOIN user_profiles up ON p.user_id = up.user_id
        WHERE p.user_id = ${jwt.sub}
        ORDER BY p.created_at DESC
      `;
    } else {
      // Fetch all posts (feed)
      posts = await sql`
        SELECT 
          p.*,
          up.name as author_name,
          up.username as author_username,
          up.profile_image as author_image,
          up.level as author_level,
          (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
          (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
          EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ${jwt.sub}) as user_has_liked
        FROM posts p
        JOIN user_profiles up ON p.user_id = up.user_id
        ORDER BY p.created_at DESC
        LIMIT 50
      `;
    }

    return Response.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const jwt = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.AUTH_URL.startsWith("https"),
    });

    if (!jwt?.sub) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, is_first_post } = body;

    if (!content || !content.trim()) {
      return Response.json({ error: "Content is required" }, { status: 400 });
    }

    const userId = jwt.sub;

    // Get user profile
    const profiles = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${userId} LIMIT 1
    `;

    if (profiles.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const profile = profiles[0];
    const xpEarned = 50;
    const newXp = profile.xp + xpEarned;
    const newLevel = Math.floor(newXp / 100) + 1;

    // Streak logic
    const today = new Date().toISOString().split("T")[0];
    const lastPostDate = profile.last_post_date;
    let newStreak = profile.streak;

    if (!lastPostDate) {
      newStreak = 1;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastPostDate === yesterdayStr) {
        newStreak = profile.streak + 1;
      } else if (lastPostDate !== today) {
        newStreak = 1;
      }
    }

    // Transaction
    const [postResult] = await sql.transaction([
      sql`
        INSERT INTO posts (user_id, content, xp_earned)
        VALUES (${userId}, ${content}, ${xpEarned})
        RETURNING id
      `,
      sql`
        UPDATE user_profiles
        SET xp = ${newXp},
            level = ${newLevel},
            streak = ${newStreak},
            last_post_date = ${today},
            first_post_completed = ${is_first_post ? true : profile.first_post_completed}
        WHERE user_id = ${userId}
      `,
    ]);

    // Check for badges
    let badgeUnlocked = false;
    if (is_first_post || newStreak === 7 || newXp === 1000) {
      badgeUnlocked = true;
    }

    return Response.json({
      success: true,
      postId: postResult[0].id,
      xpEarned,
      newStreak,
      badgeUnlocked,
    });
  } catch (error) {
    console.error("Post error:", error);
    return Response.json({ error: "Failed to create post" }, { status: 500 });
  }
}
