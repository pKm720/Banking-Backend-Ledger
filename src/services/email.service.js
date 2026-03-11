require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD
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
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error);
     return { success: false, error }
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

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Confirmation – Backend Ledger';
    const text = `Hello ${name}, a transaction of $${amount} to account ${toAccount} was processed successfully.`;
    const html = `<!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Transaction Confirmation</title>
            </head>
            <body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Georgia',serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:48px 16px;">
                <tr>
                <td align="center">
                    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

                    <!-- Header -->
                    <tr>
                        <td style="background-color:#111111;border:1px solid #2a2a2a;border-bottom:3px solid #c9a84c;padding:36px 40px;text-align:center;border-radius:4px 4px 0 0;">
                        <p style="margin:0 0 8px 0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#c9a84c;">Backend Ledger</p>
                        <h1 style="margin:0;font-size:26px;font-weight:400;color:#f5f0e8;letter-spacing:1px;">Transaction Confirmed</h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="background-color:#161616;border:1px solid #2a2a2a;border-top:none;padding:40px;">

                        <p style="margin:0 0 24px 0;font-size:15px;color:#a89880;line-height:1.7;">
                            Dear <span style="color:#f5f0e8;font-weight:600;">${name}</span>,
                        </p>
                        <p style="margin:0 0 32px 0;font-size:15px;color:#a89880;line-height:1.7;">
                            Your transaction has been processed successfully. Here's a summary:
                        </p>

                        <!-- Transaction Details Box -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1e1a14;border:1px solid #c9a84c33;border-radius:4px;margin-bottom:32px;">
                            <tr>
                            <td style="padding:20px 24px;border-bottom:1px solid #2a2a2a;">
                                <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9a84c;">Amount Sent</p>
                                <p style="margin:6px 0 0 0;font-size:28px;color:#f5f0e8;letter-spacing:1px;">$${amount}</p>
                            </td>
                            </tr>
                            <tr>
                            <td style="padding:20px 24px;">
                                <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9a84c;">Recipient Account</p>
                                <p style="margin:6px 0 0 0;font-size:15px;color:#f5f0e8;font-family:'Courier New',monospace;letter-spacing:1px;">${toAccount}</p>
                            </td>
                            </tr>
                        </table>

                        <p style="margin:0 0 8px 0;font-size:13px;color:#6b5f4e;line-height:1.7;">
                            If you did not authorize this transaction, please contact our support team immediately.
                        </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#111111;border:1px solid #2a2a2a;border-top:none;padding:24px 40px;text-align:center;border-radius:0 0 4px 4px;">
                        <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4a4035;">
                            © ${new Date().getFullYear()} Backend Ledger · All rights reserved
                        </p>
                        </td>
                    </tr>

                    </table>
                </td>
                </tr>
            </table>
            </body>
            </html>`;
    await sendEmail (userEmail, subject, text, html)
}

async function transactionFailedEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Failed – Backend Ledger';
    const text = `Hello ${name}, your transaction of $${amount} to account ${toAccount} has failed. Please try again or contact support.`;
    const html = `<!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Transaction Failed</title>
                </head>
                <body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Georgia',serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:48px 16px;">
                    <tr>
                    <td align="center">
                        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

                        <!-- Header -->
                        <tr>
                            <td style="background-color:#111111;border:1px solid #2a2a2a;border-bottom:3px solid #c0392b;padding:36px 40px;text-align:center;border-radius:4px 4px 0 0;">
                            <p style="margin:0 0 8px 0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#c0392b;">Backend Ledger</p>
                            <h1 style="margin:0;font-size:26px;font-weight:400;color:#f5f0e8;letter-spacing:1px;">Transaction Failed</h1>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="background-color:#161616;border:1px solid #2a2a2a;border-top:none;padding:40px;">

                            <!-- Alert Banner -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1e1010;border:1px solid #c0392b44;border-left:3px solid #c0392b;border-radius:4px;margin-bottom:32px;">
                                <tr>
                                <td style="padding:16px 20px;">
                                    <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#c0392b;">⚠ Transaction Unsuccessful</p>
                                </td>
                                </tr>
                            </table>

                            <p style="margin:0 0 24px 0;font-size:15px;color:#a89880;line-height:1.7;">
                                Dear <span style="color:#f5f0e8;font-weight:600;">${name}</span>,
                            </p>
                            <p style="margin:0 0 32px 0;font-size:15px;color:#a89880;line-height:1.7;">
                                Unfortunately, your transaction could not be completed. Here are the details:
                            </p>

                            <!-- Transaction Details Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1e1010;border:1px solid #c0392b33;border-radius:4px;margin-bottom:32px;">
                                <tr>
                                <td style="padding:20px 24px;border-bottom:1px solid #2a2a2a;">
                                    <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c0392b;">Amount</p>
                                    <p style="margin:6px 0 0 0;font-size:28px;color:#f5f0e8;letter-spacing:1px;text-decoration:line-through;opacity:0.6;">$${amount}</p>
                                </td>
                                </tr>
                                <tr>
                                <td style="padding:20px 24px;border-bottom:1px solid #2a2a2a;">
                                    <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c0392b;">Recipient Account</p>
                                    <p style="margin:6px 0 0 0;font-size:15px;color:#f5f0e8;font-family:'Courier New',monospace;letter-spacing:1px;">${toAccount}</p>
                                </td>
                                </tr>
                                <tr>
                                <td style="padding:20px 24px;">
                                    <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c0392b;">Status</p>
                                    <p style="margin:6px 0 0 0;font-size:13px;color:#c0392b;letter-spacing:1px;">● FAILED</p>
                                </td>
                                </tr>
                            </table>

                            <p style="margin:0 0 8px 0;font-size:13px;color:#6b5f4e;line-height:1.7;">
                                This may be due to insufficient funds, a network issue, or a security hold. 
                                Please verify your account details and try again. If the issue persists, contact our support team.
                            </p>

                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color:#111111;border:1px solid #2a2a2a;border-top:none;padding:24px 40px;text-align:center;border-radius:0 0 4px 4px;">
                            <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4a4035;">
                                © ${new Date().getFullYear()} Backend Ledger · All rights reserved
                            </p>
                            </td>
                        </tr>

                        </table>
                    </td>
                    </tr>
                </table>
                </body>
                </html>`;
    await sendEmail (userEmail, subject, text, html)
}




module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    transactionFailedEmail,
}