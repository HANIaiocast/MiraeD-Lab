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
        // Fallback or static data if news.json is missing
        renderNewsList([
            {
                title: "AI 뉴스 데이터를 불러올 수 없습니다.",
                content: "서버에서 최신 뉴스를 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
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
    
    summaryContent.innerHTML = `
        <p style="font-weight: bold; font-size: 1.1rem; margin-bottom: 1rem;">${summary.title}</p>
        <p>${summary.content}</p>
        <p style="margin-top: 1rem; font-style: italic; font-size: 0.9rem;">분석 가치: ${summary.value_analysis}</p>
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

        const link = document.createElement('span');
        link.setAttribute('slot', 'link');
        link.textContent = '자세히 보기';

        newsArticle.appendChild(value);
        newsArticle.appendChild(title);
        newsArticle.appendChild(content);
        newsArticle.appendChild(link);

        newsList.appendChild(newsArticle);
    });
}

loadNews();
