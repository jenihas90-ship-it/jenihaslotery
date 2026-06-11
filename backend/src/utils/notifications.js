const nodemailer = require('nodemailer');

const createTransporter = () => {
    if (process.env.NODE_ENV === 'development' && process.env.ENABLE_EMAIL !== 'true') {
        return null;
    }
    return nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
};

const sendEmail = async ({ to, subject, html }) => {
    if (process.env.ENABLE_EMAIL !== 'true') {
        console.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
        return true;
    }
    const transporter = createTransporter();
    await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
};

const sendSMS = async (phone, message) => {
    if (process.env.ENABLE_SMS !== 'true') {
        console.log(`[SMS MOCK] To: ${phone} | Message: ${message}`);
        return true;
    }
    try {
        const AfricasTalking = require('africastalking');
        const at = AfricasTalking({ apiKey: process.env.AT_API_KEY, username: process.env.AT_USERNAME });
        await at.SMS.send({ to: [phone], message, from: process.env.AT_SENDER_ID });
    } catch (err) {
        console.error('SMS send failed:', err.message);
    }
};

const notifyWinner = async (user, ticket, position, prize) => {
    const positionSuffix = ['', '1st', '2nd', '3rd'][position];
    const emailHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#0a0a1a;color:#fff;padding:30px;border-radius:10px;">
      <h1 style="color:#f5c518;text-align:center;">🎉 Congratulations!</h1>
      <p>Dear <strong>${user.fullName}</strong>,</p>
      <p>You are the <strong>${positionSuffix} place winner</strong> in today's Daily Lottery Draw!</p>
      <div style="background:#1a1a2e;padding:20px;border-radius:8px;text-align:center;margin:20px 0;">
        <p style="color:#10b981;font-size:24px;font-weight:bold;">Prize: ${prize} ETB</p>
        <p>Ticket Number: <strong>${ticket.ticketNumber}</strong></p>
      </div>
      <p>Your prize has been credited to your wallet. Congratulations again!</p>
      <p style="color:#888;font-size:12px;text-align:center;">Daily Lottery System</p>
    </div>
  `;
    await sendEmail({ to: user.email, subject: `🎉 You Won ${prize} ETB in Today's Lottery!`, html: emailHtml });
    await sendSMS(user.phone, `Congratulations ${user.fullName}! You won ${prize} ETB as ${positionSuffix} place in today's lottery! Ticket: ${ticket.ticketNumber}`);
};

const notifyDrawComplete = async (users) => {
    for (const user of users) {
        await sendEmail({
            to: user.email,
            subject: "Today's Lottery Draw is Complete",
            html: `<p>Hi ${user.fullName}, today's lottery draw has completed. Check the winners page to see results!</p>`,
        });
    }
};

module.exports = { sendEmail, sendSMS, notifyWinner, notifyDrawComplete };
