const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "azerty",
  database: "Angular_Naruto",
  port: 5432,
});

// Exemple d'endpoint pour récupérer des données
app.get("/api/data", async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT 
          c.id AS card_id,
          c.name AS card_name,
          c.series,
          c.description AS card_description,
          c.image_url,
          c.rarity,
          c.created_at,
          c.uptated_at,
          c.health_points,
          c.attack_points,
          c.defense_points,
          categories.name AS category_name  -- 
        FROM 
          public.cards c
        LEFT JOIN 
          public.categories ON c.category_id = categories.id 
        ORDER BY 
          c.id ASC;`
      );
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur serveur");
    }
  });

app.listen(port, () => {
  console.log(`API en cours d'exécution sur http://localhost:${port}`);
});
