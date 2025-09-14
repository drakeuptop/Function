// netlify/functions/send-email.js
// Requires Netlify env var: RESEND_API_KEY = re_********
// In Resend, verify a sender (e.g., tickets@yourdomain.com) and put it below.

import { Resend } from "resend";

export async function handler(event) {
  try {
    const { email, subject, body } = JSON.parse(event.body || "{}");
    if (!email || !subject || !body) {
      return { statusCode: 400, body: JSON.stringify({ ok:false, error:"Missing email/subject/body" }) };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "LSU Tickets <tickets@yourdomain.com>", // change to your verified sender
      to: email,
      subject,
      html: body.replace(/\n/g, "<br>")
    });

    return { statusCode: 200, body: JSON.stringify({ ok:true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ ok:false, error:e.message }) };
  }
}
