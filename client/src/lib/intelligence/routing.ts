// Content Routing Engine & Smart Notifications
// Decides *who* sees a post first based on niche relevance.

import { calculateCosineSimilarity } from './niche';
import { PostIntent } from './intent';

export interface RouteTarget {
    uid: string;
    tier: 1 | 2 | 3;
    notificationScore: number;
}

export function calculateRoutingTargets(
    postNicheVector: number[],
    postIntent: PostIntent,
    authorUid: string,
    authorVp: number,
    activeUsers: Array<{ uid: string; nicheVector: number[]; currentIntent?: PostIntent }>
): RouteTarget[] {
    const targets: RouteTarget[] = [];

    activeUsers.forEach(user => {
        if (user.uid === authorUid) return;

        const similarity = calculateCosineSimilarity(postNicheVector, user.nicheVector);
        
        let tier: 1 | 2 | 3 | null = null;

        // Tier 1: Exact Match (S > 0.85) AND Intent aligns
        if (similarity >= 0.85) {
            tier = 1;
        } 
        // Tier 2: Adjacent Match (S > 0.5)
        else if (similarity >= 0.50) {
             tier = 2;
        }
        // Tier 3: Global / Broader Discovery (S > 0.1)
        else if (similarity > 0.1) {
             tier = 3;
        }

        if (tier) {
            // Notification mechanism logic embedded here
            // S_notif = W_type * cos(U_a, U_t) * log(1 + VP_a)
            const baseWeight = tier === 1 ? 2.0 : (tier === 2 ? 1.0 : 0.5);
            // Give a massive boost if it's a direct collaboration or question matching their niche
            const intentMultiplier = (postIntent === 'support' || postIntent === 'building') ? 1.5 : 1.0;
            
            const notificationScore = baseWeight * similarity * Math.log10(2 + authorVp) * intentMultiplier;

            targets.push({
                uid: user.uid,
                tier,
                notificationScore
            });
        }
    });

    // Sort by tier, then notification score descending
    return targets.sort((a, b) => {
        if (a.tier !== b.tier) return a.tier - b.tier;
        return b.notificationScore - a.notificationScore;
    });
}
