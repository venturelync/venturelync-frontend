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

    const userId = jwt.sub;

    const profiles = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${userId} LIMIT 1
    `;

    if (profiles.length === 0) {
      return Response.json(
        { error: "Profile not found. Please complete onboarding." },
        { status: 404 },
      );
    }

    return Response.json({ profile: profiles[0] });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return Response.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const jwt = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.AUTH_URL.startsWith("https"),
    });

    if (!jwt?.sub) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = jwt.sub;
    const body = await request.json();
    const {
      name,
      bio,
      city,
      country,
      website_url,
      linkedin_url,
      twitter_url,
      profile_image,
      banner_image,
    } = body;

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 0;

    if (name !== undefined) {
      paramCount++;
      updates.push(`name = $${paramCount}`);
      values.push(name);
    }
    if (bio !== undefined) {
      paramCount++;
      updates.push(`bio = $${paramCount}`);
      values.push(bio);
    }
    if (city !== undefined) {
      paramCount++;
      updates.push(`city = $${paramCount}`);
      values.push(city);
    }
    if (country !== undefined) {
      paramCount++;
      updates.push(`country = $${paramCount}`);
      values.push(country);
    }
    if (website_url !== undefined) {
      paramCount++;
      updates.push(`website_url = $${paramCount}`);
      values.push(website_url);
    }
    if (linkedin_url !== undefined) {
      paramCount++;
      updates.push(`linkedin_url = $${paramCount}`);
      values.push(linkedin_url);
    }
    if (twitter_url !== undefined) {
      paramCount++;
      updates.push(`twitter_url = $${paramCount}`);
      values.push(twitter_url);
    }
    if (profile_image !== undefined) {
      paramCount++;
      updates.push(`profile_image = $${paramCount}`);
      values.push(profile_image);
    }
    if (banner_image !== undefined) {
      paramCount++;
      updates.push(`banner_image = $${paramCount}`);
      values.push(banner_image);
    }

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    paramCount++;
    values.push(userId);

    const query = `UPDATE user_profiles SET ${updates.join(", ")} WHERE user_id = $${paramCount} RETURNING *`;
    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    return Response.json({ profile: result[0] });
  } catch (error) {
    console.error("Update profile error:", error);
    return Response.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
