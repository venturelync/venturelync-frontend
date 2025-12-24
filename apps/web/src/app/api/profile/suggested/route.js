import sql from "@/app/api/utils/sql";
import { getToken } from "@auth/core/jwt";

export async function GET(request) {
  try {
    const jwt = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.AUTH_URL?.startsWith("https") || false,
    });

    const userId = jwt?.sub;

    // Fetch users who are not the current user
    // Limit to 5 for the sidebar
    // Prioritize users with higher XP
    const suggestedUsers = await sql`
      SELECT id, name, username, bio, profile_image, xp, level
      FROM user_profiles 
      WHERE user_id::text != ${userId || "-1"}
      AND onboarding_completed = true
      ORDER BY xp DESC
      LIMIT 5
    `;

    return Response.json({ suggestedUsers });
  } catch (error) {
    console.error("Fetch suggested users error:", error);
    return Response.json(
      { error: "Failed to fetch suggested users" },
      { status: 500 },
    );
  }
}
