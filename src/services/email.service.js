require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});
// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend-ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to Backend Ledger!';
    const text = `Hello ${name}, \n\nThank you for registering at Backend Ledger.
    We're excited to have you on board!\n\nBest regards, \nThe Backend Ledger Team`;
    const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome Email Preview</title>
        </head>
        <body style="margin:0;padding:0;background:#f0f2f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:40px 0;">
            <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                <!-- HEADER -->
                <tr>
                    <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);border-radius:16px 16px 0 0;padding:48px 48px 40px;text-align:center;">
                    <!-- Logo/Icon -->
                    <div style="width:64px;height:64px;background:linear-gradient(135deg,#e94560,#f5a623);border-radius:16px;margin:0 auto 20px;display:inline-flex;align-items:center;justify-content:center;font-size:28px;line-height:64px;">
                        💳
                    </div>
                    <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">Backend Ledger</h1>
                    <p style="margin:8px 0 0;color:rgba(255,255,255,0.5);font-size:13px;letter-spacing:2px;text-transform:uppercase;">Financial Management Platform</p>
                    </td>
                </tr>

                <!-- BODY -->
                <tr>
                    <td style="background:#ffffff;padding:48px;">

                    <!-- Greeting -->
                    <h2 style="margin:0 0 8px;color:#1a1a2e;font-size:24px;font-weight:700;">Welcome aboard, ${name}! 👋</h2>
                    <p style="margin:0 0 32px;color:#64748b;font-size:15px;line-height:1.6;">
                        Your account has been successfully created. We're thrilled to have you as part of the Backend Ledger community.
                    </p>

                    <!-- Divider -->
                    <div style="height:1px;background:linear-gradient(to right,transparent,#e2e8f0,transparent);margin-bottom:32px;"></div>

                    <!-- Features -->
                    <p style="margin:0 0 20px;color:#1a1a2e;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">What you can do</p>

                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                        <td style="padding:0 0 16px;">
                            <table cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="width:40px;height:40px;background:#f0fdf4;border-radius:10px;text-align:center;vertical-align:middle;font-size:18px;">💰</td>
                                <td style="padding-left:16px;">
                                <p style="margin:0;color:#1a1a2e;font-size:14px;font-weight:600;">Manage Accounts</p>
                                <p style="margin:4px 0 0;color:#64748b;font-size:13px;">Create and manage your financial accounts with ease</p>
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                        <tr>
                        <td style="padding:0 0 16px;">
                            <table cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="width:40px;height:40px;background:#eff6ff;border-radius:10px;text-align:center;vertical-align:middle;font-size:18px;">🔄</td>
                                <td style="padding-left:16px;">
                                <p style="margin:0;color:#1a1a2e;font-size:14px;font-weight:600;">Track Transactions</p>
                                <p style="margin:4px 0 0;color:#64748b;font-size:13px;">Monitor every transaction with real-time updates</p>
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                        <tr>
                        <td style="padding:0 0 0;">
                            <table cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="width:40px;height:40px;background:#fdf4ff;border-radius:10px;text-align:center;vertical-align:middle;font-size:18px;">📊</td>
                                <td style="padding-left:16px;">
                                <p style="margin:0;color:#1a1a2e;font-size:14px;font-weight:600;">Ledger Reports</p>
                                <p style="margin:4px 0 0;color:#64748b;font-size:13px;">Get detailed financial reports and balance summaries</p>
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                    </table>

                    <!-- Divider -->
                    <div style="height:1px;background:linear-gradient(to right,transparent,#e2e8f0,transparent);margin:32px 0;"></div>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                        <td align="center">
                            <a href="#" style="display:inline-block;background:linear-gradient(135deg,#1a1a2e,#0f3460);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:10px;font-size:15px;font-weight:600;letter-spacing:0.3px;">Get Started →</a>
                        </td>
                        </tr>
                    </table>

                    <!-- Security Note -->
                    <div style="margin-top:32px;padding:16px;background:#fffbeb;border-radius:10px;border-left:3px solid #f59e0b;">
                        <p style="margin:0;color:#92400e;font-size:13px;line-height:1.6;">
                        🔒 <strong>Security tip:</strong> Never share your password or token with anyone. Backend Ledger will never ask for your credentials via email.
                        </p>
                    </div>

                    </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                    <td style="background:#f8fafc;border-radius:0 0 16px 16px;padding:32px 48px;text-align:center;border-top:1px solid #e2e8f0;">
                    <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;">
                        You received this email because you registered at Backend Ledger.
                    </p>
                    <p style="margin:0;color:#cbd5e1;font-size:12px;">
                        © 2025 Backend Ledger. All rights reserved.
                    </p>
                    </td>
                </tr>

                </table>
            </td>
            </tr>
        </table>

        </body>
        </html>`;

    await sendEmail (userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail
}