const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const util = require("util");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(
  "sk_test_51ON0ZBLTJxJWsXRs3zzDAHxAA71lOJ2wDgqzVbDsGrujKksCrOVSmox1LGMEDCa1RdayxhZa3GLAveli1sZeGMGv00D7grNbOX"
);

const app = express();
app.use(cors());
app.use(
  bodyParser.json({
    verify: function (req, res, buf) {
      req.rawBody = buf;
    },
  })
);
app.use(bodyParser.json());

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "minizone",
});

app.get("/users", (req, res) => {
  connection.getConnection((err, connection) => {
    if (err) {
      res
        .status(500)
        .json({ success: false, message: "Database connection error" });
      return;
    }
    const query = "SELECT * FROM Utilisateurs";

    connection.query(query, (error, results, fields) => {
      connection.release();

      if (error) {
        res.status(500).json({
          success: false,
          message: "Error querying user data",
          error: error.message,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "User data fetched successfully",
        data: results,
      });
    });
  });
});

app.post("/addArticle", async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    section,
    image1,
    image2,
    image3,
    sizes,
  } = req.body;

  try {
    connection.query = util.promisify(connection.query);

    const articleResult = await connection.query(
      "INSERT INTO Articles (Nom_article, Description, Prix, Categorie, Section, Image_1, Image_2, Image_3) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, description, price, category, section, image1, image2, image3]
    );

    const articleId = articleResult.insertId;

    for (const size of sizes) {
      for (const color of size.colors) {
        const colorResult = await connection.query(
          "INSERT INTO Couleurs (Article_ID, Couleur) VALUES (?, ?)",
          [articleId, color.name]
        );
        const colorId = colorResult.insertId;

        await connection.query(
          "INSERT INTO Tailles (Article_ID, Couleur_ID, Quantite, Description_Taille) VALUES (?, ?, ?, ?)",
          [articleId, colorId, color.quantity, size.size]
        );
      }
    }

    res.status(200).send("Article and details added successfully");
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send("Failed to add article");
  }
});

app.get("/articles", (req, res) => {
  connection.getConnection((err, connection) => {
    if (err) {
      res.json({ success: false, message: "Database connection error" });
      return;
    }

    let query = `
      SELECT
        a.Article_ID,
        a.Nom_article,
        a.Description,
        a.Prix,
        a.Categorie,
        a.Section,
        a.Image_1,
        a.Image_2,
        a.Image_3,
        CONCAT('[', GROUP_CONCAT(
            JSON_OBJECT(
                'Taille_ID', t.Taille_ID,
                'Description_Taille', t.Description_Taille,
                'Couleur_ID', c.Couleur_ID,
                'Couleur', c.Couleur,
                'Quantite', t.Quantite
            )
            ORDER BY t.Description_Taille, c.Couleur SEPARATOR ','
        ), ']') AS Variantes
      FROM Articles a
      JOIN Tailles t ON a.Article_ID = t.Article_ID
      JOIN Couleurs c ON t.Couleur_ID = c.Couleur_ID`;

    const queryParams = [];
    if (req.query.categorie) {
      queryParams.push(`a.Categorie = '${req.query.categorie}'`);
    }
    if (req.query.section) {
      queryParams.push(`a.Section = '${req.query.section}'`);
    }
    if (req.query.search) {
      queryParams.push(`a.Nom_article LIKE '%${req.query.search}%'`);
    }

    if (queryParams.length) {
      query += ` WHERE ${queryParams.join(" AND ")}`;
    }

    query += " GROUP BY a.Article_ID";

    connection.query(query, (error, results, fields) => {
      connection.release();
      if (error) {
        res.json({
          success: false,
          message: "Query error",
          error: error.message,
        });
        return;
      }
      res.send(results);
    });
  });
});

app.get("/sections-categories", (req, res) => {
  const query = `
    SELECT DISTINCT a.Section, a.Categorie
    FROM Articles a
    ORDER BY a.Section, a.Categorie;
  `;
  connection.query(query, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ success: false, message: "Erreur de serveur" });
    }

    const structuredResults = results.reduce((acc, curr) => {
      if (!acc[curr.Section]) {
        acc[curr.Section] = [];
      }
      acc[curr.Section].push(curr.Categorie);
      return acc;
    }, {});

    res.json(structuredResults);
  });
});

app.post("/register", (req, res) => {
  connection.getConnection((err, connection) => {
    if (err) {
      res.json({ success: false, message: "Database connection error" });
      return;
    }
    const { nom, prenom, adresse, email, password, isAdmin } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
      const query =
        "INSERT INTO Utilisateurs (Nom, Prenom, Adresse, Courriel, Mot_de_Passe, is_admin) VALUES (?, ?, ?, ?, ?, ?)";
      connection.query(
        query,
        [nom, prenom, adresse, email, hash, isAdmin],
        (error, results) => {
          connection.release();
          if (error) {
            res.json({ success: false, message: "Query error" });
            return;
          }
          res.json({ success: true, message: "Registration successful" });
        }
      );
    });
  });
});

app.post("/login", (req, res) => {
  connection.getConnection((err, connection) => {
    if (err) {
      res.json({ success: false, message: "Database connection error" });
      return;
    }
    const { email, password } = req.body;
    const query = "SELECT * FROM Utilisateurs WHERE Courriel = ?";
    connection.query(query, [email], (error, results) => {
      connection.release();
      if (error) {
        res.json({ success: false, message: "Query error" });
        return;
      }
      if (results.length > 0) {
        bcrypt.compare(password, results[0].Mot_de_Passe, (err, isMatch) => {
          if (isMatch) {
            const token = jwt.sign(
              {
                email: results[0].Courriel,
                nom: results[0].Nom,
                prenom: results[0].Prenom,
                is_admin: results[0].is_admin,
              },
              "Jeton",
              { expiresIn: "1h" }
            );
            res.json({
              success: true,
              token,
              is_admin: results[0].is_admin,
              message: "Login successful",
              user: {
                userId: results[0].Utilisateur_ID,
                email: results[0].Courriel,
                password: results[0].Mot_de_Passe,
                nom: results[0].Nom,
                prenom: results[0].Prenom,
                adresse: results[0].Adresse,
              },
            });
          } else {
            res.json({
              success: false,
              message: "Courriel ou mot de passe incorrect",
            });
          }
        });
      } else {
        res.json({ success: false, message: "Utilisateur non trouvé" });
      }
    });
  });
});

app.post("/updateUser", (req, res) => {
  console.log("Received data:", req.body);
  connection.getConnection((err, connection) => {
    if (err) {
      res.json({ success: false, message: "Database connection error" });
      return;
    }
    const { userId, nom, prenom, adresse } = req.body;
    const query =
      "UPDATE Utilisateurs SET Nom = ?, Prenom = ?, Adresse = ? WHERE Utilisateur_ID = ?";

    connection.query(query, [nom, prenom, adresse, userId], (error) => {
      connection.release();
      if (error) {
        res.json({
          success: false,
          message: "Query error",
          error: error.message,
        });
        return;
      }
      res.json({
        success: true,
        message: "User information updated successfully",
      });
    });
  });
});

app.post("/logout", (req, res) => {
  res.json({ success: true, message: "Déconnexion réussie" });
});

app.get("/sections-categories", (req, res) => {
  const query = `
    SELECT DISTINCT a.Section, a.Categorie
    FROM Articles a
    ORDER BY a.Section, a.Categorie;
  `;
  connection.query(query, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ success: false, message: "Erreur de serveur" });
    }

    const structuredResults = results.reduce((acc, curr) => {
      if (!acc[curr.Section]) {
        acc[curr.Section] = [];
      }
      acc[curr.Section].push(curr.Categorie);
      return acc;
    }, {});

    res.json(structuredResults);
  });
});

app.post("/payment-minizone", async (req, res) => {
  try {
    const { cart, total, user } = req.body;

    const customer = await stripe.customers.create({
      email: user?.email,
      name: `${user?.name} ${user?.lastName}`,
      address: {
        line1: user?.address,
      },
    });

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2023-10-16" }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "cad",
      customer: customer.id,
      metadata: {
        userId: user?.userID,
        userEmail: user?.email,
        cartItems: JSON.stringify(cart),
      },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey:
        "pk_test_51ON0ZBLTJxJWsXRsvUfszZZCtJmWYbLBPqpl5PzKNh9CvdTmqP5ImVIyAexGKQK0fuiFPFFkjTUDLRuWdpvBE24W00Jp8ozGl3",
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: error.message });
  }
});

const endpointSecret =
  "whsec_903e3a6a8684b48588cd66ab250e8c0aececd9fbd2261a15bcf28bda2a7bc91b";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];
    const payload = request.body;

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        sig,
        endpointSecret
      );
    } catch (err) {
      console.error("Webhook Error:", err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;

        const paymentId = paymentIntentSucceeded.id;
        const userId = paymentIntentSucceeded.metadata.userId;
        const cartItemsJsonString = paymentIntentSucceeded.metadata.cartItems;
        const cartItems = JSON.parse(cartItemsJsonString);

        try {
          await savePaymentDataToDatabase(paymentId, userId, cartItems);
        } catch (error) {
          console.error("Error saving payment data to the database:", error);
          response.status(500).json({ error: "Error saving payment data" });
          return;
        }

        break;
      case "customer.created":
        // Logique pour traiter l'événement customer.created
        break;

      case "payment_intent.created":
        // Logique pour traiter l'événement payment_intent.created
        break;

      case "charge.succeeded":
        // Logique pour traiter l'événement charge.succeeded
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.send();
  }
);

async function savePaymentDataToDatabase(paymentId, userId, cartItems) {
  try {
    // Définition de la fonction query pour exécuter les requêtes SQL
    connection.query = util.promisify(connection.query);

    // Préparation des requêtes SQL
    const commandesQuery =
      "INSERT INTO Commandes (Numero_de_confirmation, Date_Commande, Quantite, Utilisateur_ID) VALUES (?, NOW(), ?, ?)";
    const commandesArticlesQuery =
      "INSERT INTO Articles_Commandes (Commandes_ID, Article_ID, Utilisateur_ID) VALUES (?, ?, ?)";
    const quantityUpdateQuery =
      "UPDATE Tailles SET Quantite = Quantite - ? WHERE Article_ID = ? AND Taille_ID = ? AND Couleur_ID = ?";

    let commandesResults;

    // Traitement des articles du panier
    for (let item of cartItems) {
      const commandesValues = [paymentId, item.quantity, userId];

      // Insertion des données dans la table Commandes et récupération du ID de la commande
      commandesResults = await connection.query(
        commandesQuery,
        commandesValues
      );
      const commandeId = commandesResults.insertId;

      // Insertion des données dans la table Articles_Commandes
      const ArticlesCommandesValues = [commandeId, item.id, userId];
      await connection.query(commandesArticlesQuery, ArticlesCommandesValues);
    }

    // Mise à jour des quantités dans la table Tailles
    const taillesValues = cartItems.map((item) => [
      item.quantity,
      item.id,
      item.id_taille,
      item.id_couleur,
    ]);
    for (let values of taillesValues) {
      await connection.query(quantityUpdateQuery, values);
    }

    // Retourne les derniers résultats de commandes
    return { commandesResults };
  } catch (error) {
    console.error("Error in savePaymentDataToDatabase:", error);
    throw error;
  }
}

app.post("/commandes", (req, res) => {
  const userId = parseInt(req.body.userId);

  connection.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Connection error.", error: err });
    }

    const query = `
      SELECT
      Commandes.Commandes_ID,
      Articles.Nom_article,
      Articles.Image_1,
      Articles.Prix,
      Commandes.Numero_de_confirmation,
      Commandes.Date_Commande,
      Commandes.Quantite
    FROM Articles_Commandes
    JOIN Articles ON Articles_Commandes.Article_ID = Articles.Article_ID
    JOIN Commandes ON Articles_Commandes.Commandes_ID = Commandes.Commandes_ID
    WHERE Articles_Commandes.Utilisateur_ID = ?;
    
      `;

    connection.query(query, [userId], (error, results) => {
      connection.release();

      if (error) {
        console.error("Query error:", error);
        return res
          .status(500)
          .json({ success: false, message: "Query error", error: error });
      }

      res.json({ success: true, data: results });
    });
  });
});

app.get("/totals", (req, res) => {
  const totalsQuery = `
    SELECT 
      (SELECT COUNT(*) FROM Utilisateurs) AS totalUsers,
      (SELECT COUNT(*) FROM Articles) AS totalProducts,
      (SELECT COUNT(*) FROM Commandes) AS totalOrders;
  `;

  const salesQuery = `
    SELECT
      Articles.Prix,
      Commandes.Date_Commande,
      Commandes.Quantite
    FROM Articles_Commandes
    JOIN Articles ON Articles_Commandes.Article_ID = Articles.Article_ID
    JOIN Commandes ON Articles_Commandes.Commandes_ID = Commandes.Commandes_ID;
  `;

  connection.query(totalsQuery, (error, totalsResults) => {
    if (error) {
      console.error("Error executing totals query:", error);
      return res.status(500).json({
        success: false,
        message: "Error executing totals query",
        error: error.message,
      });
    }

    connection.query(salesQuery, (error, salesResults) => {
      if (error) {
        console.error("Error executing sales query:", error);
        return res.status(500).json({
          success: false,
          message: "Error executing sales query",
          error: error.message,
        });
      }

      res.json({
        totals: {
          totalUsers: totalsResults[0].totalUsers,
          totalProducts: totalsResults[0].totalProducts,
          totalOrders: totalsResults[0].totalOrders,
        },
        sales: salesResults,
      });
    });
  });
});
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
