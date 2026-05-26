class NewsArticle extends HTMLElement {
    constructor() {
        super();
        const template = document.getElementById('news-article-template').content;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.cloneNode(true));
    }
}

customElements.define('news-article', NewsArticle);

const newsData = [
    {
        title: "미래를 바꾸는 양자 컴퓨팅",
        content: "양자 컴퓨팅은 기존 컴퓨터로는 해결할 수 없는 복잡한 문제들을 해결할 수 있는 잠재력을 가지고 있습니다. 신약 개발, 금융 모델링, 신소재 개발 등 다양한 분야에서 혁신을 가져올 것으로 기대됩니다.",
        link: "#"
    },
    {
        title: "지속 가능한 미래를 위한 그린 테크놀로지",
        content: "기후 변화에 대응하기 위해 그린 테크놀로지, 즉 녹색 기술이 주목받고 있습니다. 태양광, 풍력 등 신재생 에너지 기술과 에너지 효율을 높이는 기술들이 빠르게 발전하고 있습니다.",
        link: "#"
    },
    {
        title: "메타버스, 현실과 가상의 경계를 허물다",
        content: "메타버스는 현실 세계와 같은 사회, 경제, 문화 활동이 이루어지는 3차원 가상 세계입니다. 원격 근무, 온라인 교육, 엔터테인먼트 등 다양한 분야에서 새로운 가능성을 열고 있습니다.",
        link: "#"
    }
];

const app = document.getElementById('app');

newsData.forEach((article, index) => {
    const newsArticle = document.createElement('news-article');
    newsArticle.style.animationDelay = `${index * 0.1}s`;

    const title = document.createElement('span');
    title.setAttribute('slot', 'title');
    title.textContent = article.title;

    const content = document.createElement('span');
    content.setAttribute('slot', 'content');
    content.textContent = article.content;

    newsArticle.appendChild(title);
    newsArticle.appendChild(content);

    app.appendChild(newsArticle);
});
