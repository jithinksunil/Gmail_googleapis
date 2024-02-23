import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    
  } catch (error) {}
  //   const { recipient, subject, message } = req.body;
  //   const recipient = 'er.jithinksunil@gmail.com';
  //   const subject = 'nothing';
  //   const message = 'somthing';
  //   // Authenticate with Google API using OAuth credentials
  //   const auth = new google.auth.GoogleAuth({
  //     clientId: process.env.CLIENT_ID,
  //     clientSecret: process.env.CLIENT_SECRET,
  //     redirectUri: process.env.REDIRECT_URI,
  //   });
  //   const response = await fetch('http://localhost:8080/token');
  //   const { access_token: accessToken } = await response.json();
  //   console.log(accessToken);
  //   //   const accessToken = req.session.accessToken; // Assuming you have stored the access token in the session
  //   const gmail = google.gmail({
  //     version: 'v1',
  //     auth,
  //   });

  //   try {
  //     // Construct the email message
  //     const email = await gmail.users.messages.send({
  //       userId: 'me',
  //       requestBody: {
  //         raw: await createEmail(recipient, subject, message),
  //       },
  //       auth: {
  //         access_token: accessToken,
  //       },
  //     });

  //     console.log('Email sent:', email.data);

  //     res.status(200).json({ success: true, message: 'Email sent successfully' });
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //     res.status(500).json({ success: false, error: 'Failed to send email' });
  //   }
  res.status(200).json({ success: true });
}

async function createEmail(recipient, subject, message) {
  const emailContent = `
    From: Your Name <your-email@gmail.com>
    To: ${recipient}
    Subject: ${subject}
    
    ${message}
  `;
  const encodedEmail = Buffer.from(emailContent)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return encodedEmail;
}
