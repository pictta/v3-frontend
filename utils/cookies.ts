import cookies from 'js-cookie';
import { parseCookies, setCookie, destroyCookie } from 'nookies';

const setAccessToken = (accessToken: string) => {
    setCookie(null, '__session', accessToken, {
        // domain: process.env.NEXT_PUBLIC_DOMAIN,
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
        sameSite: 'strict',
        // secure: true,
        // httpOnly: true,
    });

    // cookies.set('__session', accessToken, {
    //     // domain: process.env.NEXT_PUBLIC_DOMAIN,
    //     sameSite: 'Strict',
    //     expires: 1,
    //     httpOnly: true,
    //     // secure: true
    // });
};

const getAccessToken = () => {
    const accessToken = cookies.get('__session');
    return accessToken || null;
};

const removeAccessToken = () => {
    cookies.remove('__session');
};

// const getAccessToken = (req: IncomingMessage) => {
//     const cookies = cookie.parse(req.headers.cookie || '');
//     return cookies.accessToken || null;
// };

export { setAccessToken, getAccessToken, removeAccessToken };
