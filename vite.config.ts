import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [reactRouter(), tailwindcss(), tsconfigPaths()],
  server: {
    host: true,
    port: Number(process.env.PORT) || 5173,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
});
