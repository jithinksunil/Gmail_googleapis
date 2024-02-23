import { myTokens } from '../../const';
import { supabase } from '../../utils/supabase';
import { oauth2Client, gmail } from './AuthClient';

export default async function handler(req, res) {
  let { data: tokens } = await supabase
    .from('tokens')
    .select('access_token,refresh_token')
    .eq('email', 'rm2932002@gmail.com')
    .single();
    const resp = await fetch('http://localhost:8000/token');
    const { access_token, refresh_token } = await resp.json();
  oauth2Client.setCredentials({
    access_token: access_token,
    refresh_token: refresh_token,
  });

  const response = await gmail.users.getProfile({
    auth: oauth2Client,
    userId: 'me',
  });

  const email = response.data.emailAddress;
  await supabase
    .from('tokens')
    .update({ nickName: req.body.name })
    .eq('email', email);
  return res.status(200).json({ message: 'Success' });
}
