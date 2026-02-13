const verifyBtn = document.getElementById("verifyBtn");
const verifyStatus = document.getElementById("verifyStatus");

const resultBadge = document.getElementById("resultBadge");
const resultText = document.getElementById("resultText");
const computedHashEl = document.getElementById("computedHash");
const onchainHashEl = document.getElementById("onchainHash");

function setBadgeClass(type) {
  resultBadge.classList.remove("ok", "bad", "warn");

  if (type === "VERIFIED") resultBadge.classList.add("ok");
  else if (type === "TAMPERED") resultBadge.classList.add("bad");
  else resultBadge.classList.add("warn");
}

function setResult(type, text) {
  resultBadge.textContent = type;
  resultText.textContent = text;
  setBadgeClass(type);
}

async function sha256Text(text) {
  const enc = new TextEncoder().encode(text);
  const hashBuf = await crypto.subtle.digest("SHA-256", enc);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  const hashHex = hashArr.map((b) => b.toString(16).padStart(2, "0")).join("");
  return "0x" + hashHex;
}

verifyBtn.addEventListener("click", async () => {
  verifyStatus.textContent = "";

  const certId = document.getElementById("verifyCertId").value.trim();
  const file = document.getElementById("verifyFile").files?.[0];

  if (!certId) {
    verifyStatus.textContent = "⚠️ Enter a certificate ID.";
    return;
  }

  const saved = dbGet(`gigproof_cert_${certId}`);

  if (!saved) {
    setResult(
      "NOT FOUND",
      "No record found for this certificate ID. Please issue a certificate first."
    );
    computedHashEl.textContent = "—";
    onchainHashEl.textContent = "—";
    return;
  }

  verifyStatus.textContent = "Verifying...";
  await fakeDelay(650);

  let computedHash;

  // UI-only logic:
  // (Later you will hash the actual PDF, and compare with blockchain hash.)
  if (file) computedHash = await sha256Text(file.name + "|" + file.size);
  else computedHash = await sha256Text("no-file");

  const onchainHash = saved.docHash;

  computedHashEl.textContent = computedHash;
  onchainHashEl.textContent = onchainHash;

  if (!file) {
    setResult("WARNING", "Upload the issued certificate PDF to verify authenticity.");
    verifyStatus.textContent = "";
    return;
  }

  if (computedHash === onchainHash) {
    setResult("VERIFIED", "Certificate is authentic. Hash matches blockchain record.");
  } else {
    setResult("TAMPERED", "Certificate does not match blockchain hash. It may be edited or fake.");
  }

  verifyStatus.textContent = "";
});

setResult("WARNING", "Upload a certificate and verify.");
