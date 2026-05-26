class NewsArticle extends HTMLElement {
    constructor() {
        super();
        const template = document.getElementById('news-article-template').content;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.cloneNode(true));
    }
}

customElements.define('news-article', NewsArticle);

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const updateThemeUI = (theme) => {
    themeToggle.textContent = theme === 'dark' ? '☀️ 라이트 모드' : '🌙 다크 모드';
};

const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
updateThemeUI(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeUI(newTheme);
});

// News Storage for Refreshing
let allArticles = [];

// Fetch and Render News
async function loadNews() {
    try {
        const response = await fetch('news.json');
        if (!response.ok) throw new Error('News data fetch failed');
        const data = await response.json();
        
        allArticles = data.articles;
        renderSummary(data.summary);
        refreshNews(); // Initial render
    } catch (error) {
        console.error('Core Error:', error);
    }
}

function renderSummary(summary) {
    if (!summary) return;
    const summarySection = document.getElementById('daily-summary');
    const summaryCard = document.getElementById('summary-card-container');
    const summaryTitle = document.getElementById('summary-title');
    
    summaryTitle.textContent = summary.title;
    
    const listItems = summary.points.map(point => "<li>" + point + "</li>").join("");
    
    summaryCard.innerHTML = "<ul class=\"summary-list\">" + listItems + "</ul><div class=\"value-analysis\"><span>💡</span><strong>인사이트:</strong> " + summary.value_analysis + "</div>";
    summarySection.style.display = 'block';
}

function refreshNews() {
    // Shuffle and pick 4 articles
    const shuffled = [...allArticles].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    renderNewsList(selected);
}

function renderNewsList(articles) {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = '';

    articles.forEach((article, index) => {
        const newsArticle = document.createElement('news-article');
        newsArticle.style.animationDelay = (index * 0.1) + "s";

        const title = document.createElement('span');
        title.setAttribute('slot', 'title');
        title.textContent = article.title;

        const content = document.createElement('span');
        content.setAttribute('slot', 'content');
        content.textContent = article.content;

        const value = document.createElement('span');
        value.setAttribute('slot', 'value');
        value.textContent = article.value;

        const sourceUrl = document.createElement('span');
        sourceUrl.setAttribute('slot', 'source-url');
        sourceUrl.textContent = article.source_url;

        const img = document.createElement('img');
        img.setAttribute('slot', 'image');
        img.className = 'article-image';
        img.src = article.image;
        img.alt = article.title;
        img.onerror = function() {
            this.src = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800'; // Fallback
        };

        newsArticle.appendChild(value);
        newsArticle.appendChild(title);
        newsArticle.appendChild(content);
        newsArticle.appendChild(sourceUrl);
        newsArticle.appendChild(img);

        newsList.appendChild(newsArticle);
    });
}

// Add event listener for refresh button if it exists
document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-news');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // Add rotation effect
            refreshBtn.classList.add('rotating');
            refreshNews();
            setTimeout(() => refreshBtn.classList.remove('rotating'), 500);
        });
    }
});

loadNews();
