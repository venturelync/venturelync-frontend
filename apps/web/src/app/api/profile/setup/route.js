import sql from "@/app/api/utils/sql";
import { getToken } from "@auth/core/jwt";

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
    const {
      username,
      name,
      bio,
      profile_image,
      banner_image,
      builder_intent,
      linkedin_url,
      twitter_url,
      website_url,
      onboarding_completed,
    } = body;

    if (!username) {
      return Response.json({ error: "Username is required" }, { status: 400 });
    }

    const userId = jwt.sub;

    // Check if username is already taken
    const existing = await sql`
      SELECT id FROM user_profiles WHERE username = ${username} AND user_id != ${userId}
    `;

    if (existing.length > 0) {
      return Response.json(
        { error: "Username already taken" },
        { status: 400 },
      );
    }

    // Check if profile already exists
    const existingProfile = await sql`
      SELECT id FROM user_profiles WHERE user_id = ${userId}
    `;

    // Get user name from JWT or use provided name
    const userName = name || jwt.name || "User";

    if (existingProfile.length > 0) {
      // Update existing profile
      await sql`
        UPDATE user_profiles
        SET username = ${username},
            name = ${userName},
            bio = ${bio || null},
            profile_image = ${profile_image || null},
            banner_image = ${banner_image || null},
            builder_intent = ${builder_intent || null},
            linkedin_url = ${linkedin_url || null},
            twitter_url = ${twitter_url || null},
            website_url = ${website_url || null},
            onboarding_completed = ${onboarding_completed || false}
        WHERE user_id = ${userId}
      `;
    } else {
      // Create new profile
      await sql`
        INSERT INTO user_profiles (
          user_id, name, username, bio, profile_image, banner_image, builder_intent, linkedin_url, twitter_url, website_url, onboarding_completed
        ) VALUES (
          ${userId},
          ${userName},
          ${username},
          ${bio || null},
          ${profile_image || null},
          ${banner_image || null},
          ${builder_intent || null},
          ${linkedin_url || null},
          ${twitter_url || null},
          ${website_url || null},
          ${onboarding_completed || false}
        )
      `;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Profile setup error:", error);
    return Response.json(
      { error: "Failed to set up profile" },
      { status: 500 },
    );
  }
}
