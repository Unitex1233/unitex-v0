// Niche Detection Algorithm (The Foundation)
// Maps user or content behavior into specific topic vectors (TF-IDF & K-Means simulated logic)

export const KNOWN_NICHES = [
    'React', 'Frontend', 'Vue', 'Angular', 'Tailwind',
    'Node', 'Backend', 'Express', 'NestJS', 'API',
    'AI', 'Machine Learning', 'Python', 'Data Science', 'LLMs',
    'DevOps', 'Docker', 'Kubernetes', 'CI/CD', 'AWS',
    'Startup', 'Founder', 'Venture Capital', 'Product Management'
];

export function detectNicheTags(content: string, maxTags: number = 2): string[] {
    const text = content.toLowerCase();
    const tagScores: Record<string, number> = {};

    KNOWN_NICHES.forEach(niche => {
        const keyword = niche.toLowerCase();
        // A simplistic TF metric: count occurrences
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        const matches = text.match(regex);
        if (matches) {
            tagScores[niche] = matches.length;
        }
    });

    // Sort by frequency and return top N tags
    const sortedTags = Object.entries(tagScores)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);

    if (sortedTags.length === 0) {
        return ['General Engineering'];
    }

    return sortedTags.slice(0, maxTags);
}

// Generates a mock dense 384-dimensional vector for a user/post (Simulated AI Embedding)
export function generateNicheVector(tags: string[]): number[] {
    // In a real Python backend, this hits a DistilBERT model.
    // For MVPs, we hash the tag string to seed a pseudo-random array of floats.
    const vector = new Array(10).fill(0); // Using 10 dims for speed in client
    tags.forEach((tag, idx) => {
        const hash = tag.charCodeAt(0) % 10;
        vector[hash] = Math.min(1.0, vector[hash] + 0.5);
    });
    // Normalize
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(v => (magnitude > 0 ? v / magnitude : 0));
}

// Smart Matching Algorithm: Cosine Similarity between two vectors
export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += (vecA[i] || 0) * (vecB[i] || 0);
        normA += (vecA[i] || 0) ** 2;
        normB += (vecB[i] || 0) ** 2;
    }
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
