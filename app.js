// Send button handler: tries Netlify Function (Resend), falls back to mailto.
document.getElementById("emailBtn")?.addEventListener("click", async () => {
  const to = (document.getElementById("emailTo")?.value || "").trim();
  if (!to) { alert("Enter an email address first."); return; }

  const matchup = document.getElementById("matchup")?.innerText || "LSU Event";
  const datetime = document.getElementById("datetime")?.innerText?.replace(/^Date:\s*/,'') || "";
  const venue = document.getElementById("venue")?.innerText?.replace(/^Venue:\s*/,'') || "";
  const seats = document.getElementById("seats")?.innerText?.replace(/^Seats:\s*/,'') || "";

  const subject = `LSU Order – ${matchup}`;
  const body =
`Your order is confirmed.

Event: ${matchup}
When: ${datetime}
Where: ${venue}
Seats: ${seats}

Thank you for your purchase!`;

  try {
    const res = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: to, subject, body })
    });
    if (res.ok) { alert('Receipt emailed!'); return; }
  } catch (_) {}

  // Fallback: open Mail app
  const link = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  location.href = link;
});
