import axios from 'axios';

export const TEST_CONFIG = {
  BASE_URL: "http://localhost:3000",
  TIMEOUT: 10000,
};

axios.defaults.timeout = TEST_CONFIG.TIMEOUT;

console.log('🧪 Test environment initialized');

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