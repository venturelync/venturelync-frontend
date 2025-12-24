import sql from "@/app/api/utils/sql";
import { sendEmail } from "@/app/api/utils/send-email";

export async function GET(request) {
  try {
    // Fetch all waitlist entries, newest first
    const entries = await sql`
      SELECT * FROM waitlist 
      ORDER BY created_at DESC
    `;
    return Response.json(entries);
  } catch (error) {
    console.error("Admin waitlist fetch error:", error);
    return Response.json(
      { error: "Failed to fetch waitlist" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const { id, is_approved } = await request.json();

    if (!id) {
      return Response.json({ error: "Missing ID" }, { status: 400 });
    }

    // Fetch user details before updating to send the email
    const [user] = await sql`
      SELECT name, email FROM waitlist WHERE id = ${id}
    `;

    await sql`
      UPDATE waitlist 
      SET is_approved = ${is_approved}
      WHERE id = ${id}
    `;

    // Send approval email if the user is being approved
    if (is_approved && user) {
      const signupUrl = `${process.env.APP_URL || "https://venturelync.com"}/account/signup`;
      const fromEmail = "VentureLync <hey@venturelync.com>";

      await sendEmail({
        to: user.email,
        from: fromEmail,
        subject: "🎉 You're IN. Welcome to VentureLync.",
        text: `Hi ${user.name},\n\nYou've been approved for VentureLync. This is a private space for builders who value signal over noise.\n\nComplete your registration here: ${signupUrl}\n\nWelcome to the inner circle.\n\n- The VentureLync Team`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #FDFCF8; border: 8px solid #00008B; color: #00008B;">
            <h1 style="text-transform: uppercase; font-weight: 900; font-size: 32px; margin-bottom: 24px; letter-spacing: -1px;">You're IN.</h1>
            <p style="font-size: 18px; font-weight: 700; line-height: 1.4; margin-bottom: 24px;">
              Hi ${user.name},<br><br>
              We've reviewed your request. You're exactly the kind of builder we want in VentureLync. 
              No fluff. No performative updates. Just real progress.
            </p>
            <div style="margin-bottom: 32px;">
              <a href="${signupUrl}" style="display: inline-block; background-color: #00008B; color: #FFFFFF; padding: 20px 40px; text-decoration: none; font-weight: 900; text-transform: uppercase; border: 4px solid #00008B; box-shadow: 8px 8px 0px #FFD600;">
                Complete Your Registration
              </a>
            </div>
            <p style="font-size: 14px; font-weight: 700; text-transform: uppercase; opacity: 0.6;">
              Welcome to the inner circle. Let's build.
            </p>
            <hr style="border: none; border-top: 4px solid #00008B; margin: 32px 0;">
            <p style="font-size: 12px; font-weight: 900; text-transform: uppercase;">
              VENTURELYNC. NO BULLSHIT.
            </p>
          </div>
        `,
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Admin waitlist update error:", error);
    return Response.json({ error: "Failed to update entry" }, { status: 500 });
  }
}
