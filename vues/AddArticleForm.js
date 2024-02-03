import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
} from "react-native";

const ArticleForm = () => {
  const [article, setArticle] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    section: "",
    image1: "",
    image2: "",
    image3: "",
  });

  const [sizes, setSizes] = useState([{ size: "S", colors: [] }]);
  const availableColors = ["Bleu", "Vert", "Jaune", "Gris", "Noir"];

  const handleChange = (field, value) => {
    setArticle({ ...article, [field]: value });
  };

  const handleSizeChange = (index, value) => {
    const newSizes = [...sizes];
    newSizes[index].size = value;
    setSizes(newSizes);
  };

  const handleColorSelection = (sizeIndex, color) => {
    const newSizes = [...sizes];
    const colorIndex = newSizes[sizeIndex].colors.findIndex(
      (c) => c.name === color
    );

    if (colorIndex > -1) {
      newSizes[sizeIndex].colors.splice(colorIndex, 1);
    } else {
      newSizes[sizeIndex].colors.push({ name: color, quantity: 0 });
    }

    setSizes(newSizes);
  };

  const handleQuantityChange = (sizeIndex, color, quantity) => {
    const newSizes = [...sizes];
    const colorIndex = newSizes[sizeIndex].colors.findIndex(
      (c) => c.name === color
    );
    newSizes[sizeIndex].colors[colorIndex].quantity = quantity;
    setSizes(newSizes);
  };

  const addSize = () => {
    setSizes([...sizes, { size: "S", colors: [] }]);
  };

  const handleSubmit = async () => {
    const completeData = { ...article, sizes };

    try {
      let response = await fetch("http://10.0.0.148:3000/addArticle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeData),
      });

      if (response.ok) {
        Alert.alert("Success", "Article ajouté avec succès.");
        setArticle({
          name: "",
          description: "",
          price: "",
          category: "",
          section: "",
          image1: "",
          image2: "",
          image3: "",
        });
        setSizes([{ size: "S", colors: [] }]);
      } else {
        const errorResponse = await response.text();
        console.error("Failed to submit article data:", errorResponse);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={{ fontWeight: "900", textAlign: "center", marginBottom: 20 }}
      >
        Ajouter un Article
      </Text>
      <ScrollView style={styles.form}>
        {/* Article Details Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Nom Article"
          value={article.name}
          onChangeText={(text) => handleChange("name", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={article.description}
          multiline
          onChangeText={(text) => handleChange("description", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Prix"
          value={article.price}
          keyboardType="numeric"
          onChangeText={(text) => handleChange("price", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Categorie"
          value={article.category}
          onChangeText={(text) => handleChange("category", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Section"
          value={article.section}
          onChangeText={(text) => handleChange("section", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Image1"
          value={article.image1}
          onChangeText={(text) => handleChange("image1", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Image2"
          value={article.image2}
          onChangeText={(text) => handleChange("image2", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Image3"
          value={article.image3}
          onChangeText={(text) => handleChange("image3", text)}
        />

        {sizes.map((size, sizeIndex) => (
          <View key={sizeIndex}>
            <Text style={{ fontWeight: 700, marginBottom: 10 }}>
              Saisir Taille:
            </Text>
            <TextInput
              style={[styles.input, { width: 50 }]}
              placeholder={`Size ${sizeIndex + 1}`}
              value={size.size}
              onChangeText={(text) => handleSizeChange(sizeIndex, text)}
            />
            <Text style={{ fontWeight: 700 }}>Selectionner Couleurs:</Text>
            {availableColors.map((color, colorIndex) => (
              <TouchableOpacity
                key={colorIndex}
                style={styles.colorOption}
                onPress={() => handleColorSelection(sizeIndex, color)}
              >
                <Text>{color}</Text>
              </TouchableOpacity>
            ))}
            {size.colors.map((selectedColor, selectedColorIndex) => (
              <View key={selectedColorIndex} style={styles.colorQuantity}>
                <Text style={{ marginBottom: 10, fontWeight: "600" }}>
                  {selectedColor.name}
                </Text>
                <TextInput
                  style={[styles.input, { width: 50 }]}
                  placeholder="Quantity"
                  value={selectedColor.quantity.toString()}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    handleQuantityChange(sizeIndex, selectedColor.name, text)
                  }
                />
              </View>
            ))}
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addSize}>
          <Text style={styles.buttonText}>Ajouter une Taille</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enregistrer</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#f5f5f5",
  },
  form: {
    marginHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: "#6f9fb0",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  colorOption: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    margin: 5,
    backgroundColor: "#c0c4cc",
    width: 100,
  },

  addButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 4,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  submitButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 4,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ArticleForm;
