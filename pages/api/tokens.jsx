import { google } from 'googleapis';
import { gmail, oauth2Client } from './AuthClient';
import base64Url from 'base64url';
const fs = require('fs');
export default async function handler(req, response) {
  const code = req.body.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  const res = await gmail.users.getProfile({
    userId: 'me',
  });
  console.log('email', res.data.emailAddress);
  const messages = await gmail.users.messages.list({
    userId: 'me',
  });
  const msg = await gmail.users.messages.get({
    userId: 'me',
    id: messages.data.messages[0].id,
  });
  console.log('message:', msg);
  // const textContent = extractTextFromMessage(msg.data);
// console.log('textContent:',textContent);
  let fileName;
  if (msg.data?.payload?.parts[1]?.body?.attachmentId) {
    const attachment = await gmail.users.messages.attachments.get({
      userId: 'me',
      messageId: msg.data.id,
      id: msg.data.payload.parts[1].body.attachmentId,
    });
    console.log('attachment:', attachment);

    if (attachment && attachment.data) {
      const data = attachment.data.data;
      const decodedData = base64Url.toBuffer(data);

      // Save the attachment to a file
      fileName = 'Image' + Date.now() + '.jpg';
      fs.writeFileSync(
        `./public/attachmentsDownloaded/${fileName}`,
        decodedData
      );

      console.log('Attachment downloaded successfully.');
    }
  }
  else{
    fileName='noAttachmentInLastEmail'
  }
  return response.status(200).json({
    tokens: { ...tokens },
    email: res.data.emailAddress,
    image: fileName,
    // message:textContent
  });
}


function extractTextFromMessage(message) {
  // The email message may be multi-part MIME, so you need to traverse the parts to find the text/plain part
  const parts = message.payload.parts;
  if (parts && parts.length > 0) {
    for (const part of parts) {
      if (part.mimeType === 'text/plain') {
        // Text content found, decode and return
        const encodedText = part.body.data;
        const decodedText = Buffer.from(encodedText, 'base64').toString();
        return decodedText;
      }
    }
  }

  // If no text/plain part found, check the main payload for text content
  const body = message.payload.body;
  if (body && body.size > 0 && body.data) {
    // Decode and return text content
    const encodedText = body.data;
    const decodedText = Buffer.from(encodedText, 'base64').toString();
    return decodedText;
  }

  // If no text content found, return an empty string
  return '';
}