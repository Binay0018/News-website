const api = "Your-api-key";
const apiUrl = `https://newsapi.org/v2/everything?domains=techcrunch.com,thenextweb.com&pageSize=10&apiKey=${api}`;

document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");
    const searchField = document.querySelector(".search-input");
    const searchButton = document.querySelector(".srh-btn");

    const fetchRandomNews = async () => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            return data.articles || [];
        } catch (error) {
            console.error("Error fetching news:", error);
            return [];
        }
    };

    const fetchNews = async (query) => {
        try {
            const searchUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=10&apiKey=${api}`;
            const response = await fetch(searchUrl);
            const data = await response.json();
            return data.articles || [];
        } catch (error) {
            console.error("Error fetching search results:", error);
            return [];
        }
    };

    const displayNews = (news) => {
        mainContent.innerHTML = "";

        if (!news.length) {
            mainContent.innerHTML = "<p>No articles found.</p>";
            return;
        }

        news.forEach((article) => {
            const newsItem = document.createElement("div");
            newsItem.classList.add("news-item");

            const img = document.createElement("div");
            img.classList.add("image");
            img.innerHTML = `
                <img src="${article.urlToImage || 'https://via.placeholder.com/150'}"
                     alt="${article.title || 'Image'}"
                     onerror="this.src='https://via.placeholder.com/150';">
            `;

            const title = document.createElement("div");
            title.classList.add("title");
            title.textContent = article.title?.length > 30
                ? article.title.slice(0, 30) + "..."
                : article.title || "No Title Available";

            const content = document.createElement("p");
            content.classList.add("content");
            content.textContent = article.description?.length > 100
                ? article.description.slice(0, 100) + "..."
                : article.description || "No Description Available";

            newsItem.appendChild(img);
            newsItem.appendChild(title);
            newsItem.appendChild(content);

            newsItem.addEventListener("click", () => {
                if (article.url) {
                    window.open(article.url, "_blank");
                }
            });

            mainContent.appendChild(newsItem);
        });
    };

    searchButton.addEventListener("click", async () => {
        const query = searchField.value.trim();
        if (!query) {
            alert("Please enter a search term.");
            return;
        }

        try {
            const articles = await fetchNews(query);
            displayNews(articles);
        } catch (error) {
            console.error("Error searching news:", error);
            alert("Something went wrong. Please try again.");
        }
    });

    // Load default random news on start
    (async () => {
        const articles = await fetchRandomNews();
        displayNews(articles);
    })();
});
