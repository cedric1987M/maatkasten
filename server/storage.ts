/**
 * Standalone file storage implementation
 * Supports local filesystem storage or S3 (configurable)
 * No Manus Forge API dependency
 */

import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

// Storage configuration
const STORAGE_TYPE = process.env.STORAGE_TYPE || "local"; // "local" or "s3"
const STORAGE_DIR = process.env.STORAGE_DIR || "/tmp/app-storage";
const S3_BUCKET = process.env.AWS_S3_BUCKET;
const S3_REGION = process.env.AWS_S3_REGION || "us-east-1";

/**
 * Local filesystem storage implementation
 */
async function localStoragePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  const filePath = path.join(STORAGE_DIR, key);

  // Create directories if they don't exist
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  // Write file
  if (typeof data === "string") {
    await fs.writeFile(filePath, data, "utf-8");
  } else {
    await fs.writeFile(filePath, data);
  }

  // Return relative URL (in production, you'd use a CDN or public URL)
  const url = `/storage/${key}`;

  return { key, url };
}

async function localStorageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  const url = `/storage/${key}`;

  return { key, url };
}

/**
 * S3 storage implementation (optional)
 */
async function s3StoragePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  if (!S3_BUCKET) {
    throw new Error("S3 storage requires AWS_S3_BUCKET environment variable");
  }

  try {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

    const key = normalizeKey(relKey);
    const client = new S3Client({ region: S3_REGION });

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: typeof data === "string" ? Buffer.from(data) : data,
      ContentType: contentType,
    });

    await client.send(command);

    // Return S3 URL
    const url = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;

    return { key, url };
  } catch (error) {
    throw new Error(`S3 upload failed: ${String(error)}`);
  }
}

async function s3StorageGet(relKey: string): Promise<{ key: string; url: string }> {
  if (!S3_BUCKET) {
    throw new Error("S3 storage requires AWS_S3_BUCKET environment variable");
  }

  const key = normalizeKey(relKey);
  const url = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;

  return { key, url };
}

/**
 * Public API
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  if (STORAGE_TYPE === "s3") {
    return s3StoragePut(relKey, data, contentType);
  }

  return localStoragePut(relKey, data, contentType);
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  if (STORAGE_TYPE === "s3") {
    return s3StorageGet(relKey);
  }

  return localStorageGet(relKey);
}

/**
 * Utility functions
 */
function normalizeKey(relKey: string): string {
  // Add random suffix to prevent enumeration
  const baseName = relKey.replace(/^\/+/, "");
  const ext = path.extname(baseName);
  const nameWithoutExt = baseName.slice(0, -ext.length);
  const randomSuffix = nanoid(8);

  return `${nameWithoutExt}-${randomSuffix}${ext}`;
}

/**
 * Serve local storage files
 * Add this to your Express app:
 * app.use("/storage", express.static(STORAGE_DIR));
 */
export function setupStorageRoutes(app: any) {
  if (STORAGE_TYPE === "local") {
    const express = require("express");
    app.use("/storage", express.static(STORAGE_DIR));
  }
}
