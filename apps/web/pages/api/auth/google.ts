import { NextApiRequest, NextApiResponse } from 'next';
import getGoogleOAuth2Client from './googleAuth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const client = getGoogleOAuth2Client();
    const url = client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar.readonly',
      ],
    });
    res.redirect(url);
  } else {
    res.status(405).end();
  }
}