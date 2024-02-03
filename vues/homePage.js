import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Article from "../classes/Article";
import { useSelector } from "react-redux";
import { Card } from "react-native-elements";
const HomePage = () => {
  const { section, category } = useSelector((state) => state.category);
  const [articles, setArticles] = useState([]);
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articleInstance = new Article();
        let url = "http://YourLocalHost:3000/articles";
        const params = [];
        if (searchTerm) {
          params.push(`search=${encodeURIComponent(searchTerm)}`);
        }
        if (section) {
          params.push(`section=${encodeURIComponent(section)}`);
        }
        if (category) {
          params.push(`category=${encodeURIComponent(category)}`);
        }
        if (params.length) {
          url += `?${params.join("&")}`;
        }
        const data = await articleInstance.afficherArticles(url);
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error.message);
      }
    };

    fetchArticles();
  }, [section, category, searchTerm]);

  const groupArticlesByCategory = (articles) => {
    return articles.reduce((groups, article) => {
      (groups[article.Categorie] = groups[article.Categorie] || []).push(
        article
      );
      return groups;
    }, {});
  };
  const articlesGroupedByCategory = groupArticlesByCategory(articles);

  return (
    <ScrollView>
      {Object.entries(articlesGroupedByCategory).length > 0 ? (
        Object.entries(articlesGroupedByCategory).map(
          ([categoryName, articlesInCategory], index) => (
            <View key={index}>
              <Text style={styles.categoryHeader}>{categoryName}</Text>
              <View style={styles.container}>
                {articlesInCategory.map((item, articleIndex) => (
                  <Card key={articleIndex} containerStyle={styles.card}>
                    <Card.Image
                      style={styles.image}
                      source={{ uri: item.Image_1 }}
                      onPress={() => {
                        navigation.navigate("Details", {
                          id_article: item.Article_ID,
                          title: item.Nom_article,
                          price: item.Prix,
                          details: item.Description,
                          image1: item.Image_1,
                          image2: item.Image_2,
                          image3: item.Image_3,
                          variantes: item.Variantes,
                          item: item,
                        });
                      }}
                    />
                    <Text numberOfLines={1} style={styles.title}>
                      {item.Nom_article}
                    </Text>
                    <Text style={styles.price}>${item.Prix}</Text>
                  </Card>
                ))}
              </View>
            </View>
          )
        )
      ) : (
        <Text style={styles.noArticlesText}>
          Aucun article disponible dans cette catégorie.
        </Text>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  card: {
    borderRadius: 20,
    width: 175,
    height: 250,
    marginBottom: 25,
    alignSelf: "center",
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    alignSelf: "center",
  },

  title: {
    marginTop: 10,
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFC72C",
  },
  noArticlesText: {
    textAlign: "center",
    marginTop: 20,
  },
  categoryHeader: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20,
    marginLeft: 10,
  },
});

export default HomePage;
