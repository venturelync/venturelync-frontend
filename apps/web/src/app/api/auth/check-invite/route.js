import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const results = await sql`
      SELECT is_approved FROM waitlist WHERE email = ${email} LIMIT 1
    `;

    if (results.length === 0) {
      return Response.json({
        invited: false,
        message: "You haven't requested an invite yet.",
      });
    }

    if (!results[0].is_approved) {
      return Response.json({
        invited: false,
        message: "Your invite request is still being reviewed.",
      });
    }

    return Response.json({ invited: true });
  } catch (error) {
    console.error("Check invite error:", error);
    return Response.json(
      { error: "Failed to check invite status" },
      { status: 500 },
    );
  }
}
