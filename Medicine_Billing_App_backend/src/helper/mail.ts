import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP ERROR:", error);
  } else {
    console.log("SMTP READY");
  }
});

export const email_verification_mail = async (email: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: `"Zazzi App" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Email Verification OTP",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f2f3f8; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background:#F43939; padding:25px; text-align:center; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff;">Zazzi App</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333;">
              <h2>Email Verification</h2>

              <p>
                Thank you for registering with <strong>Zazzi App</strong>.
              </p>

              <p>
                Please use the OTP below to verify your email address:
              </p>

              <!-- OTP -->
              <div style="text-align:center; margin:30px 0;">
                <span style="
                  display:inline-block;
                  padding:15px 30px;
                  font-size:28px;
                  letter-spacing:6px;
                  font-weight:bold;
                  background:#f2f3f8;
                  color:#F43939;
                  border-radius:6px;
                ">
                  ${otp}
                </span>
              </div>

              <p style="color:#555;">
                ⏱ This OTP is valid for <strong>10 minutes</strong>.
              </p>

              <p style="color:#555;">
                If you did not request this verification, please ignore this email.
              </p>

              <p style="margin-top:40px;">
                Regards,<br/>
                <strong>Zazzi App Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px; text-align:center; font-size:12px; color:#999;">
              © ${new Date().getFullYear()} Zazzi App. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    return true;
  } catch (error) {
    console.error("Mail error:", error);
    return false;
  }
};