import { getIronSession } from 'iron-session';

export const sessionOptions = {
  password: 'complex_password_at_least_32_characters_long_!', // In production, use environment variable
  cookieName: 'savings-app-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getSession(request: Request, response: Response) {
  const session = await getIronSession(request, response, sessionOptions);
  return session;
}

declare module 'iron-session' {
  interface IronSessionData {
    userId?: string;
  }
}
