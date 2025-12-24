export async function sendEmail({ to, from, subject, html, text }) {
  if (!process.env.RESEND_API_KEY) {
    console.error(
      "❌ MISSING API KEY: Please add 'RESEND_API_KEY' to your Project Settings -> Secrets.",
    );
    throw new Error("Email service not configured. Missing RESEND_API_KEY.");
  }

  // Resend requires a verified domain to send from custom addresses.
  // If the user hasn't verified venturelync.com, this will fail.
  // We'll use a fallback if the provided 'from' is likely to fail,
  // but for now we'll keep it as requested and add better error handling.

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: from || "VentureLync <onboarding@resend.dev>",
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ Resend API Error:", JSON.stringify(data, null, 2));
    if (data.message?.includes("not verified")) {
      console.error(
        "💡 TIP: You need to verify your domain in the Resend dashboard to send from custom addresses.",
      );
    }
    throw new Error(data.message || "Failed to send email");
  }

  return { id: data.id };
}
