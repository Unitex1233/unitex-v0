require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool } = require('./db');
const scraper = require('./scraper');

const app = express();
const port = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.body) console.log('Body:', JSON.stringify(req.body));
    next();
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Rewards & Points System
const pointsService = require('./services/points');
const connectionsService = require('./services/connections');

// Connection System API
app.post('/api/connect/send', async (req, res) => {
    const { senderId, receiverId } = req.body;
    try {
        const result = await connectionsService.sendRequest(senderId, receiverId);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/connect/requests/:uid', async (req, res) => {
    try {
        const requests = await connectionsService.getIncomingRequests(req.params.uid);
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/connect/accept', async (req, res) => {
    const { requestId, senderId, receiverId } = req.body;
    try {
        const result = await connectionsService.acceptRequest(requestId, senderId, receiverId);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/connect/reject', async (req, res) => {
    const { requestId } = req.body;
    try {
        const result = await connectionsService.rejectRequest(requestId);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/connect/status', async (req, res) => {
    const { senderId, receiverId } = req.query;
    try {
        const status = await connectionsService.getConnectionStatus(senderId, receiverId);
        res.json({ status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/connect/remove', async (req, res) => {
    const { user1Id, user2Id } = req.body;
    try {
        const result = await connectionsService.removeConnection(user1Id, user2Id);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/points/:uid', async (req, res) => {
    try {
        const stats = await pointsService.getStats(req.params.uid);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/points/award', async (req, res) => {
    const { uid, action } = req.body;
    try {
        const result = await pointsService.awardPoints(uid, action);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

const fs = require('fs');
const path = require('path');

// Local discovery feed endpoint (reads fallback or feed file)
app.get('/api/discover', (req, res) => {
    try {
        const dataDir = path.join(__dirname, '../../data');
        const feedPath = path.join(dataDir, 'discover_feed.json');
        const fallbackPath = path.join(dataDir, 'discover_fallback.json');
        let payload = [];
        if (fs.existsSync(feedPath)) payload = JSON.parse(fs.readFileSync(feedPath, 'utf8'));
        else if (fs.existsSync(fallbackPath)) payload = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
        return res.json(payload);
    } catch (e) {
        console.error('Error reading discover feed:', e.message);
        return res.status(500).json({ error: 'Failed to read discover feed' });
    }
});

// Media metadata endpoint (simple file-backed store)
app.post('/api/media', (req, res) => {
    try {
        const dataDir = path.join(__dirname, '../../data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        const mediaPath = path.join(dataDir, 'media.json');
        let store = {};
        if (fs.existsSync(mediaPath)) {
            try { store = JSON.parse(fs.readFileSync(mediaPath, 'utf8')); } catch (e) { store = {}; }
        }
        const id = 'm-' + Date.now();
        store[id] = { id, ...req.body };
        fs.writeFileSync(mediaPath, JSON.stringify(store, null, 2));
        return res.json({ success: true, id });
    } catch (e) {
        console.error('Failed to save media metadata:', e.message);
        return res.status(500).json({ error: 'Failed to save media metadata' });
    }
});

// Users endpoints (file-backed)
// Get all users
app.get('/api/users', (req, res) => {
    try {
        const dataDir = path.join(__dirname, '../../data');
        const usersPath = path.join(dataDir, 'users.json');
        if (!fs.existsSync(usersPath)) return res.json({});
        const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        // Return as array if it's an object
        const usersArray = Array.isArray(users) ? users : Object.values(users);
        return res.json(usersArray);
    } catch (e) {
        console.error('Failed to read users:', e.message);
        return res.status(500).json({ error: 'Failed to read users' });
    }
});

// Get single user by UID
app.get('/api/users/:uid', (req, res) => {
    try {
        const dataDir = path.join(__dirname, '../../data');
        const usersPath = path.join(dataDir, 'users.json');
        if (!fs.existsSync(usersPath)) return res.status(404).json({ error: 'User not found' });
        const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        const u = users[req.params.uid];
        if (!u) return res.status(404).json({ error: 'User not found' });
        return res.json(u);
    } catch (e) {
        console.error('Failed to read user:', e.message);
        return res.status(500).json({ error: 'Failed to read user' });
    }
});

app.post('/api/users', (req, res) => {
    try {
        const dataDir = path.join(__dirname, '../../data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        const usersPath = path.join(dataDir, 'users.json');
        let users = {};
        if (fs.existsSync(usersPath)) {
            try { users = JSON.parse(fs.readFileSync(usersPath, 'utf8')); } catch (e) { users = {}; }
        }
        const payload = req.body;
        const uid = payload.uid || ('u-' + Date.now());
        users[uid] = { ...users[uid], ...payload, uid };
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
        return res.json({ success: true, uid });
    } catch (e) {
        console.error('Failed to save user:', e.message);
        return res.status(500).json({ error: 'Failed to save user' });
    }
});

// Simple search endpoint across local data files
app.get('/api/search', (req, res) => {
    try {
        const term = (req.query.term || '').toString().toLowerCase().trim();
        const dataDir = path.join(__dirname, '../../data');
        const results = [];

        // Users
        const usersPath = path.join(dataDir, 'users.json');
        if (fs.existsSync(usersPath)) {
            const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
            Object.values(users).forEach((u) => {
                const text = ((u.displayName||'') + ' ' + (u.username||'') + ' ' + (u.usercode||'')).toLowerCase();
                if (!term || text.includes(term)) results.push({ id: u.uid, type: 'user', ...u });
            });
        }

        // Discover feed
        const feedPath = path.join(dataDir, 'discover_feed.json');
        if (fs.existsSync(feedPath)) {
            const feed = JSON.parse(fs.readFileSync(feedPath, 'utf8'));
            feed.forEach((item) => {
                const text = ((item.title||'') + ' ' + (item.description||'')).toLowerCase();
                if (!term || text.includes(term)) results.push({ id: item.title, type: 'post', ...item });
            });
        }

        // Trending topics
        const topicsPath = path.join(dataDir, 'trending_topics.json');
        if (fs.existsSync(topicsPath)) {
            const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));
            topics.forEach((t) => {
                const text = ((t.title||'') + ' ' + (t.summary||'')).toLowerCase();
                if (!term || text.includes(term)) results.push({ id: t.title, type: 'topic', ...t });
            });
        }

        return res.json(results.slice(0, 200));
    } catch (e) {
        console.error('Search failed:', e.message);
        return res.status(500).json({ error: 'Search failed' });
    }
});

// Events endpoints (file-backed)
app.get('/api/events', (req, res) => {
    try {
        const dataDir = path.join(__dirname, '../../data');
        const eventsPath = path.join(dataDir, 'events.json');
        let payload = [];
        if (fs.existsSync(eventsPath)) {
            const events = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
            payload = Array.isArray(events) ? events : Object.values(events);
        }
        return res.json(payload);
    } catch (e) {
        console.error('Error reading events:', e.message);
        return res.status(500).json({ error: 'Failed to read events' });
    }
});

app.post('/api/events', (req, res) => {
    try {
        const dataDir = path.join(__dirname, '../../data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        const eventsPath = path.join(dataDir, 'events.json');
        let events = [];
        if (fs.existsSync(eventsPath)) {
            try {
                const data = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
                events = Array.isArray(data) ? data : Object.values(data);
            } catch (e) { events = []; }
        }
        const eventId = 'evt-' + Date.now();
        const newEvent = { id: eventId, ...req.body, createdAt: new Date().toISOString(), attendees: 0 };
        events.push(newEvent);
        fs.writeFileSync(eventsPath, JSON.stringify(events, null, 2));
        return res.json({ success: true, id: eventId, event: newEvent });
    } catch (e) {
        console.error('Failed to create event:', e.message);
        return res.status(500).json({ error: 'Failed to create event' });
    }
});

// Trending topics endpoint (file-backed)
app.get('/api/trending', (req, res) => {
    try {
        const dataDir = path.join(__dirname, '../../data');
        const topicsPath = path.join(dataDir, 'trending_topics.json');
        let payload = [];
        if (fs.existsSync(topicsPath)) {
            const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));
            payload = Array.isArray(topics) ? topics : Object.values(topics);
        }
        return res.json(payload);
    } catch (e) {
        console.error('Error reading trending topics:', e.message);
        return res.status(500).json({ error: 'Failed to read trending topics' });
    }
});

// Basic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
