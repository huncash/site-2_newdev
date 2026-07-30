import "server-only";

import { mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";

import { decryptBuffer, encryptBuffer } from "./file-crypto";

export interface SignatureMeta {
  id: string;
  mime: "image/png" | "image/jpeg" | "image/webp";
  createdAt: string;
}

interface SignatureIndex {
  activeId: string | null;
  files: Record<string, Omit<SignatureMeta, "id">>;
}

const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/webp"]);

function privateRoot(): string {
  const products = process.env.PRODUCTS_DB_PATH;
  if (products) return dirname(resolve(products));
  return resolve(process.cwd(), "private_data");
}

function signaturesDir(): string {
  return resolve(privateRoot(), "signatures");
}

function indexPath(): string {
  return resolve(signaturesDir(), "index.json");
}

function filePath(id: string): string {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error("Invalid signature id");
  }
  return resolve(signaturesDir(), id);
}

function loadIndex(): SignatureIndex {
  try {
    const raw = readFileSync(indexPath(), "utf-8");
    const parsed = JSON.parse(raw) as SignatureIndex;
    return {
      activeId: typeof parsed.activeId === "string" ? parsed.activeId : null,
      files:
        parsed.files && typeof parsed.files === "object" && !Array.isArray(parsed.files)
          ? parsed.files
          : {},
    };
  } catch {
    return { activeId: null, files: {} };
  }
}

function persistIndex(index: SignatureIndex): void {
  const dir = signaturesDir();
  mkdirSync(dir, { recursive: true });
  const tmp = `${indexPath()}.${process.pid}.tmp`;
  writeFileSync(tmp, JSON.stringify(index, null, 2), "utf-8");
  renameSync(tmp, indexPath());
}

function normalizeMime(mime: string): SignatureMeta["mime"] {
  const m = mime.toLowerCase().split(";")[0]?.trim() ?? "";
  if (m === "image/jpg") return "image/jpeg";
  if (ALLOWED_MIME.has(m)) return m as SignatureMeta["mime"];
  throw new Error("Unsupported image type (png/jpeg/webp)");
}

export function saveEncryptedSignature(
  plainImage: Buffer,
  mimeType: string
): SignatureMeta {
  if (!plainImage.length || plainImage.length > 2 * 1024 * 1024) {
    throw new Error("Image size must be 1 B … 2 MB");
  }
  const mime = normalizeMime(mimeType);
  const id = randomUUID();
  const encrypted = encryptBuffer(plainImage);

  mkdirSync(signaturesDir(), { recursive: true });
  writeFileSync(filePath(id), encrypted);

  const index = loadIndex();
  index.files[id] = { mime, createdAt: new Date().toISOString() };
  index.activeId = id;
  persistIndex(index);

  return { id, mime, createdAt: index.files[id].createdAt };
}

export function loadSignatureDataUrl(id: string): string {
  const index = loadIndex();
  const meta = index.files[id];
  if (!meta) throw new Error("Signature not found");

  const encrypted = readFileSync(filePath(id));
  const plain = decryptBuffer(encrypted);
  const b64 = plain.toString("base64");
  return `data:${meta.mime};base64,${b64}`;
}

export function getActiveSignatureId(): string | null {
  return loadIndex().activeId;
}

export function setActiveSignatureId(id: string | null): void {
  const index = loadIndex();
  if (id && !index.files[id]) throw new Error("Signature not found");
  index.activeId = id;
  persistIndex(index);
}

export function deleteSignature(id: string): void {
  const index = loadIndex();
  if (!index.files[id]) return;
  try {
    unlinkSync(filePath(id));
  } catch {
    /* missing file ok */
  }
  delete index.files[id];
  if (index.activeId === id) index.activeId = null;
  persistIndex(index);
}
