// Feed Ranking Algorithm (For You Relevance) & Trending (Velocity)

import { calculateCosineSimilarity } from './niche';
import { QualityAnalysis } from './anti-spam';

interface FeedPostContext {
    postNicheVector: number[];
    qScore: number;
    interactions: { likes: number; comments: number; shares: number; };
    authorVp: number;
    createdAtMillis: number;
}

// 1. Feed Ranking Algorithm (For You Relevance)
export function calculateRankScore(
    userNicheVector: number[],
    post: FeedPostContext,
    currentTimeMillis: number
): number {
    
    // Niche Match (Cosine Similarity Rs)
    const Rs = calculateCosineSimilarity(userNicheVector, post.postNicheVector);
    
    // Interactions I(p) weighted: Likes * 1 + Comments * 3 + Shares * 5
    const Ip = (post.interactions.likes * 1) + (post.interactions.comments * 3) + (post.interactions.shares * 5);
    
    // Author Authority
    const Ra = post.authorVp || 0;
    
    // Time Decay D = (T + 2)^1.5 (Gravity Model)
    const T_hours = Math.max(0, (currentTimeMillis - post.createdAtMillis) / (1000 * 60 * 60));
    const D = Math.pow(T_hours + 2, 1.5);
    
    // Quality Multiplier
    const Q_multiplier = post.qScore / 50.0; // Assume 50 is baseline

    // RankScore Formula
    // R_s * (1 + Ip) * log(1 + Ra) * Q_multiplier / D
    // Log applied to Ra to prevent hyper-whales dominating forever.
    const rankScore = (Rs * (1 + Ip) * Math.log10(1 + Ra) * Q_multiplier) / D;
    
    // Prevent NaN
    return isNaN(rankScore) ? 0 : rankScore;
}


// 2. Trending Detection (Velocity Algorithm)
export function calculateTrendingVelocity(
    post: FeedPostContext,
    previousInteractions: { likes: number; comments: number; shares: number; },
    currentTimeMillis: number
): number {
    
    // Current Engagement E_c
    const E_c = (post.interactions.likes * 1) + (post.interactions.comments * 5) + (post.interactions.shares * 10);
    // Previous Engagement (1 hour ago simulated or real) E_p
    const E_p = (previousInteractions.likes * 1) + (previousInteractions.comments * 5) + (previousInteractions.shares * 10);
    
    const deltaE = Math.max(0, E_c - E_p);
    
    // Post Age in hours T
    const T_hours = Math.max(0, (currentTimeMillis - post.createdAtMillis) / (1000 * 60 * 60));
    
    // Gravity equation from the spec
    // TrendingScore = (E_c ^ 0.8) / (T + 2)^1.8 * (deltaE / (E_p + 1))
    const DiminishingVirality = Math.pow(E_c, 0.8);
    const StrictGravity = Math.pow(T_hours + 2, 1.8);
    
    const AccelerationRatio = deltaE / (E_p + 1);
    
    return (DiminishingVirality / StrictGravity) * AccelerationRatio;
}
