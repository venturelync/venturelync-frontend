import sql from "@/app/api/utils/sql";
import { getToken } from "@auth/core/jwt";

export async function POST(request, { params }) {
  const jwt = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.AUTH_URL.startsWith("https"),
  });

  if (!jwt?.sub) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: postId } = params;
  const userId = jwt.sub;

  try {
    // Check if already liked
    const existing = await sql`
      SELECT id FROM likes WHERE user_id = ${userId} AND post_id = ${postId}
    `;

    if (existing.length > 0) {
      // Unlike
      await sql`
        DELETE FROM likes WHERE user_id = ${userId} AND post_id = ${postId}
      `;
      return Response.json({ liked: false });
    } else {
      // Like
      await sql`
        INSERT INTO likes (user_id, post_id) VALUES (${userId}, ${postId})
      `;

      // Award Social XP for liking (Soft Skill)
      await sql`
        UPDATE user_profiles 
        SET core_xp = core_xp + 5, 
            reputation_xp = reputation_xp + 5 
        WHERE user_id = ${userId}
      `;

      return Response.json({ liked: true });
    }
  } catch (error) {
    console.error("Like error:", error);
    return Response.json({ error: "Failed to process like" }, { status: 500 });
  }
}
