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

const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '라이트 모드' : '다크 모드';

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '라이트 모드' : '다크 모드';
});

// Fetch and Render News
async function loadNews() {
    try {
        const response = await fetch('news.json');
        if (!response.ok) throw new Error('News data not found');
        const data = await response.json();
        
        renderSummary(data.summary);
        renderNewsList(data.articles);
    } catch (error) {
        console.error('Error loading news:', error);
        renderNewsList([
            {
                title: "데이터를 불러올 수 없습니다.",
                content: "최신 뉴스를 가져오는 중 오류가 발생했습니다.",
                link: "#",
                value: "오류"
            }
        ]);
    }
}

function renderSummary(summary) {
    if (!summary) return;
    const summarySection = document.getElementById('daily-summary');
    const summaryContent = document.getElementById('summary-content');
    
    // Convert long content to bullet points if it's not already structured
    const points = summary.points || [summary.content];
    const listItems = points.map(point => `<li>${point}</li>`).join('');
    
    summaryContent.innerHTML = `
        <p style="font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem; color: var(--primary-color);">${summary.title}</p>
        <ul class="summary-list">
            ${listItems}
        </ul>
        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed var(--shadow); font-size: 0.9rem; opacity: 0.8;">
            🎯 <strong>핵심 가치:</strong> ${summary.value_analysis}
        </div>
    `;
    summarySection.style.display = 'block';
}

function renderNewsList(articles) {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = '';

    articles.forEach((article, index) => {
        const newsArticle = document.createElement('news-article');
        newsArticle.style.animationDelay = `${index * 0.1}s`;

        const title = document.createElement('span');
        title.setAttribute('slot', 'title');
        title.textContent = article.title;

        const content = document.createElement('span');
        content.setAttribute('slot', 'content');
        content.textContent = article.content;

        const value = document.createElement('span');
        value.setAttribute('slot', 'value');
        value.textContent = article.value || '분석 중';

        // Properly create and slot the anchor tag for functionality
        const linkAnchor = document.createElement('a');
        linkAnchor.setAttribute('slot', 'link-anchor');
        linkAnchor.href = article.link || '#';
        linkAnchor.target = "_blank";
        linkAnchor.textContent = '자세히 보기 →';

        newsArticle.appendChild(value);
        newsArticle.appendChild(title);
        newsArticle.appendChild(content);
        newsArticle.appendChild(linkAnchor);

        newsList.appendChild(newsArticle);
    });
}

loadNews();
