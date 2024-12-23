const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const { Pool } = require("pg");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

app.use((req, res, next) => {
  console.log('Taille de la charge utile (bytes):', req.headers['content-length']);
  next();
});

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "azerty",
  database: "Angular_Naruto",
  port: 5432,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "src", "assets", "images"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|webp|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Seules les images sont autorisées."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});

app.use("/images", express.static(path.join(__dirname, "assets", "images")));

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
app.post("/api/add-card", upload.single("image"), async (req, res) => {
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

    const image_url = req.file ? `assets/images/${req.file.filename}` : null;
    console.log("Fichier téléchargé:", req.file);

    if (!category_id || !rarity_id || !series_id) {
      return res.status(400).json({
        message:
          "Les clés étrangères (category_id, rarity_id, series_id) sont obligatoires.",
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

// Modificiation
// Récupération des données
app.get("/api/data/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const request = `SELECT 
  cards.id, 
  cards.name, 
  cards.description, 
  cards.image_url, 
  cards.health_points, 
  cards.attack_points, 
  cards.defense_points, 
  cards.category_id, 
  categories.name AS category_name, -- Nom de la catégorie
  cards.rarity_id, 
  rarity.name AS rarity_name, -- Nom de la rareté
  cards.series_id,  -- ID de la série
  series.name AS series_name  -- Nom de la série
FROM 
  public.cards
LEFT JOIN 
  public.categories ON cards.category_id = categories.id
LEFT JOIN 
  public.rarity ON cards.rarity_id = rarity.id
LEFT JOIN 
  public.series ON cards.series_id = series.id  -- Jointure avec la table des séries
WHERE 
  cards.id = $1;`;

    const result = await pool.query(request, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Carte non trouvée." });
    }

    const card = result.rows[0];
    res.send({
      id: card.id,
      name: card.name,
      description: card.description,
      image_url: card.image_url,
      health_points: card.health_points,
      attack_points: card.attack_points,
      defense_points: card.defense_points,
      category: {
        id: card.category_id,
        name: card.category_name,
      },
      rarity: {
        id: card.rarity_id,
        name: card.rarity_name,
      },
      series: {
        id: card.series_id,
        name: card.series_name,
      },
    });
    console.log("données récupéres : ", card);
  } catch (error) {
    console.error("Erreur lors de la récupération de la carte:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des données." });
  }
});

app.put("/api/update-card/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
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

  let image_url = req.file ? `assets/images/${req.file.filename}` : null;
  console.log("Fichier téléchargé:", req.file);

  try {
    const query = `
      UPDATE public.cards
      SET name = $1, description = $2, health_points = $3, attack_points = $4,
          defense_points = $5, category_id = $6, rarity_id = $7, series_id = $8,
          image_url = COALESCE($9, image_url) -- Si pas de nouvelle image, garder l'ancienne
      WHERE id = $10
      RETURNING *;
    `;

    const values = [
      name,
      description,
      health_points,
      attack_points,
      defense_points,
      category_id,
      rarity_id,
      series_id,
      image_url,
      id,
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Carte non trouvée." });
    }

    res.status(200).json({
      message: "Carte mise à jour avec succès.",
      card: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la carte :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

//Suppression d'une carte
app.delete("/api/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM public.cards WHERE id =$1", [
      id,
    ]);
    if (result.rowCount > 0) {
      res.status(200).json({ message: `Carte supprimée avec succès.` });
    } else {
      res.status(404).json({ message: `Carte avec l'id ${id} introuvable.` });
    }
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});

// Création d'un utilisateur
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length > 0) {
      return res.status(400).json({ message: "L'email est déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at;
    `;
    const values = [username, email, hashedPassword];

    const insertResult = await pool.query(insertQuery, values);

    return res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: insertResult.rows[0],
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

// Connexion utilisateur
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email et mot de passe sont requis" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    return res.status(200).json({
      message: "Connexion réussie",
      username: user.username,
      userId : user.id,
    });
  } catch (error) {
    console.error("Erreur de connexion", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

//Modification de la photo de profil de l'utilisateur
app.put("/api/users/profile-image", upload.single('profile_image'), (req, res) => {
  console.log('Image reçue:', req.file);

  const { userId } = req.body;

  const image_url = req.file ? `assets/images/${req.file.filename}` : null;
  console.log("Fichier téléchargé:", req.file);

  pool.query(
    'UPDATE users SET image = $1 WHERE id = $2 RETURNING *',
    [image_url, userId],
    (error, result) => {
      if (error) {
        console.error('Erreur lors de la mise à jour de la photo de profil:', error);
        return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'image' });
      }

      res.status(200).json({
        message: 'Image mise à jour avec succès',
        user: result.rows[0],
      });
    }
  );
});

app.get("/api/users/:id/profile-image", (req, res) => {
  const { id } = req.params;
  console.log(`Demande d'image pour l'utilisateur avec ID: ${id}`);

  pool.query('SELECT image FROM users WHERE id = $1', [id], (error, result) => {
    if (error) {
      console.error('Erreur lors de la récupération de l\'image:', error);
      return res.status(500).json({ message: 'Erreur lors de la récupération de l\'image' });
    }

    if (result.rows.length === 0) {
      console.log('Utilisateur non trouvé');
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const image_url = result.rows[0].image;
    console.log(`Image trouvée: ${image_url}`);
    res.status(200).json({ image_url });
  });
});

app.listen(port, () => {
  console.log(`API en cours d'exécution sur http://localhost:${port}`);
});
