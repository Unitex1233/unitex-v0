/**
 * UniteX Media Service
 * ─────────────────────────────────────────────
 * Responsibilities:
 *  1. Accept file uploads (images/videos) via POST /upload
 *  2. Compress images using sharp
 *  3. Store files in Docker volume (/app/uploads)
 *  4. Generate SHA-256 hash for blockchain proof
 *  5. Save metadata to Firebase Firestore
 *  6. Write hash + owner (usercode) to blockchain
 */

import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';

import { initFirebase, saveMediaMetadata, updateBlockchainProof } from './services/firebase.js';
import { storeMediaRecord } from './services/blockchain.js';

dotenv.config();

// ─── App Setup ────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

// Ensure upload directory exists (backed by Docker volume)
const UPLOAD_DIR = '/app/uploads';
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Initialize Firebase Admin
initFirebase();

// ─── Multer Config (in-memory, then we process with sharp) ────────────────────
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB max
    },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Unsupported file type: ${file.mimetype}`));
        }
    }
});

// ─── Helper: Hash file buffer ─────────────────────────────────────────────────
function hashBuffer(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
}

// ─── ROUTE: Health check ──────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'unitex-media-service', ts: Date.now() });
});

// ─── ROUTE: Upload media ──────────────────────────────────────────────────────
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { usercode, uid } = req.body;

        if (!usercode || !uid) {
            return res.status(400).json({ error: 'usercode and uid are required' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const isVideo = req.file.mimetype.startsWith('video/');
        const timestamp = Date.now();
        const ext = isVideo ? path.extname(req.file.originalname) : '.webp';
        const filename = `${usercode}_${timestamp}${ext}`;
        const filePath = path.join(UPLOAD_DIR, filename);

        // ── Process file ──────────────────────────────────────────────────────
        let finalBuffer = req.file.buffer;

        if (!isVideo) {
            // Compress and convert image to WebP
            finalBuffer = await sharp(req.file.buffer)
                .resize({ width: 1920, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer();
        }

        // ── Write to Docker volume ────────────────────────────────────────────
        fs.writeFileSync(filePath, finalBuffer);

        // ── Generate SHA-256 hash ─────────────────────────────────────────────
        const fileHash = hashBuffer(finalBuffer);
        const fileSizeBytes = finalBuffer.byteLength;
        const mediaURL = `/media/${filename}`; // served by nginx or this express server

        // ── Duplicate detection ───────────────────────────────────────────────
        // (Future: query Firestore for existing hash before writing)

        // ── Save metadata to Firestore ─────────────────────────────────────────
        const docId = await saveMediaMetadata({
            uid,
            usercode,
            filename,
            mediaURL,
            fileHash,
            fileSizeBytes,
            mimeType: req.file.mimetype,
            isVideo,
            createdAt: new Date().toISOString(),
        });

        // ── Store proof on blockchain ─────────────────────────────────────────
        let txHash = null;
        try {
            txHash = await storeMediaRecord({ fileHash, usercode, docId });
            if (txHash) {
                await updateBlockchainProof(docId, txHash);
                console.log(`[Blockchain] Proof updated in Firestore: ${txHash}`);
            }
        } catch (err) {
            // Blockchain is best-effort — don't fail the upload for it
            console.warn('[Blockchain] Store failed (non-fatal):', err.message);
        }

        res.json({
            success: true,
            docId,
            filename,
            mediaURL,
            fileHash,
            txHash,
        });

    } catch (err) {
        console.error('[Upload Error]', err);
        res.status(500).json({ error: err.message || 'Upload failed' });
    }
});

// ─── ROUTE: Serve uploaded files ──────────────────────────────────────────────
app.use('/media', express.static(UPLOAD_DIR));

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('[Unhandled Error]', err);
    res.status(500).json({ error: err.message });
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`[UniteX Media Service] Running on port ${PORT}`);
});
