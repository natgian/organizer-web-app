async function verifyTurnstile(token, ip) {
  const secret = process.env.CLOUDFLARE_SECRET_KEY;

  if (!secret) {
    throw new Error("Cloudflare secret key is missing.");
  }

  if (!token) {
    throw new Error("Captcha token is missing.");
  }

  // Validate the token by calling the "/siteverify" API
  const formData = new URLSearchParams();
  formData.append("secret", secret);
  formData.append("response", token);
  if (ip) formData.append("remoteip", ip);

  console.log(formData);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await response.json();

    if (!data.success) {
      console.error("Cloudflare Turnstile validation failed:", data);
      throw new Error(`Captcha failed: ${data["error-codes"]?.join(", ") || "Unknown error"}`);
    }
    return true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    throw new Error("Error during captcha validation");
  }
}

module.exports = verifyTurnstile;
