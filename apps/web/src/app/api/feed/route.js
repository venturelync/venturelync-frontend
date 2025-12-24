import sql from "@/app/api/utils/sql";
import { getToken } from "@auth/core/jwt";

export async function GET(request) {
  try {
    const jwt = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.AUTH_URL.startsWith("https"),
    });
    const userId = jwt?.sub;

    // Fetch posts with user profile info, most recent badge, and top comment
    const posts = await sql`
      SELECT 
        p.*, 
        up.username, 
        up.profile_image,
        up.level,
        up.streak,
        (SELECT b.icon FROM user_badges ub JOIN badges b ON ub.badge_id = b.id WHERE ub.user_id = p.user_id ORDER BY ub.earned_at DESC LIMIT 1) as recent_badge_icon,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
        ${userId ? sql`(SELECT EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ${userId}))` : sql`false`} as is_liked,
        (
          SELECT json_build_object(
            'content', c.content,
            'username', cup.username,
            'created_at', c.created_at
          )
          FROM comments c
          JOIN user_profiles cup ON c.user_id = cup.user_id
          WHERE c.post_id = p.id
          ORDER BY c.created_at DESC
          LIMIT 1
        ) as top_comment
      FROM posts p
      JOIN user_profiles up ON p.user_id = up.user_id
      ORDER BY p.created_at DESC
      LIMIT 50
    `;

    return Response.json({ posts });
  } catch (error) {
    console.error("Feed fetch error:", error);
    return Response.json({ error: "Failed to fetch feed" }, { status: 500 });
  }
}
