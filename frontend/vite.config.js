import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Accepts any incoming connection (localhost or network)
    //port: 3000, // Change to your desired port (avoid conflicts)
    hmr: {
      host: '0.0.0.0', // Match server.host for Hot Module Replacement
    },
    port: 5173 // change here
  },
})
