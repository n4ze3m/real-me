import { setCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next'


export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    setCookie('access_token', '', { req, res, maxAge: -1 });
    setCookie('refresh_token', '', { req, res, maxAge: -1 });
    setCookie('logged_in', '', { req, res, maxAge: -1 });
    res.redirect('/auth')
}
