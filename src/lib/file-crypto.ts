import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

const ALGO = "aes-256-gcm" as const;
const IV_LEN = 12;
const TAG_LEN = 16;

export function getSecretKey(): Buffer {
  const secret = process.env.SECRET_KEY?.trim();
  if (!secret || secret.length < 16) {
    throw new Error("SECRET_KEY (min 16 chars) is required");
  }
  if (/^[0-9a-fA-F]{64}$/.test(secret)) {
    return Buffer.from(secret, "hex");
  }
  return createHash("sha256").update(secret, "utf8").digest();
}

export function encryptBuffer(plain: Buffer): Buffer {
  const key = getSecretKey();
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plain), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]);
}

export function decryptBuffer(payload: Buffer): Buffer {
  if (payload.length < IV_LEN + TAG_LEN + 1) {
    throw new Error("Invalid encrypted payload");
  }
  const key = getSecretKey();
  const iv = payload.subarray(0, IV_LEN);
  const tag = payload.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const ciphertext = payload.subarray(IV_LEN + TAG_LEN);
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}
