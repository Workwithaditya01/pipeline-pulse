const toast = document.querySelector("#toast");
let toastTimer;
function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
document.querySelector("#copy-url").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("http://localhost:3000");
    notify("Local URL copied to clipboard.");
  } catch {
    notify("Open http://localhost:3000 in your browser.");
  }
});
document.querySelector("#run-button").addEventListener("click", () => {
  const button = document.querySelector("#run-button");
  const title = document.querySelector("#run-title");
  const status = document.querySelector("#run-status");
  button.disabled = true;
  button.textContent = "Running demo…";
  status.textContent = "Running";
  status.className = "tag";
  title.textContent = "#109 · main";
  notify("Demo pipeline started. In a real project, GitHub Actions runs the workflow.");
  setTimeout(() => {
    status.textContent = "Passed";
    status.className = "tag success";
    document.querySelector("#run-time").textContent = "Just now";
    button.disabled = false;
    button.innerHTML = "<span>▶</span> Run demo pipeline";
    notify("Demo pipeline completed successfully.");
  }, 1800);
});
