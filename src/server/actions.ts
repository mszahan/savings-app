import { createServerFn } from '@tanstack/react-start';
import { db } from './db';
import { projects, transactions } from './db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { getSession } from './session';
import { getWebRequest, getWebResponse } from '@tanstack/react-start/server';

export const getProjects = createServerFn({ method: 'GET' })
  .handler(async () => {
    const request = getWebRequest();
    const response = getWebResponse();
    const session = await getSession(request, response);
    if (!session.userId) throw new Error('Unauthorized');
    return await db.select().from(projects).where(eq(projects.userId, session.userId));
  });

export const createProject = createServerFn({ method: 'POST' })
  .handler(async ({ data }) => {
    const request = getWebRequest();
    const response = getWebResponse();
    const session = await getSession(request, response);
    if (!session.userId) throw new Error('Unauthorized');
    const { name } = data;
    const id = uuidv4();
    await db.insert(projects).values({ id, userId: session.userId, name });
    return { id };
  });

export const getTransactions = createServerFn({ method: 'GET' })
  .handler(async ({ data }) => {
    const request = getWebRequest();
    const response = getWebResponse();
    const session = await getSession(request, response);
    if (!session.userId) throw new Error('Unauthorized');
    const { projectId } = data;
    return await db.select().from(transactions).where(eq(transactions.projectId, projectId));
  });

export const addTransaction = createServerFn({ method: 'POST' })
  .handler(async ({ data }) => {
    const request = getWebRequest();
    const response = getWebResponse();
    const session = await getSession(request, response);
    if (!session.userId) throw new Error('Unauthorized');
    const { projectId, type, amount, description, date } = data;
    const id = uuidv4();
    await db.insert(transactions).values({ id, projectId, type, amount, description, date });
    return { success: true };
  });
