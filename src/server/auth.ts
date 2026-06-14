import { createServerFn } from '@tanstack/react-start';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getSession } from './session';
import { getRequest, setResponseHeader } from '@tanstack/react-start/server';

export const register = createServerFn({ method: 'POST' })
  .handler(async ({ data }) => {
    const { email, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    await db.insert(users).values({ id: userId, email, password: hashedPassword });
    return { success: true };
  });

export const login = createServerFn({ method: 'POST' })
  .handler(async ({ data }) => {
    const { email, password } = data;
    const user = await db.select().from(users).where(eq(users.email, email)).get();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    
    const request = getRequest();
    const response = new Response();
    const session = await getSession(request, response);
    session.userId = user.id;
    await session.save();
    
    const setCookie = response.headers.get('Set-Cookie');
    if (setCookie) {
      setResponseHeader('Set-Cookie', setCookie);
    }
    
    return { success: true };
  });

export const logout = createServerFn({ method: 'POST' })
  .handler(async () => {
    const request = getRequest();
    const response = new Response();
    const session = await getSession(request, response);
    session.destroy();
    
    const setCookie = response.headers.get('Set-Cookie');
    if (setCookie) {
      setResponseHeader('Set-Cookie', setCookie);
    }
    
    return { success: true };
  });

export const getMe = createServerFn({ method: 'GET' })
  .handler(async () => {
    const request = getRequest();
    const response = new Response();
    const session = await getSession(request, response);
    return { userId: session.userId };
  });
