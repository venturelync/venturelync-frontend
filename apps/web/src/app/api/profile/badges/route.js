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

  try {
    const badges = await sql`
      SELECT b.*, ub.earned_at, ub.is_new
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = ${jwt.sub}
      ORDER BY ub.earned_at DESC
    `;

    return Response.json({ badges });
  } catch (error) {
    console.error("Error fetching badges:", error);
    return Response.json({ error: "Failed to fetch badges" }, { status: 500 });
  }
}
