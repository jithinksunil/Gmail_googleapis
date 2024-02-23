import { myTokens } from '../../const';
import { useTokenStore } from '../../store/token';
import { supabase } from '../../utils/supabase';
import { gmail, oauth2Client } from './AuthClient';

export default async function handler(req, response) {
  // let { data: tokens } = await supabase
  //   .from('tokens')
  //   .select('access_token,refresh_token')
  //   .eq('email', 'jithinksunil96@gmail.com')
  //   .single();
  const res = await fetch('http://localhost:8000/token');
      const { access_token, refresh_token } = await res.json();
    console.log(myTokens);
  oauth2Client.setCredentials({
    access_token,
    refresh_token
  });
  const { data } = await gmail.users.watch({
    userId: 'me',
    requestBody: {
      labelIds: ['INBOX'],
      topicName: `projects/${process.env.PROJECT_ID}/topics/watch_inbox_topic`,
    },
  });
  response.status(200).json({ ...data });
}
