// netlify/functions/send-email.js
import fetch from "node-fetch";

export async function handler(event) {
  try {
    const { email, subject, message } = JSON.parse(event.body);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "orders@yourdomain.com",
        to: email,
        subject,
        html: `<p>${message}</p>`,
      }),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
