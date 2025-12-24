import sql from "@/app/api/utils/sql";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return Response.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    const existing = await sql`
      SELECT id FROM user_profiles WHERE username = ${username}
    `;

    return Response.json({ available: existing.length === 0 });
  } catch (error) {
    return Response.json(
      { error: "Failed to check username" },
      { status: 500 },
    );
  }
}
