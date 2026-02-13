/*
  API helper.
  Later you will connect these functions to your Express backend.
*/

const API_BASE = "http://localhost:5000"; // change later

function fakeDelay(ms = 600) {
  return new Promise((res) => setTimeout(res, ms));
}

function randHex(len) {
  const chars = "0123456789abcdef";
  let out = "0x";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// SHA-256 hash for file (works in modern browsers)
async function sha256File(file) {
  const buf = await file.arrayBuffer();
  const hashBuf = await crypto.subtle.digest("SHA-256", buf);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  const hashHex = hashArr.map((b) => b.toString(16).padStart(2, "0")).join("");
  return "0x" + hashHex;
}

// Demo-only: localStorage acts like backend DB
function dbGet(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function dbSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
