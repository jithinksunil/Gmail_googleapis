import { gmail, oauth2Client } from './AuthClient';

export default async function handler(req, res) {
  const {accessToken}=req.query
  console.log('reached');
  console.log(accessToken);
  const result = await gmail.users.messages.list({
    auth: oauth2Client,
    userId: 'me',
  });
    console.log(result);

  res.status(200).json({ success: true });
}
