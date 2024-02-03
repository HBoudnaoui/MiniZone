CREATE DATABASE Minizone;

USE Minizone;


CREATE TABLE Utilisateurs (
    Utilisateur_ID INT AUTO_INCREMENT PRIMARY KEY,
    Nom VARCHAR(255),
    Prenom VARCHAR(255),
    Adresse TEXT,
    Courriel VARCHAR(255),
    Mot_de_Passe VARCHAR(255),
    is_admin BOOLEAN
);



CREATE TABLE Articles (
    Article_ID INT AUTO_INCREMENT PRIMARY KEY,
    Nom_article VARCHAR(255),
    Description TEXT,
    Prix DECIMAL(10, 2),
    Categorie VARCHAR(255) ,
    Section VARCHAR(255),
    Image_1 VARCHAR(255),
    Image_2 VARCHAR(255),
    Image_3 VARCHAR(255)
);

CREATE TABLE Couleurs (
    Couleur_ID INT AUTO_INCREMENT PRIMARY KEY,
    Article_ID INT,
    Couleur VARCHAR(255),
    FOREIGN KEY (Article_ID) REFERENCES Articles(Article_ID)
);

CREATE TABLE Tailles (
    Taille_ID INT AUTO_INCREMENT PRIMARY KEY,
    Article_ID INT,
    Couleur_ID INT,
    Quantite INT COMMENT 'Le stock disponible pour cette taille d\'article',
    Description_Taille ENUM('S', 'M', 'L', 'XL'),
    FOREIGN KEY (Article_ID) REFERENCES Articles(Article_ID),
    FOREIGN KEY (Couleur_ID) REFERENCES Couleurs(Couleur_ID)
);


CREATE TABLE Commandes (
    Commandes_ID INT AUTO_INCREMENT PRIMARY KEY,
    Numero_de_confirmation VARCHAR(255),
    Date_Commande DATETIME,
	Quantite INT,
    Utilisateur_ID INT, -- Ajout de la colonne Utilisateur_ID
    FOREIGN KEY (Utilisateur_ID) REFERENCES Utilisateurs(Utilisateur_ID)
);

CREATE TABLE Articles_Commandes (
    Articles_Commandes_ID INT AUTO_INCREMENT PRIMARY KEY,
    Commandes_ID INT,
    Article_ID INT,
    Utilisateur_ID INT,
    FOREIGN KEY (Commandes_ID) REFERENCES Commandes(Commandes_ID),
    FOREIGN KEY (Article_ID) REFERENCES Articles(Article_ID),
    FOREIGN KEY (Utilisateur_ID) REFERENCES Utilisateurs(Utilisateur_ID)
);



INSERT INTO Utilisateurs (Nom, Prenom, Adresse, Courriel, Mot_de_Passe, is_admin) VALUES
('admin', 'admin', 'MiniZone', 'admin@admin.com', 'admin', TRUE),
('Boudnaoui', 'Hamid', 'MiniZone', 'hamid@admin.com', 'admin', TRUE),
('Belkaousse', 'Yassine', 'MiniZone', 'yassine@admin.com', 'admin', TRUE),
('Erroussi', 'Ahmed', 'MiniZone', 'ahmed@admin.com', 'admin', TRUE);

INSERT INTO Articles (Nom_article, Description, Prix, Categorie, Section, Image_1, Image_2, Image_3) VALUES 

( 'chemise à carreaux', 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in', 49.99, 'Vêtements', 'Femmes', 'https://m.media-amazon.com/images/I/91utwN9QLXL._AC_SX679_.jpg', 'https://m.media-amazon.com/images/I/911ESZnwiwL._AC_SX679_.jpg', 'https://m.media-amazon.com/images/I/51ZwphOTctL._AC_SR38,50_.jpg'),
( 'pantalon de jogging', 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in', 45.00, 'Vêtements', 'Hommes', 'https://is4.fwrdassets.com/images/p/fw/z/PLAU-MP7_V4.jpg', 'https://m.media-amazon.com/images/I/911ESZnwiwL._AC_SX679_.jpg', 'https://m.media-amazon.com/images/I/51ZwphOTctL._AC_SR38,50_.jpg'),
( 'Robe de princesse décontractée', 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in', 45.00, 'Vêtements', 'Filles', 'https://m.media-amazon.com/images/I/81CVsR0JdhL._AC_SX679_.jpg', 'https://m.media-amazon.com/images/I/71KxHp5mdkL._AC_SX679_.jpg', 'https://m.media-amazon.com/images/I/81DN3SZ9aYL._AC_SX679_.jpg'),
( 'Combinaison à capuchon', 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in', 45.00, 'Vêtements', 'Garçons', 'https://m.media-amazon.com/images/I/81DLpywCx2L._AC_SY879_.jpg', 'https://m.media-amazon.com/images/I/915eDSDCS0L._AC_SY879_.jpg', 'https://m.media-amazon.com/images/I/81ypfT4ucBL._AC_SY879_.jpg');

INSERT INTO Couleurs (Article_ID, Couleur) VALUES
(1, 'Rouge'),(1, 'Bleu'),(1, 'Vert'),(1, 'Blanc'),(1, 'Noir'),
(2, 'Noir'),(2, 'Gris'),(2, 'Bleu'),(2, 'Vert'),(2, 'Rouge'),
(3, 'Rose'), (3, 'Bleu'), (3, 'Jaune'), (3, 'Blanc'), (3, 'Violet'),
(4, 'Gris'), (4, 'Bleu'), (4, 'Rouge'), (4, 'Noir'), (4, 'Vert');

SELECT * FROM Couleurs;

INSERT INTO Tailles (Article_ID, Couleur_ID, Quantite, Description_Taille) VALUES
(1, 1, 10, 'S'), (1, 1, 15, 'M'), (1, 1, 20, 'L'), (1, 1, 10, 'XL'),
(2, 2, 12, 'S'), (2, 2, 18, 'M'), (2, 2, 25, 'L'), (2, 2, 12, 'XL'),
(3, 3, 8, 'S'), (3, 3, 12, 'M'), (3, 3, 15, 'L'), (3, 3, 8, 'XL'),
(4, 4, 10, 'S'), (4, 4, 14, 'M'), (4, 4, 18, 'L'), (4, 4, 10, 'XL');





SELECT * FROM Tailles;
SELECT * FROM articles;
SELECT * FROM  utilisateurs;
SELECT * FROM  commandes;

