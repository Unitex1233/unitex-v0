# 🎭 Mock Data - UniteX MVP

This directory contains comprehensive mock data for all app features. Every page has realistic, diverse sample content ready for testing and demonstration.

## 📊 Data Files Overview

### Users (`users.json`)
- **8 diverse user profiles** with different roles and expertise
- Each user has:
  - Complete profile information (bio, location, website)
  - VP (value points) and EXP rewards
  - Connection network with established relationships
  - Enrolled courses with progress tracking
  - Saved resources list

**Users:**
1. **Alex Kumar** (@alexkumar) - Founder, Web3 architect (VP: 3500)
2. **Sarah Chen** (@sarahchen) - Designer, UI/UX expert (VP: 2800)
3. **Marcus Trading** (@marcustrading) - Trader, DeFi enthusiast (VP: 5200)
4. **Emma Rodriguez** (@emmarodriguez) - Developer, AI/ML engineer (VP: 4100)
5. **James Wilson** (@jameswilson) - Entrepreneur, Investor (VP: 6100)
6. **Lisa Park** (@lisapark) - Marketer, Community builder (VP: 2400)
7. **David Lee** (@davidlee) - Architect, Blockchain expert (VP: 3900)
8. **Nina Patel** (@ninapatel) - Analyst, AI researcher (VP: 3200)

### Posts (`posts.json`)
- **12 realistic posts** from different users
- Content includes:
  - Announcements (new product launches)
  - Insights (thought leadership)
  - Market updates (trading analysis)
  - Code snippets (developer content)
  - Lessons & tutorials
  - Research findings
- Each post has engagement stats (likes, supports, comments)

**Sample Content Topics:**
- Web3 infrastructure launches
- Design system best practices
- Crypto trading analysis
- AI/ML breakthroughs
- Startup funding news
- Growth strategies
- Architecture decisions
- Research publications

### Events (`events.json`)
- **5 upcoming events** with complete details
- Event types:
  - Web3 Developer Summit (San Francisco)
  - AI & Machine Learning Workshop (Virtual)
  - Startup Networking Mixer (New York)
  - Design Systems Conference (Austin)
  - Crypto Trading Masterclass (Virtual)
- Each event includes speaker, capacity, registration status

### Network Requests (`network_requests.json`)
- **6 connection requests** showing different statuses
- States: Pending & Accepted
- Real messages from one user to another
- Timeline tracking

### Conversations (`conversations.json`)
- **4 active conversation threads** between users
- Each conversation shows:
  - Participants with avatars
  - Last message preview
  - Timestamp of last activity
  - Original conversation date

### Notifications (`notifications.json`)
- **10 system notifications** across multiple types
- Notification types:
  - Connection accepted
  - Post likes & comments
  - Follow/follower actions
  - Support (reward) notifications
  - System announcements
- Read/unread status tracking

### Courses (`courses.json`)
- **4 educational courses** from instructors
- Course details:
  - Complete Web3 Development Bootcamp (12 weeks, $299)
  - Advanced UI/UX Design Systems (8 weeks, $199)
  - Crypto Trading Masterclass (10 weeks, $399)
  - AI & Machine Learning for Developers (14 weeks, $349)
- Each includes enrollment count, rating, instructor info

### Resources (`resources.json`)
- **5 learning resources** across different types
- Resource types: articles, books, videos, courses
- Topics:
  - Solidity smart contract development
  - React performance optimization
  - System architecture design
  - Blockchain fundamentals
  - Distributed systems

### Communities (`communities.json`)
- **5 community groups** organized by topic
- Communities:
  1. Web3 Builders (4,250 members)
  2. Design Systems Collective (1,820 members)
  3. Crypto Traders Network (6,890 members)
  4. AI/ML Research Group (2,340 members)
  5. Startup Founders Hub (3,567 members)
- Each with founder info and description

### Trending Topics (`trending_topics.json`)
- Trending hashtags/topics with trending scores
- Examples: #AI, #Release, #Web3, #Scale

### Discover Feed (`discover_feed.json`)
- Curated discover feed content
- Sample industry news and announcements

## 🔌 How Data is Used

### Client-Side (localStorage)
All data is immediately available in the browser's localStorage:
```javascript
// Posts
localStorage.getItem('unitex_posts') // → posts.json data

// Events
localStorage.getItem('unitex_events') // → events.json data

// Network requests
localStorage.getItem('unitex_network_requests') // → connections

// Notifications
localStorage.getItem('unitex_notifications') // → notifications

// Users
localStorage.getItem('unitex_users') // → users data
```

### Server-Side (REST APIs)
- `GET /api/discover` → discover_feed.json
- `GET /api/events` → events.json
- `POST /api/events` → creates new event
- `GET /api/trending` → trending_topics.json
- `GET /api/users/:uid` → user profile
- `POST /api/users` → create/update user
- `GET /api/search?term=X` → search across all data

## 🧪 Testing Features

### Connections & Network
- Test connection requests (pending & accepted)
- View incoming/outgoing requests
- Accept/reject friend requests
- View connection profiles

### Posts & Feed
- Browse discover feed with real content
- Like and engage with posts
- Create new posts (saves locally)
- See post engagement metrics

### Events
- Browse upcoming events
- RSVP to events (saves locally)
- Create new events
- Track registration status

### Messaging
- Send messages in conversations
- View message history
- Real-time message updates (polling)

### Notifications
- Receive connection notifications
- Like/comment notifications
- System announcements
- Mark read/unread

### Learning
- Browse and enroll in courses
- Track course progress
- Save learning resources
- View instructor profiles

## 💡 Customization

To add more mock data:

1. **Add more users** to `users.json` with unique UIDs (u-9, u-10, etc.)
2. **Create more posts** with different content types and engagement levels
3. **Add more events** with varying dates and capacities
4. **Expand courses** with additional instructors and topics
5. **Create more communities** grouped by interests
6. **Add conversations** between specific user pairs

## 🚀 Demo Scenarios

### Scenario 1: New User Signup
1. Sign up as a new user
2. Browse discover feed (auto-populated)
3. View trending topics
4. See suggested users to connect with

### Scenario 2: Network Building
1. View pending connection requests
2. Accept/reject requests
3. Send new connection requests
4. View accepted connections

### Scenario 3: Learning Path
1. Browse available courses
2. Enroll in a course
3. Track progress
4. Save resources
5. Earn rewards (VP/EXP)

### Scenario 4: Community Engagement
1. Discover events in communities
2. RSVP to events
3. Join community groups
4. Participate in discussions

### Scenario 5: Social Interaction
1. Create and share posts
2. Receive notifications on engagement
3. Send direct messages
4. Follow other users

## ✅ Data Consistency

- All user references are consistent across files
- Timestamps are realistic and sequential
- Connection relationships are reciprocal
- Event dates are in future (2026)
- Engagement metrics are realistic (likes < comments < follows)
- User VP/EXP reflect their activity level

## 📝 Notes

- All mock data is **stored locally** (no Firebase required)
- Data persists in localStorage between sessions
- Server files can be modified and will auto-save
- No authentication needed for MVP testing
- All features work **100% offline**
