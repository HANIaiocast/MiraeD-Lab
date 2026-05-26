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
    themeToggle.textContent = theme === 'dark' ? '라이트 모드' : '다크 모드';
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

// Fetch and Render News
async function loadNews() {
    try {
        const response = await fetch('news.json');
        if (!response.ok) throw new Error('News data fetch failed');
        const data = await response.json();
        
        renderSummary(data.summary);
        renderNewsList(data.articles);
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

        const linkAnchor = document.createElement('a');
        linkAnchor.setAttribute('slot', 'link-anchor');
        linkAnchor.className = 'read-more';
        linkAnchor.href = article.link;
        linkAnchor.target = "_blank";
        linkAnchor.rel = "noopener noreferrer";
        linkAnchor.innerHTML = '뉴스 원문 읽기 →';

        newsArticle.appendChild(value);
        newsArticle.appendChild(title);
        newsArticle.appendChild(content);
        newsArticle.appendChild(linkAnchor);

        newsList.appendChild(newsArticle);
    });
}

loadNews();
