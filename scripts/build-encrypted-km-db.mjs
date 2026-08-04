import { createHash, randomBytes, webcrypto } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, "");
const sourceHtml = process.env.KM_SOURCE_HTML || join(root, "search-v1.10.html");
const outputFile = process.env.KM_DB_OUTPUT || join(root, "secure", "km-db.enc.json");
const checksumFile = process.env.KM_DB_SHA256 || join(root, "secure", "km-db.sha256.txt");
const password = process.env.KM_DB_PASSWORD;

if (!password) {
  throw new Error("KM_DB_PASSWORD is required. It is never stored by this script.");
}

function b64(buffer) {
  return Buffer.from(buffer).toString("base64");
}

function extractKmIndex(html) {
  const startMarker = "const KM_INDEX=";
  const start = html.indexOf(startMarker);
  if (start === -1) throw new Error(`KM_INDEX not found in ${sourceHtml}`);
  const dataStart = start + startMarker.length;
  const dataEnd = html.indexOf("];", dataStart);
  if (dataEnd === -1) throw new Error(`KM_INDEX terminator not found in ${sourceHtml}`);
  return JSON.parse(html.slice(dataStart, dataEnd + 1));
}

async function deriveKey(passphrase, salt, iterations) {
  const material = await webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return webcrypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );
}

const html = readFileSync(sourceHtml, "utf8");
const index = extractKmIndex(html);
const plaintext = JSON.stringify(
  {
    schema: "KM_INDEX",
    generatedAt: new Date().toISOString(),
    source: sourceHtml.replace(root, "."),
    count: index.length,
    items: index
  },
  null,
  2
);

const iterations = Number(process.env.KM_DB_ITERATIONS || 310000);
const salt = randomBytes(16);
const iv = randomBytes(12);
const key = await deriveKey(password, salt, iterations);
const ciphertext = await webcrypto.subtle.encrypt(
  { name: "AES-GCM", iv },
  key,
  new TextEncoder().encode(plaintext)
);

const payload = {
  version: "km-db-encrypted-v1",
  cipher: "AES-256-GCM",
  kdf: "PBKDF2-SHA-256",
  iterations,
  salt: b64(salt),
  iv: b64(iv),
  ciphertext: b64(ciphertext),
  createdAt: new Date().toISOString(),
  source: sourceHtml.replace(root, "."),
  count: index.length
};

mkdirSync(dirname(outputFile), { recursive: true });
writeFileSync(outputFile, JSON.stringify(payload, null, 2) + "\n", "utf8");

const digest = createHash("sha256")
  .update(readFileSync(outputFile))
  .digest("hex");
writeFileSync(checksumFile, `${digest}  ${outputFile.split("/").pop()}\n`, "utf8");

console.log(`Encrypted ${index.length} KM items`);
console.log(outputFile);
console.log(checksumFile);
