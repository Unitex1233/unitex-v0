// Progress Scoring System (XP / Value Points Engine)

export interface VpTransaction {
    type: 'post_created' | 'answer_accepted' | 'milestone_reached' | 'daily_streak';
    qualityScore?: number; // Q_static
}

export function calculateVpAward(transaction: VpTransaction, currentVp: number): number {
    let award = 0;

    switch (transaction.type) {
        case 'post_created':
            // Award scales slightly with quality score of the post
            if (transaction.qualityScore && transaction.qualityScore > 60) {
                // If it's a very high quality post, award up to 10 VP
                award = Math.floor(transaction.qualityScore / 10);
            } else if (transaction.qualityScore && transaction.qualityScore < 30) {
                // Penalize spam
                award = -5;
            }
            break;
            
        case 'answer_accepted':
            // High value action: Help provided
            award = 50; 
            break;
            
        case 'milestone_reached':
            // E.g., shipped a project
            award = 100;
            break;

        case 'daily_streak':
            award = 5;
            break;
    }

    // Apply diminishing returns (a logarithmic dampener) if VP is already very high (Whale protection)
    if (currentVp > 5000 && award > 0) {
        award = Math.max(1, Math.floor(award * 0.5));
    }

    return award;
}
