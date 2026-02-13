const generateBtn = document.getElementById("generateBtn");
const issueStatus = document.getElementById("issueStatus");

const certIdEl = document.getElementById("certId");
const docHashEl = document.getElementById("docHash");
const txHashEl = document.getElementById("txHash");

// Prefill from upload page (demo)
const upload = dbGet("gigproof_upload");
if (upload) {
  document.getElementById("platform2").value = upload.platform || "";
  document.getElementById("months2").value = upload.months || 3;
}

function makeCertId() {
  const n = Math.floor(10000 + Math.random() * 90000);
  const y = new Date().getFullYear();
  return `CERT-${y}-${n}`;
}

// Demo: hash the JSON content (not a real PDF)
async function sha256Text(text) {
  const enc = new TextEncoder().encode(text);
  const hashBuf = await crypto.subtle.digest("SHA-256", enc);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  const hashHex = hashArr.map((b) => b.toString(16).padStart(2, "0")).join("");
  return "0x" + hashHex;
}

generateBtn.addEventListener("click", async () => {
  issueStatus.textContent = "";

  const fullName = document.getElementById("fullName").value.trim();
  const platform = document.getElementById("platform2").value.trim();
  const city = document.getElementById("city").value.trim();
  const income = Number(document.getElementById("income").value || 0);
  const months = Number(document.getElementById("months2").value || 3);
  const userId = document.getElementById("userId").value.trim();

  if (!fullName || !platform || !city || !income || !userId) {
    issueStatus.textContent = "⚠️ Fill all fields to generate certificate.";
    return;
  }

  issueStatus.textContent = "Generating certificate (demo)...";
  await fakeDelay(700);

  const certId = makeCertId();

  // In real app, backend creates PDF. Here we hash a JSON string.
  const certPayload = {
    certId,
    fullName,
    platform,
    city,
    income,
    months,
    userId,
    issuedAt: new Date().toISOString(),
  };

  const docHash = await sha256Text(JSON.stringify(certPayload));

  // Demo tx hash
  const txHash = randHex(64);

  // Save in localStorage as if blockchain + backend stored it
  dbSet(`gigproof_cert_${certId}`, {
    ...certPayload,
    docHash,
    txHash,
  });

  certIdEl.textContent = certId;
  docHashEl.textContent = docHash;
  txHashEl.textContent = txHash;

  issueStatus.textContent = "✅ Certificate generated (demo). You can verify it now.";
});
