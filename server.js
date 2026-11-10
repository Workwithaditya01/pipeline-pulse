const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const publicDir = path.join(__dirname, "public");
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml"
};

function createServer() {
  return http.createServer((req, res) => {
    const pathname = new URL(req.url, "http://localhost").pathname;

    if (pathname === "/health") {
      res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify({ status: "ok", app: "pipeline-pulse" }));
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { "content-type": "text/plain; charset=utf-8" });
      return res.end("Method not allowed");
    }

    const requestedPath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const filePath = path.resolve(publicDir, requestedPath);

    if (!filePath.startsWith(publicDir + path.sep)) {
      res.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
      return res.end("Forbidden");
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
        return res.end("Not found");
      }
      res.writeHead(200, {
        "content-type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
        "cache-control": "no-cache"
      });
      if (req.method === "HEAD") return res.end();
      res.end(content);
    });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  createServer().listen(port, "0.0.0.0", () => {
    console.log(`Pipeline Pulse is running on http://0.0.0.0:${port}`);
  });
}

module.exports = { createServer };
