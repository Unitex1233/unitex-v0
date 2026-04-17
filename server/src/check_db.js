const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, '../../service-account.json');
if (!fs.existsSync(serviceAccountPath)) {
    console.error('Service account key not found!');
    process.exit(1);
}

const serviceAccount = require(serviceAccountPath);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkCollections() {
    try {
        const feedDocs = await db.collection('discover_feed').get();
        console.log(`Documents in 'discover_feed': ${feedDocs.size}`);
        
        const topicDocs = await db.collection('trending_topics').get();
        console.log(`Documents in 'trending_topics': ${topicDocs.size}`);
        
        if (feedDocs.size > 0) {
            console.log('Sample Document:', JSON.stringify(feedDocs.docs[0].data(), null, 2));
        }
    } catch (err) {
        console.error('Error checking collections:', err);
    } finally {
        process.exit(0);
    }
}

checkCollections();
