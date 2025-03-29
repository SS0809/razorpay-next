import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password, recaptchaToken } = req.body;

  if (!email || !password || !recaptchaToken) {
    return res.status(400).json({ message: "Missing fields." });
  }

  try {
    // Verify reCAPTCHA with Google
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: recaptchaSecret || "",
        response: recaptchaToken,
      }).toString(),
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return res.status(400).json({ message: "reCAPTCHA verification failed." });
    }

    // Proceed with registration logic
    return res.status(200).json({ message: "Registration successful!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
