import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";

const ArticleList = () => {
  const [articleData, setArticleData] = useState([]);

  useEffect(() => {
    fetchArticleList();
  }, []);

  const fetchArticleList = async () => {
    try {
      const response = await fetch("http://YourLocalHost:3000/articles");
      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      setArticleData(data);
    } catch (error) {
      console.error("Error fetching article list:", error);
    }
  };

  const calculateTotalQuantity = (variants) => {
    return variants.reduce((sum, variant) => sum + variant.Quantite, 0);
  };

  return (
    <ScrollView style={styles.articleListContainer}>
      <Text style={styles.chartLabel}>Liste des Articles</Text>
      {articleData && articleData.length > 0 ? (
        articleData.map((article) => {
          const variantsData = JSON.parse(article.Variantes);
          const totalQuantity = calculateTotalQuantity(variantsData);

          return (
            <View key={article.Article_ID} style={styles.cardContainer}>
              <Image
                source={{ uri: article.Image_1 }}
                style={styles.articleImage}
              />
              <View style={styles.textContainer}>
                <Text style={styles.articleTitle}>{article.Nom_article}</Text>
                <Text>{article.Description}</Text>
                <Text>Pour: {article.Section}</Text>
                <Text>Categorie: {article.Categorie}</Text>
                <Text>Prix: {article.Prix}</Text>
                <Text>Quantité:</Text>
                <ScrollView horizontal={true}>
                  <View style={styles.sizesContainer}>
                    {variantsData.map((variant) => (
                      <View key={variant.Taille_ID} style={styles.sizeButton}>
                        <Text>{variant.Description_Taille}</Text>
                        <Text>{variant.Couleur}</Text>
                        <Text>
                          {variant.Quantite > 0 ? variant.Quantite : "Epuisé"}
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
              <View
                style={[
                  styles.stockContainer,
                  totalQuantity > 0 ? styles.inStock : styles.outOfStock,
                ]}
              >
                <Text style={styles.stockStatus}>
                  {totalQuantity > 0 ? "En Stock" : "Epuisé"}
                </Text>
              </View>
            </View>
          );
        })
      ) : (
        <Text>No articles available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  articleListContainer: {
    marginTop: 20,
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
  },
  articleImage: {
    width: "100%",
    height: 200, // Adjust as necessary
  },
  textContainer: {
    padding: 10,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  chartLabel: {
    marginTop: 40,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  sizesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 4,
    padding: 8,
    alignItems: "center",
  },
  stockContainer: {
    padding: 10,
    backgroundColor: "green",
  },
  stockStatus: {
    textAlign: "center",
    color: "white",
  },
  inStock: {
    backgroundColor: "green",
  },
  outOfStock: {
    backgroundColor: "red",
  },
});

export default ArticleList;
