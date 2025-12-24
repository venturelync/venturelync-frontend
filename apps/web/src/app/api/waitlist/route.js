import sql from "@/app/api/utils/sql";
import { sendEmail } from "@/app/api/utils/send-email";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, whatsapp, project, linkedin, twitter, website, role } =
      body;

    if (!name || !email || !whatsapp || !project || !linkedin || !role) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Insert into waitlist
    await sql`
      INSERT INTO waitlist (
        name, email, whatsapp_phone, project_description,
        linkedin_url, twitter_url, website_url, role
      ) VALUES (
        ${name}, ${email}, ${whatsapp}, ${project},
        ${linkedin}, ${twitter || null}, ${website || null}, ${role}
      )
    `;

    // Send welcome email with manifesto and Discord link
    try {
      const fromEmail = "Saswat Mohanty <saswat@venturelync.com>";

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>VentureLync: You chose a side.</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #FDFCF8; min-height: 100vh; color: #00008B;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: white; border: 8px solid #00008B; padding: 40px; box-shadow: 16px 16px 0px #00008B;">
              <div style="font-size: 18px; line-height: 1.6; font-weight: 700;">
                <p style="margin-bottom: 24px;">Hey,</p>
                
                <p style="margin-bottom: 24px;">You did not request an invite. You chose a side.</p>
                
                <p style="margin-bottom: 24px;">VentureLync is not a platform. It is a response.</p>
                
                <p style="margin-bottom: 24px;">A response to fake momentum. To loud timelines with empty days. To founders performing instead of building.</p>
                
                <p style="margin-bottom: 24px;">We believe real work deserves visibility. Not polish. Not exaggeration. Just truth, shown consistently.</p>
                
                <p style="margin-bottom: 24px;">This is a space for builders who show up even when nothing is working. Who document progress and setbacks with the same honesty. Who understand that consistency is louder than talent.</p>
                
                <p style="margin-bottom: 24px;">No vanity. No pretending. No hiding.</p>
                
                <p style="margin-bottom: 24px;">Only real days. Real effort. Real proof.</p>
                
                <p style="margin-bottom: 24px;">Before the product launches, the culture begins.</p>
                
                <p style="margin-bottom: 24px;">We are opening a small build room for early builders shaping this movement from day zero.</p>
                
                <div style="margin: 40px 0; text-align: center;">
                  <p style="margin-bottom: 16px; font-weight: 900;">👉 Join the VentureLync Discord</p>
                  <a href="https://discord.gg/ZWNzqm7nvC" style="display: block; margin-bottom: 24px;">
                    <img src="https://e1a4c9d0d2f9f737c5e1.ucr.io/-/preview/https://api.urlbox.io/v1/NTYqWgJv5s0qDIxN/jpeg?url=https%3A%2F%2Fdiscord.gg%2FZWNzqm7nvC&full_page=true&width=1024&max_height=2048&quality=80" alt="Join Discord" style="width: 100%; max-width: 400px; border: 4px solid #00008B; box-shadow: 8px 8px 0px #FFD600;">
                  </a>
                </div>
                
                <p style="margin-bottom: 24px;">Product invites will roll out in batches soon.</p>
                
                <p style="margin-bottom: 40px;">Until then Keep building. Keep showing up.</p>
                
                <div style="border-top: 4px solid #00008B; padding-top: 24px;">
                  <p style="margin: 0; font-weight: 900; font-size: 20px;">Saswat Mohanty</p>
                  <p style="margin: 0; font-weight: 700;">Founder, VentureLync</p>
                  <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.7;">Making building fun again. Making progress visible.</p>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      const emailText = `
Hey,

You did not request an invite. You chose a side.

VentureLync is not a platform. It is a response.

A response to fake momentum. To loud timelines with empty days. To founders performing instead of building.

We believe real work deserves visibility. Not polish. Not exaggeration. Just truth, shown consistently.

This is a space for builders who show up even when nothing is working. Who document progress and setbacks with the same honesty. Who understand that consistency is louder than talent.

No vanity. No pretending. No hiding.

Only real days. Real effort. Real proof.

Before the product launches, the culture begins.

We are opening a small build room for early builders shaping this movement from day zero.

👉 Join the VentureLync Discord: https://discord.gg/ZWNzqm7nvC

Product invites will roll out in batches soon.

Until then Keep building. Keep showing up.

Saswat Mohanty
Founder, VentureLync
Making building fun again. Making progress visible.
      `;

      await sendEmail({
        to: email,
        from: fromEmail,
        subject: "VentureLync: You chose a side.",
        html: emailHtml,
        text: emailText,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // We don't throw here to avoid blocking the waitlist submission
      // but we log it for the user to see in their logs
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Waitlist submission error:", error);
    return Response.json(
      { error: "Failed to submit waitlist form" },
      { status: 500 },
    );
  }
}
