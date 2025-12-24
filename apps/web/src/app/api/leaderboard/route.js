import sql from "@/app/api/utils/sql";
import { getToken } from "@auth/core/jwt";

export async function GET(request) {
  try {
    const jwt = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.AUTH_URL.startsWith("https"),
    });

    if (!jwt?.sub) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const country = url.searchParams.get("country");
    const type = url.searchParams.get("type") || "core"; // core, season, community, etc.

    let xpColumn = "core_xp";
    if (type === "season") xpColumn = "season_xp";
    if (type === "community") xpColumn = "community_xp";

    let query = `
      SELECT user_id, name, username, profile_image, core_xp, level, country, city, era_xp, season_xp, community_xp
      FROM user_profiles
    `;

    const params = [];
    if (country) {
      query += ` WHERE country = $1`;
      params.push(country);
    }

    query += ` ORDER BY ${xpColumn} DESC LIMIT 20`;

    const leaderboard = await sql(query, params);

    return Response.json({ leaderboard });
  } catch (error) {
    console.error("Fetch leaderboard error:", error);
    return Response.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
