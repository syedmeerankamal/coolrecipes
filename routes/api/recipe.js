const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Recipe = require("../../models/recipe");

router.get("/all", async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error Fetching All Recipes");
  }
});

router.get("/all/:id", async (req, res) => {
  try {
    const recipes = await Recipe.find({ postedBy: req.params.id });
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error Fetching All Recipes By User");
  }
});

router.get("/detail/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id });
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error Fetching Recipe By Id");
  }
});

router.post("/create", async (req, res) => {
  let recipe = await Recipe.findOne({ name: req.body.name });

  if (recipe) {
    return res.status(400).json({ recipe: "Recipe already exists!" });
  } else {
    let {
      name,
      ingredients,
      description,
      prepTimeinMins,
      cookTimeinMins,
      serves,
      category,
      imageUrl,
      videoUrl,
      ratings
    } = req.body;

    const newRecipe = new Recipe({
      name,
      ingredients,
      description,
      prepTimeinMins,
      cookTimeinMins,
      serves,
      category,
      imageUrl,
      videoUrl,
      ratings: {
        count: ratings ? ratings.count : 0,
        value: ratings ? ratings.value : 0
      }
    });

    newRecipe
      .save()
      .then(recipe => res.json(recipe))
      .catch(err => console.log(err));
  }
});

router.delete("/delete/:id", async (req, res) => {
  let id = req.params.id;

  if (mongoose.Types.ObjectId.isValid(id)) {
    let result = await Recipe.deleteOne({ _id: id });

    if (result.deletedCount > 0) {
      res.json({
        result: `Recipe with id: ${id} has been deleted successfully!`
      });
    } else {
      res.status(400).json({ result: "Recipe not found!" });
    }
  } else {
    res.status(400).json({ result: "Invalid recipe id!" });
  }
});

router.put("/update/:id", async (req, res) => {
  let id = req.params.id;

  if (mongoose.Types.ObjectId.isValid(id)) {
    let result = await Recipe.updateOne({ _id: id }, { $set: req.body });

    if (result.nModified > 0) {
      res.json({
        result: `Recipe with id: ${id} has been updated successfully!`
      });
    } else {
      res.status(400).json({ result: "Recipe not found!" });
    }
  } else {
    res.status(400).json({ result: "Invalid recipe id!" });
  }
});

router.put("/rating/:id", async (req, res) => {
  let id = req.params.id;

  if (mongoose.Types.ObjectId.isValid(id)) {
    let result = await Recipe.updateOne({ _id: id }, { $set: req.body });

    if (result.nModified > 0) {
      res.json({
        result: `Recipe with id: ${id} has been updated successfully!`
      });
    } else {
      res.status(400).json({ result: "Recipe not found!" });
    }
  } else {
    res.status(400).json({ result: "Invalid recipe id!" });
  }
});

module.exports = router;
