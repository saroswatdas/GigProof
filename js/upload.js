const fileInput = document.getElementById("fileInput");
const chooseBtn = document.getElementById("chooseBtn");
const dropZone = document.getElementById("dropZone");
const uploadBtn = document.getElementById("uploadBtn");
const fileList = document.getElementById("fileList");
const uploadStatus = document.getElementById("uploadStatus");

let selectedFiles = [];

function renderFiles() {
  fileList.innerHTML = "";

  if (selectedFiles.length === 0) {
    fileList.innerHTML = `<div class="muted">No files selected yet.</div>`;
    return;
  }

  selectedFiles.forEach((f) => {
    const el = document.createElement("div");
    el.className = "fileItem";
    el.innerHTML = `
      <div>
        <div class="fileItem__name">${f.name}</div>
        <div class="fileItem__meta">${Math.round(f.size / 1024)} KB</div>
      </div>
      <div class="mono">ready</div>
    `;
    fileList.appendChild(el);
  });
}

chooseBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
  selectedFiles = Array.from(e.target.files || []);
  uploadStatus.textContent = "";
  renderFiles();
});

// drag & drop
["dragenter", "dragover"].forEach((evt) => {
  dropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "rgba(29,78,216,0.8)";
  });
});

["dragleave", "drop"].forEach((evt) => {
  dropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "rgba(255,255,255,0.18)";
  });
});

dropZone.addEventListener("drop", (e) => {
  const files = Array.from(e.dataTransfer.files || []);
  if (files.length) {
    selectedFiles = files;
    renderFiles();
  }
});

uploadBtn.addEventListener("click", async () => {
  if (selectedFiles.length === 0) {
    uploadStatus.textContent = "⚠️ Please choose at least one file.";
    return;
  }

  uploadStatus.textContent = "Uploading (demo)...";
  await fakeDelay(800);

  // Demo: store basic upload metadata
  const payload = {
    uploadedAt: Date.now(),
    platform: document.getElementById("platform").value,
    months: Number(document.getElementById("months").value || 3),
    files: selectedFiles.map((f) => ({ name: f.name, size: f.size, type: f.type })),
  };

  dbSet("gigproof_upload", payload);

  uploadStatus.textContent = "✅ Uploaded (demo). Redirecting to Issue page...";

  setTimeout(() => {
    window.location.href = "issue.html";
  }, 700);
});

renderFiles();
