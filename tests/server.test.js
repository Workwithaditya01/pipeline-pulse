const test = require("node:test");
const assert = require("node:assert/strict");
const { createServer } = require("../server");

async function withServer(run) {
  const server = createServer();
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
}

test("homepage returns the Pipeline Pulse app", async () => {
  await withServer(async base => {
    const response = await fetch(base);
    const body = await response.text();
    assert.equal(response.status, 200);
    assert.match(body, /Pipeline Pulse/);
  });
});

test("health endpoint returns an OK status", async () => {
  await withServer(async base => {
    const response = await fetch(`${base}/health`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.deepEqual(body, { status: "ok", app: "pipeline-pulse" });
  });
});

test("unknown paths return 404", async () => {
  await withServer(async base => {
    const response = await fetch(`${base}/missing-page`);
    assert.equal(response.status, 404);
  });
});
