/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONVEX_URL: string;
  readonly VITE_DISABLE_INDEXED_DB: string | undefined;
  // more env variables...
}
