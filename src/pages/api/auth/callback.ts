import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { withIronSession, Session } from 'next-iron-session';

export type NextApiRequestWithSession = NextApiRequest & {
  session: Session;
};

const handler = async (
  req: NextApiRequestWithSession,
  res: NextApiResponse
 ) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  try {
    const tokenResponse = await axios.post(
        `https://github.com/login/oauth/access_token?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`,
        {},
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

    if (tokenResponse.status !== 200) {
      throw new Error(`Request failed with status ${tokenResponse.status}`);
    }

    const { access_token: accessToken } = tokenResponse.data;

    // Store the access token in an encrypted HttpOnly cookie
    req.session.set('accessToken', accessToken);
    await req.session.save();

    // Redirect the browser to a success page, or the application's main page
    res.redirect('/gui')
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get access token' });
  }
};



export default withIronSession(handler, {
  password: process.env.IRON_SESSION_PASSWORD!,
  cookieName: 'github-oauth-session',
  cookieOptions: {
    secure: process.env.PROD === 'production',
  },
});
