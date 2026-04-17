export interface NewsItem {
    title: string;
    pubDate: string;
    link: string;
    guid: string;
    author: string;
    thumbnail: string;
    description: string;
    content: string;
    categories: string[];
}

export async function fetchGoogleNews(): Promise<NewsItem[]> {
    try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss');
        const data = await response.json();
        if (data.status === 'ok') {
            return data.items;
        }
        return [];
    } catch (error) {
        console.error('Error fetching Google News:', error);
        return [];
    }
}
