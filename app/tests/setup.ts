import axios from 'axios';

axios.defaults.timeout = 10000;

console.log('🧪 Test environment initialized');

export const TEST_CONFIG = {
  BASE_URL: import.meta.env.BASE_URL,
  TIMEOUT: 10000,
  API_TIMEOUT: 5000,
};

export async function waitForServer(url: string, maxAttempts = 10): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await axios.get(url, { timeout: 2000 });
      return true;
    } catch (error) {
      if (i === maxAttempts - 1) {
        throw new Error(`Server not ready after ${maxAttempts} attempts`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return false;
} 