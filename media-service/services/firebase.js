// Local file-based replacement for Firebase Admin used in media-service for MVP
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const MEDIA_PATH = path.join(DATA_DIR, 'media.json');

export function initFirebase() {
  // no-op for local storage
  return;
}

function readMedia() {
  if (!fs.existsSync(MEDIA_PATH)) return {};
  try { return JSON.parse(fs.readFileSync(MEDIA_PATH, 'utf8')); } catch (e) { return {}; }
}

function writeMedia(obj) { fs.writeFileSync(MEDIA_PATH, JSON.stringify(obj, null, 2)); }

export async function saveMediaMetadata(data) {
  const store = readMedia();
  const id = 'm-' + Date.now();
  store[id] = {
    id,
    ...data,
    blockchainProof: null
  };
  writeMedia(store);
  console.log(`[LocalMedia] Saved media metadata: ${id}`);
  return id;
}

export async function updateBlockchainProof(docId, txHash) {
  const store = readMedia();
  if (!store[docId]) return;
  store[docId].blockchainProof = txHash;
  writeMedia(store);
  console.log(`[LocalMedia] Updated blockchainProof for ${docId}`);
}
