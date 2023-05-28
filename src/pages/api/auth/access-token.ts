import { withIronSession } from "next-iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { NextApiRequestWithSession } from "./callback";

const handler = async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const accessToken = req.session.get("accessToken");
    res.status(200).json({ accessToken });
};

export default withIronSession(handler, {
    password: process.env.IRON_SESSION_PASSWORD!,
    cookieName: 'github-oauth-session',
    cookieOptions: {
        secure: process.env.PROD === 'production',
    },
});