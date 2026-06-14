import { login, register, getMe } from './src/server/auth';

async function testAuth() {
  const email = `test_${Date.now()}@example.com`;
  const password = 'Password123!';

  console.log('Registering user...');
  const regResult = await register({ data: { email, password } });
  console.log('Register result:', regResult);

  console.log('Logging in user...');
  try {
    const loginResult = await login({ data: { email, password } });
    console.log('Login result:', loginResult);
  } catch (error) {
    console.error('Login failed:', error);
  }
}

testAuth();
