class Article {
  constructor(id_article, prix, Details, tailles_disponibles) {
    this.id_article = id_article;
    this.prix = prix;
    this.Details = Details;
    this.tailles_disponibles = tailles_disponibles;
  }

  afficherArticles(url) {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
        return [];
      });
  }
}

export default Article;
