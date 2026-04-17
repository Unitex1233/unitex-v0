-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  xp INTEGER DEFAULT 0
);

-- Communities
CREATE TABLE IF NOT EXISTS communities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Posts
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  community_id INTEGER REFERENCES communities(id),
  content TEXT NOT NULL,
  image_url TEXT,
  type VARCHAR(20) DEFAULT 'update', -- update, failure, resource
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reactions (Insightful, Helpful, Supportive)
CREATE TABLE IF NOT EXISTS reactions (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id),
  user_id INTEGER REFERENCES users(id),
  type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id, type)
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  community_id INTEGER REFERENCES communities(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(200),
  mode VARCHAR(20) DEFAULT 'online', -- online, offline
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Roadmaps
CREATE TABLE IF NOT EXISTS roadmaps (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  external_url TEXT,
  category VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Roadmap Progress
CREATE TABLE IF NOT EXISTS user_roadmaps (
  user_id INTEGER REFERENCES users(id),
  roadmap_id INTEGER REFERENCES roadmaps(id),
  status VARCHAR(20) DEFAULT 'planned', -- planned, in-progress, completed
  PRIMARY KEY (user_id, roadmap_id)
);

-- Networking / Connections
CREATE TABLE IF NOT EXISTS connection_requests (
  id SERIAL PRIMARY KEY,
  sender_id VARCHAR(128) NOT NULL,
  receiver_id VARCHAR(128) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(sender_id, receiver_id)
);

CREATE TABLE IF NOT EXISTS connections (
  user1_id VARCHAR(128) NOT NULL,
  user2_id VARCHAR(128) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user1_id, user2_id)
);

-- Rewards & Activity (VP/EXP)
CREATE TABLE IF NOT EXISTS user_points (
  uid VARCHAR(128) PRIMARY KEY,
  exp INTEGER DEFAULT 0,
  vp INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(128) NOT NULL,
  action VARCHAR(50) NOT NULL,
  exp_gained INTEGER DEFAULT 0,
  vp_gained INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  referrer_uid VARCHAR(128) NOT NULL,
  referred_uid VARCHAR(128) NOT NULL UNIQUE,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Initial Data
INSERT INTO communities (name, slug, description) VALUES
('General', 'general', 'The main hub for UniteX.'),
('Builders', 'builders', 'For those shipping products.'),
('Learners', 'learners', 'Sharing knowledge and resources.');
