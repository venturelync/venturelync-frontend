import sql from "@/app/api/utils/sql";
import { hash } from "argon2";

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return Response.json(
        { error: "Token and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    // Find valid token
    const tokens = await sql`
      SELECT * FROM password_reset_tokens
      WHERE token = ${token} AND used = false AND expires_at > now()
      LIMIT 1
    `;

    if (tokens.length === 0) {
      return Response.json(
        { error: "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    const resetToken = tokens[0];
    const hashedPassword = await hash(password);

    // Update password and mark token as used
    await sql.transaction([
      sql`
        UPDATE auth_accounts
        SET password = ${hashedPassword}
        WHERE "userId" = ${resetToken.user_id} AND provider = 'credentials'
      `,
      sql`
        UPDATE password_reset_tokens
        SET used = true
        WHERE id = ${resetToken.id}
      `,
    ]);

    return Response.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
