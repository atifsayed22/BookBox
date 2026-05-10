import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"BookBox" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your OTP for BookBox',
      html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px">
        <h2 style="color:#1a73e8;margin-top:0">Verify your email</h2>
        <p>Use the OTP below to complete your signup. It expires in 10 minutes.</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#1f2937;text-align:center;padding:16px 0">${otp}</div>
        <p style="color:#6b7280;font-size:13px">If you didn't request this, please ignore this email.</p>
      </div>
    `,
    });
  } catch (err) {
    console.error('Email send error:', err.message);
    throw err;
  }
};
