import sql from "@/app/api/utils/sql";
import { sendEmail } from "@/app/api/utils/send-email";
import crypto from "crypto";

export async function POST(request) {
  try {
    const { identifier } = await request.json(); // Can be email or username

    if (!identifier) {
      return Response.json(
        { error: "Email or username is required" },
        { status: 400 },
      );
    }

    // Find user by email or username
    const users = await sql`
      SELECT au.id, au.email, up.username 
      FROM auth_users au
      LEFT JOIN user_profiles up ON au.id = up.user_id
      WHERE au.email = ${identifier} OR up.username = ${identifier}
      LIMIT 1
    `;

    if (users.length === 0) {
      // For security, don't reveal if user exists
      return Response.json({
        message: "If an account exists, a reset link has been sent.",
      });
    }

    const user = users[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await sql`
      INSERT INTO password_reset_tokens (token, user_id, expires_at)
      VALUES (${token}, ${user.id}, ${expiresAt})
    `;

    const resetLink = `${process.env.APP_URL}/account/reset-password?token=${token}`;

    await sendEmail({
      to: user.email,
      from: "VentureLync <hey@venturelync.com>",
      subject: "Reset your VentureLync password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00008B;">VentureLync</h1>
          <p>You requested a password reset for your VentureLync account.</p>
          <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #00008B; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px;">Reset Password</a>
          <p style="margin-top: 24px; font-size: 12px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return Response.json({
      message: "If an account exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
