// /// <reference types="vite/client" />

// declare module '@react-router/dev/vite' {
//   import { Plugin } from 'vite';
//   export function reactRouter(): Plugin;
// }

// declare module '@tailwindcss/vite' {
//   import { Plugin } from 'vite';
//   const tailwindcss: () => Plugin;
//   export default tailwindcss;
// }

// declare module 'vite-tsconfig-paths' {
//   import { Plugin } from 'vite';
//   const tsconfigPaths: () => Plugin;
//   export default tsconfigPaths;
// }

// // Добавляем типы для process.env
// declare global {
//   namespace NodeJS {
//     interface ProcessEnv {
//       PORT?: string;
//       NODE_ENV?: 'development' | 'production' | 'test';
//     }
//   }
// } 