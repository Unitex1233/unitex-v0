// Anti-Spam / Content Quality Filter
// Gatekeeper algorithm protecting the Relevancy Engine from low effort noise.

export interface QualityAnalysis {
    qScore: number;         // [0, 100]
    isSpam: boolean;        // Automatically filter
    reasons: string[];      // Diagnostic logs
}

export function calculateQualityScore(content: string, authorVpLevel: number = 0): QualityAnalysis {
    let score = 50; // Dynamic Baseline
    const text = content.trim();
    const reasons: string[] = [];
    
    // 1. Content Depth (Length & Semantic richness)
    if (text.length > 300) {
        score += 20;
        reasons.push('High content depth (+20)');
    } else if (text.length < 30) {
        score -= 40;
        reasons.push('Low effort length (-40)');
    }

    // 2. Formatting & Complexity
    if (text.match(/```[\s\S]*?```/g)) {
        score += 15;
        reasons.push('Code block detected (+15)');
    }
    
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    if (text.match(urlPattern)) {
        score += 5;
        reasons.push('External citation (+5)');
    }

    // 3. Spam Signals (Repetitive chars, excess emoji)
    if (/(.)\1{4,}/.test(text)) { // e.g. "aaaaa" or "!!!!!"
        score -= 30;
        reasons.push('Spammy repetition (-30)');
    }

    const emojiCount = (text.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu) || []).length;
    if (emojiCount > 5 && text.length < 100) {
        score -= 20;
        reasons.push('Excessive emoji ratio (-20)');
    }

    // 4. Author History Boost (Reputation shielding)
    if (authorVpLevel > 500) {
        score += 10;
        reasons.push('High authority author (+10)');
    }

    // Clamp between 0 and 100
    const finalScore = Math.min(100, Math.max(0, score));

    // Threshold execution: < 20 halts Content Routing
    const isSpam = finalScore < 20;
    if (isSpam) {
        reasons.push('FAILED: Shadowban / Limit reach threshold triggered');
    }

    return {
        qScore: finalScore,
        isSpam,
        reasons
    };
}
