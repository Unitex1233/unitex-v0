/**
 * UniteX Advanced Ranking Engine
 * Inspired by Reddit (Wilson Score), HackerNews (Gravity), and X (Engagement Velocity)
 */

export interface RankingMetadata {
    likes: number;
    commentsCount: number;
    shares: number;
    createdAt: string | number | Date;
    authorVerificationInfo?: {
        isVerified: boolean;
        accountAgeDays: number;
    };
}

/**
 * Calculates an 'Engagement Score' based on interaction depth.
 * Comments and Shares are weighted significantly higher than simple likes.
 */
export function calculateEngagementScore(metadata: RankingMetadata): number {
    const LIKE_WEIGHT = 1;
    const COMMENT_WEIGHT = 5;
    const SHARE_WEIGHT = 10;
    const VERIFICATION_BOOST = 1.2;

    let baseScore = (metadata.likes * LIKE_WEIGHT) + 
                    (metadata.commentsCount * COMMENT_WEIGHT) + 
                    (metadata.shares * SHARE_WEIGHT);

    if (metadata.authorVerificationInfo?.isVerified) {
        baseScore *= VERIFICATION_BOOST;
    }

    return baseScore;
}

/**
 * Applies a time-decay 'Gravity' to the score.
 * Newer content is prioritized, while older content requires significantly higher engagement to stay relevant.
 * Formula: Score = BaseScore / (HoursSinceCreation + 2)^Gravity
 */
export function applyTimeDecay(baseScore: number, createdAt: string | number | Date): number {
    const GRAVITY = 1.8;
    const createdTime = new Date(createdAt).getTime();
    const now = Date.now();
    const hoursSinceCreation = (now - createdTime) / (1000 * 60 * 60);

    // Ensure we don't divide by zero or negative; use a minimum of 2 hours for smoothing
    return baseScore / Math.pow(hoursSinceCreation + 2, GRAVITY);
}

/**
 * Returns a user-friendly 'Explainability' string for why a piece of content is shown.
 */
export function getRecommendationReason(score: number, metadata: RankingMetadata): string {
    const now = Date.now();
    const createdTime = new Date(metadata.createdAt).getTime();
    const isNew = (now - createdTime) < (4 * 1000 * 60 * 60); // 4 hours

    if (score > 100) return "Highly engaging across the network";
    if (isNew && score > 20) return "Breaking news in your niche";
    if (metadata.shares > 5) return "Widely shared in your community";
    if (metadata.authorVerificationInfo?.isVerified) return "From a verified source";
    
    return "Relevant to your interests";
}
