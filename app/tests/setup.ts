import { afterEach } from 'vitest';
import { vi } from 'vitest';

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});
