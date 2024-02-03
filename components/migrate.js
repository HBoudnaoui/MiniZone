const mysql = require("mysql");
const bcrypt = require("bcrypt");
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "minizone",
});

const encryptAndUpdatePasswords = () => {
  connection.getConnection((err, conn) => {
    if (err) {
      console.error("Error connecting to the database", err);
      return;
    }

    const selectQuery = "SELECT Utilisateur_ID, Mot_de_Passe FROM Utilisateurs";
    conn.query(selectQuery, async (selectErr, users) => {
      if (selectErr) {
        conn.release();
        console.error("Error fetching users", selectErr);
        return;
      }

      for (let user of users) {
        const hashedPassword = await bcrypt.hash(user.Mot_de_Passe, 10);
        const updateQuery =
          "UPDATE Utilisateurs SET Mot_de_Passe = ? WHERE Utilisateur_ID = ?";
        conn.query(
          updateQuery,
          [hashedPassword, user.Utilisateur_ID],
          (updateErr) => {
            if (updateErr) {
              console.error("Error updating user password", updateErr);
            } else {
              console.log(
                `Updated password for user ID: ${user.Utilisateur_ID}`
              );
            }
          }
        );
      }

      conn.release();
    });
  });
};

encryptAndUpdatePasswords();
