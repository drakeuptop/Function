// netlify/functions/send-email.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function handler(event) {
  try {
    const { email } = JSON.parse(event.body || "{}");   // recipient from form
    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: "Recipient email is required" }) };
    }

    const { data, error } = await resend.emails.send({
      from: "LSU Tickets <onboarding@resend.dev>",      // fixed sender
      to: email,                                        // <-- send TO the entered email
      subject: "LSU Order – Football vs. Southern Louisiana",
      html: `
        <p>Your order is confirmed.</p>
        <p><b>Event:</b> LSU SPORT — Football vs. Southern Louisiana</p>
        <p><b>Date:</b> Sat, Sep 20, 2025 • 6:45 PM</p>
        <p><b>Venue:</b> Tiger Stadium</p>
        <p><b>Seats:</b> Sec 101 • Row 30 • Seats 1–2</p>
        <p>Thank you for your purchase!</p>
      `
    });

    if (error) return { statusCode: 500, body: JSON.stringify({ error }) };
    return { statusCode: 200, body: JSON.stringify({ success: true, data }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
}
