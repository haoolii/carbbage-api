import env from "../config/env";

export const verifyCaptcha = async (token: string, ip?: string) => {
  try {
    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    const result = await fetch(url, {
      body: JSON.stringify({
        secret:
          env.NODE_ENV === "development"
            ? "1x0000000000000000000000000000000AA"
            : env.CLOUDFLARE_TURMSTILE_SECRET_KEY,
        response: token,
        remoteip: ip,
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const outcome = await result.json();

    if (outcome.success) {
      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
};
