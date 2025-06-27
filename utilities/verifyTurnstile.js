async function verifyTurnstile(token, ip) {
  const secret = process.env.CLOUDFLARE_SECRET_KEY;

  // Validate the token by calling the "/siteverify" API
  const formData = new URLSearchParams();
  formData.append("secret", secret);
  formData.append("response", token);
  if (ip) formData.append("remoteip", ip);

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
      throw new Error("Captcha failed");
    }
    return true;
  } catch (error) {
    throw new Error("Error during captcha validation");
  }
}

module.exports = verifyTurnstile;
