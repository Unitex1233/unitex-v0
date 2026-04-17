// Intent & Level Classification Engine
// Understands *why* a user is posting and their *expertise*

export type PostIntent = 'learning' | 'building' | 'hiring' | 'exploring' | 'support' | 'general';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'unknown';

export interface IntentAnalysis {
    intent: PostIntent;
    level: SkillLevel;
    confidence: number;
}

export function classifyIntent(content: string): IntentAnalysis {
    const text = content.toLowerCase();
    
    // Lightweight NLP Heuristics (Regex/Dictionary mapping)
    
    // Intent Detection
    let intent: PostIntent = 'general';
    let intentScore = 0;

    const buildingKeywords = ['shipped', 'deployed', 'built', 'working on', 'launching', 'milestone', 'update'];
    const learningKeywords = ['learning', 'tutorial', 'course', 'reading', 'studying', 'first time'];
    const supportKeywords = ['how to', 'help', 'stuck', 'error', 'bug', 'issue', 'fix', '?'];
    const hiringKeywords = ['hiring', 'looking for', 'open role', 'join our', 'founder dating', 'startup'];

    const countMatches = (keywords: string[]) => keywords.filter(k => text.includes(k)).length;

    const bCount = countMatches(buildingKeywords);
    const lCount = countMatches(learningKeywords);
    const sCount = countMatches(supportKeywords);
    const hCount = countMatches(hiringKeywords);

    const maxCount = Math.max(bCount, lCount, sCount, hCount);
    
    if (maxCount > 0) {
        if (maxCount === bCount) { intent = 'building'; intentScore = bCount; }
        else if (maxCount === sCount) { intent = 'support'; intentScore = sCount; }
        else if (maxCount === lCount) { intent = 'learning'; intentScore = lCount; }
        else if (maxCount === hCount) { intent = 'hiring'; intentScore = hCount; }
    }

    // Skill Level Regression (Heuristic simulation)
    // Checks semantic complexity and code density
    let level: SkillLevel = 'unknown';
    
    const advancedKeywords = ['architecture', 'concurrency', 'latency', 'mesh', 'distributed', 'scaling', 'refactored', 'benchmarks'];
    const beginnerKeywords = ['beginner', 'noob', 'first project', 'starting out', 'what is'];

    const aCount = countMatches(advancedKeywords);
    const begCount = countMatches(beginnerKeywords);
    const hasCode = /```[\s\S]*?```/g.test(content);

    if (begCount > aCount) {
        level = 'beginner';
    } else if (aCount >= 1 || (hasCode && bCount > 1)) {
        level = 'advanced';
    } else {
        level = 'intermediate';
    }

    // Calculate a naive confidence score
    const confidence = Math.min(0.99, (intentScore * 0.2) + (hasCode ? 0.3 : 0.1));

    return {
        intent,
        level,
        confidence
    };
}
