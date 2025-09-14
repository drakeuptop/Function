// When "Send to Email" is tapped, email the order to the entered address.
// Tries Netlify Function + Resend first, falls back to mailto if needed.

document.getElementById("emailBtn")?.addEventListener("click", async () => {
  const to = (document.getElementById("emailTo")?.value || "").trim();
  if (!to) { alert("Enter an email address first."); return; }

  // Build subject/body from the visible ticket block (robust to different markup)
  const ticketEl = document.querySelector(".ticket");
  const text = ticketEl ? ticketEl.innerText.trim() : "LSU Order Details";
  const header = ticketEl?.querySelector("h2")?.innerText?.trim() || "LSU Order";
  const subject = `LSU Order – ${header}`;
  const body = `Your order is confirmed.\n\n${text}\n\nThank you for your purchase!`;

  // Try serverless (Resend) first
  try {
    const res = await fetch("/.netlify/functions/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: to, subject, body })
    });

    if (res.ok) {
      alert("Receipt emailed!");
      return;
    } else {
      const msg = await res.text();
      console.log("Server error:", msg);
    }
  } catch (err) {
    console.log("Network error:", err);
  }

  // Fallback to mailto if function fails/missing
  const link = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  location.href = link;
});
