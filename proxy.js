const express = require("express");
const cors = require("cors");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Add a route for the root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 8000;

// Set up the proxy middleware for dynamic document URLs
app.use(
  "/proxy",
  (req, res, next) => {
    // Get the SharePoint URL from the query parameter
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).send('URL parameter is required');
    }

    // Create proxy middleware dynamically based on the target URL
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        // Add headers necessary for iframe compatibility
        proxyReq.setHeader("X-Frame-Options", "ALLOW-FROM *");
        proxyReq.setHeader("Content-Security-Policy", "frame-ancestors 'self' *");
      },
      onProxyRes: (proxyRes, req, res) => {
        // Add headers to allow iframe embedding
        proxyRes.headers["X-Frame-Options"] = "ALLOW-FROM *";
        proxyRes.headers["Content-Security-Policy"] = "frame-ancestors 'self' *";

        // Modify location headers if present
        if (proxyRes.headers["location"]) {
          const newLocation = proxyRes.headers["location"].replace(
            targetUrl,
            `http://localhost:${PORT}/proxy?url=${encodeURIComponent(targetUrl)}`
          );
          proxyRes.headers["location"] = newLocation;
        }
      },
    });

    // Call the proxy middleware
    proxy(req, res, next);
  }
);

// Add a general middleware to set headers for all routes
app.use((req, res, next) => {
  res.header("X-Frame-Options", "ALLOW-FROM *");
  res.header("Content-Security-Policy", "frame-ancestors 'self' *");
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server is running at http://localhost:${PORT}`);
});