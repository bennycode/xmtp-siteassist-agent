import { createHash } from "node:crypto";

export function uuidv4FromId(id: string): string {
  // 1) Hash to 32 bytes, take first 16
  const hash = createHash("sha256").update(id, "utf8").digest();
  const b = Uint8Array.from(hash.subarray(0, 16));

  // 2) Set version 4 and RFC 4122 variant
  b[6] = (b[6] & 0x0f) | 0x40; // version
  b[8] = (b[8] & 0x3f) | 0x80; // variant

  return bytesToUuid(b);
}

function bytesToUuid(b: Uint8Array): string {
  const hex = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
}
