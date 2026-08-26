const Parser = require('rss-parser');
const cron = require('node-cron');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const parser = new Parser();

// RSS Feeds to scrape
const FEEDS = [
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
  { name: 'Wired', url: 'https://www.wired.com/feed/rss' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
  { name: 'Mashable', url: 'https://mashable.com/feeds/rss/all' }
];

const DATA_DIR = path.join(__dirname, '../../data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

async function scrapeFeeds() {
  console.log('⚠️ [Discovery] Running local scraper (MVP) — writing to data folder');

  const mockData = [
    {
      title: 'UniteX Social Ecosystem v2.0 Launches',
      description: 'The next generation of modular networking is here, featuring real-time nodes and fuzzy discovery.',
      source: 'UniteX Internal',
      category: 'Platform',
      tags: ['Release', 'Web3', 'Scale'],
      trendScore: 95.5,
      createdAt: new Date().toISOString()
    },
    {
      title: 'The Rise of Agentic Coding',
      description: 'How AI agents are transforming the way we build and maintain complex software systems.',
      source: 'Tech Journal',
      category: 'AI',
      tags: ['AI', 'Future', 'Code'],
      trendScore: 88.2,
      createdAt: new Date().toISOString()
    }
  ];

  const fallbackPath = path.join(DATA_DIR, 'discover_fallback.json');
  fs.writeFileSync(fallbackPath, JSON.stringify(mockData, null, 2));
  console.log(`✅ [Discovery] Mock data saved to: ${fallbackPath}`);

  // Also maintain discover_feed.json and trending_topics.json for local reads
  const feedPath = path.join(DATA_DIR, 'discover_feed.json');
  const topicsPath = path.join(DATA_DIR, 'trending_topics.json');

  let feed = [];
  if (fs.existsSync(feedPath)) {
    try { feed = JSON.parse(fs.readFileSync(feedPath, 'utf8')); } catch (e) { feed = []; }
  }

  for (const item of mockData) {
    const exists = feed.find((f) => f.title === item.title);
    if (!exists) feed.unshift(item);
  }

  fs.writeFileSync(feedPath, JSON.stringify(feed, null, 2));

  // Build simple trending topics from tags
  const topics = {};
  for (const post of feed) {
    const k = (post.tags && post.tags[0]) || 'General';
    topics[k] = topics[k] || { title: k, keywords: post.tags || [], score: 0, postsCount: 0 };
    topics[k].score += post.trendScore || 0;
    topics[k].postsCount += 1;
  }

  const topicsArr = Object.values(topics).map((t) => ({ ...t, score: parseFloat((t.score / t.postsCount).toFixed(2)) }));
  fs.writeFileSync(topicsPath, JSON.stringify(topicsArr, null, 2));

  console.log('--- Local Scrape Finished ---');
}

// Schedule: Every 30 minutes
cron.schedule('0,30 * * * *', () => {
  scrapeFeeds();
});

// Run once on startup
scrapeFeeds();

module.exports = { scrapeFeeds };
