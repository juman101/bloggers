import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://blogsite-1-t9dm.onrender.com', // Your backend URL
        secure: false, // If the target is using HTTPS and you don't want to verify the SSL certificate
        changeOrigin: true, // Needed for virtual hosted sites
      },
    },
  },
  plugins: [react()],
});
