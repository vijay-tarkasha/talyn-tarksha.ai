// vite.config.ts
import { defineConfig } from "file:///C:/Work/alita_ui-main/alita_ui-main/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Work/alita_ui-main/alita_ui-main/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tailwindcss from "file:///C:/Work/alita_ui-main/alita_ui-main/node_modules/@tailwindcss/vite/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://alita-core-api.onrender.com",
        secure: false,
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    },
    open: true,
    port: 3e3,
    host: "0.0.0.0"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxXb3JrXFxcXGFsaXRhX3VpLW1haW5cXFxcYWxpdGFfdWktbWFpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcV29ya1xcXFxhbGl0YV91aS1tYWluXFxcXGFsaXRhX3VpLW1haW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1dvcmsvYWxpdGFfdWktbWFpbi9hbGl0YV91aS1tYWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSdcblxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSxcbiAgICB0YWlsd2luZGNzcygpXG4gIF0sXG4gIHNlcnZlcjoge1xuICAgIHByb3h5OiB7XG4gICAgICBcIi9hcGlcIjoge1xuICAgICAgICB0YXJnZXQ6IFwiaHR0cHM6Ly9hbGl0YS1jb3JlLWFwaS5vbnJlbmRlci5jb21cIixcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICB3czp0cnVlLFxuICAgICAgICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKVxuICAgICAgfVxuICAgIH0sXG4gICAgb3BlbjogdHJ1ZSxcbiAgICBwb3J0OiAzMDAwLFxuICAgIGhvc3Q6IFwiMC4wLjAuMFwiXG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1TLFNBQVMsb0JBQW9CO0FBQ2hVLE9BQU8sV0FBVztBQUNsQixPQUFPLGlCQUFpQjtBQUd4QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFBQyxNQUFNO0FBQUEsSUFDZCxZQUFZO0FBQUEsRUFDZDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsSUFBRztBQUFBLFFBQ0gsU0FBUyxVQUFRLEtBQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxNQUM1QztBQUFBLElBQ0Y7QUFBQSxJQUNBLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
