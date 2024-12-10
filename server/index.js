const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const { Pool } = require("pg");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Configuration de la base de données PostgreSQL
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "azerty",
  database: "Angular_Naruto",
  port: 5432,
});

// Configuration du stockage des fichiers avec multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'src', 'assets', 'images')); // Dossier de destination
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nom unique pour éviter les conflits
  },
});

const fileFilter = (req, file, cb) => {
  // Accepter seulement les images
  const fileTypes = /jpeg|jpg|png|webp|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Fichier valide
  } else {
    cb(new Error('Seules les images sont autorisées.'));
  }
};

const upload = multer({ storage, fileFilter });

// Middleware pour servir les fichiers statiques (images)
app.use('/images', express.static(path.join(__dirname, 'assets', 'images')));

// Récupération des cartes
app.get("/api/data", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          c.id AS card_id,
          c.name AS card_name,
          c.description AS card_description,
          c.image_url,
          c.created_at,
          c.uptated_at,
          c.health_points,
          c.attack_points,
          c.defense_points,
          categories.name AS category_name,
          series.name AS serie_name,
          rarity.name AS rarity_name
        FROM 
          public.cards c
        LEFT JOIN 
          public.categories ON c.category_id = categories.id 
        LEFT JOIN 
          public.series ON c.series_id = series.id
        LEFT JOIN
          public.rarity ON c.rarity_id = rarity.id
        ORDER BY 
          c.id ASC;`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
});

// Récupération des données pour les listes déroulantes (categories, rarity, series)
app.get("/api/form-data", async (req, res) => {
  try {
    const categoriesQuery = "SELECT id, name FROM public.categories";
    const seriesQuery = "SELECT id, name FROM public.series";
    const rarityQuery = "SELECT id, name FROM public.rarity";

    const [categories, series, rarities] = await Promise.all([
      pool.query(categoriesQuery),
      pool.query(seriesQuery),
      pool.query(rarityQuery),
    ]);
    res.status(200).json({
      categories: categories.rows,
      series: series.rows,
      rarities: rarities.rows,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données des listes déroulantes",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Ajout de carte(s)
app.post("/api/add-card", upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      description,
      health_points,
      attack_points,
      defense_points,
      category_id,
      rarity_id,
      series_id,
    } = req.body;

    // Définir l'URL de l'image téléchargée
    const image_url = req.file ? `assets/images/${req.file.filename}` : null;
    console.log('Fichier téléchargé:', req.file);

    if (!category_id || !rarity_id || !series_id) {
      return res.status(400).json({
        message: "Les clés étrangères (category_id, rarity_id, series_id) sont obligatoires.",
      });
    }

    const query = `
      INSERT INTO public.cards
      (name, image_url, description, health_points, attack_points, defense_points, category_id, rarity_id, series_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      name,
      image_url,
      description,
      health_points,
      attack_points,
      defense_points,
      category_id,
      rarity_id,
      series_id,
    ]);

    res.status(201).json({
      message: "Carte ajoutée avec succès",
      card: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la carte :", error);
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`API en cours d'exécution sur http://localhost:${port}`);
});