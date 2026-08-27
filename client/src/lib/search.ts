export interface SearchResult {
    id: string;
    type: 'user' | 'post' | 'topic';
    title: string;
    subtitle?: string;
    image?: string;
    score: number;
    data: any;
}

// Custom Fuzzy Search Algorithm
function fuzzyMatch(text: string, query: string): number {
    if (!text || !query) return 1;
    const t = text.toLowerCase();
    const q = query.toLowerCase();
    
    if (t === q) return 0;
    if (t.startsWith(q)) return 0.1;
    if (t.includes(q)) return 0.3;
    
    const qWords = q.split(/\s+/);
    const matches = qWords.filter(word => t.includes(word)).length;
    if (matches > 0) return 0.5 - (matches / qWords.length) * 0.2;
    
    return 1; // No match
}

export async function performGlobalSearch(term: string): Promise<SearchResult[]> {
    if (!term || term.length < 2) return [];
    try {
        const res = await fetch(`/api/search?term=${encodeURIComponent(term)}`);
        if (!res.ok) return [];
        const items = await res.json();
        // apply fuzzy scoring client-side
        const results = items.map((item: any) => {
            const fields = [item.displayName, item.username, item.content, item.title, item.summary].filter(Boolean).join(' ');
            const score = fuzzyMatch(fields, term);
            return { item, score };
        }).filter(r => r.score < 0.9).sort((a,b) => a.score - b.score);

        return results.map((res): SearchResult => {
            const item = res.item as any;
            let title = '';
            let subtitle = '';
            let type: 'user' | 'post' | 'topic' = item.type;

            if (type === 'user') {
                title = item.displayName || 'Anonymous';
                subtitle = item.username || '@user';
            } else if (type === 'post') {
                title = (item.content || item.title || '').substring(0, 60) + '...';
                subtitle = `Post by ${item.author?.name || item.source || 'Unknown'}`;
            } else if (type === 'topic') {
                title = item.title;
                subtitle = item.summary;
            }

            return {
                id: item.id || (item.uid || item.title || ''),
                type,
                title,
                subtitle,
                image: item.photoURL || item.author?.avatar || item.imageUrl,
                score: res.score,
                data: item
            };
        });
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}
