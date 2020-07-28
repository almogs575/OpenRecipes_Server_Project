var express = require("express");
var router = express.Router();
const axios = require("axios");
const DButils = require("../utils/DButils");
const utils = require("../utils/helpingFunc");
const api_domain = "https://api.spoonacular.com/recipes";

router.use(function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM dbo.users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
        }
        next();
      })
      .catch((error) => next(error));
  } else {
    next();
  }
});

router.get("/information", async (req, res, next) => {
  try {
    let recipeID = req.query.id;
    // let newRecipe = req.query.id;

    if (recipeID.length > 10 && req.user_id != undefined) {
      const familyRecipes = await DButils.execQuery(
        `SELECT * FROM dbo.recipes WHERE user_id = '${req.user_id}' and id='${recipeID}' and type='family'`
      );
      const personalRecipes = await DButils.execQuery(
        `SELECT * FROM recipes  WHERE user_id = '${req.user_id}' and id='${recipeID}' and type='personal'`
      );
      if (familyRecipes.length > 0) {
        familyRecipes[0].extendedIngredients = JSON.parse(
          familyRecipes[0].extendedIngredients
        );
        familyRecipes[0].analyzedInstructions = JSON.parse(
          familyRecipes[0].analyzedInstructions
        );
        // let lastRecipes = await DButils.execQuery(
        //   `SELECT watched_recipes FROM dbo.users WHERE user_id = '${req.user_id}'`
        // );
        // let newWatched;
        // if (lastRecipes[0].watched_recipes != "")
        //   newWatched = recipeID + "," + lastRecipes[0].watched_recipes;
        // else newWatched = recipeID;

        // await DButils.execQuery(
        //   `UPDATE dbo.users Set watched_recipes =CAST('${newWatched}' AS varchar) WHERE user_id = '${req.user_id}'`
        // );
        res.send(familyRecipes[0]);
      }
      if (personalRecipes.length > 0) {
        personalRecipes[0].extendedIngredients = JSON.parse(
          personalRecipes[0].extendedIngredients
        );
        personalRecipes[0].analyzedInstructions = JSON.parse(
          personalRecipes[0].analyzedInstructions
        );
        // let lastRecipes = await DButils.execQuery(
        //   `SELECT watched_recipes FROM dbo.users WHERE user_id = '${req.user_id}'`
        // );
        // let newWatched;
        // if (lastRecipes[0].watched_recipes != "")
        //   newWatched = recipeID + "," + lastRecipes[0].watched_recipes;
        // else newWatched = recipeID;

        // await DButils.execQuery(
        //   `UPDATE dbo.users Set watched_recipes =CAST('${newWatched}' AS varchar) WHERE user_id = '${req.user_id}'`
        // );
        res.send(personalRecipes[0]);
      }
    } else {
      let recipe = await utils.getRecipeInfo(req.query.id);
      let newRecipe = req.query.id;
      let recipesP = await utils.getFullInfo(recipe.data);

      if (req.user_id != undefined) {
        let lastRecipes = await DButils.execQuery(
          `SELECT watched_recipes FROM dbo.users WHERE user_id = '${req.user_id}'`
        );
        let newWatched;
        if (lastRecipes[0].watched_recipes != "")
          newWatched = newRecipe + "," + lastRecipes[0].watched_recipes;
        else newWatched = newRecipe;

        await DButils.execQuery(
          `UPDATE dbo.users Set watched_recipes =CAST('${newWatched}' AS varchar) WHERE user_id = '${req.user_id}'`
        );
      }
      res.send(recipesP);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/random", async (req, res, next) => {
  try {
    const random_response = await axios.get(`${api_domain}/random`, {
      params: {
        number: 3,
        apiKey: process.env.spooncular_apiKey,
      },
    });
    random_response.data.recipes.map(async (recipe) => {
      while (recipe.instructions === undefined) {
        recipe = await axios.get(`${api_domain}/random`, {
          params: {
            number: 1,
            apiKey: process.env.spooncular_apiKey,
          },
        });
        recipe = recipe.data.recipes[0];
      }
    });

    let recipes = random_response.data.recipes; //.map((recipe) => recipe.data);
    let recipesP = await utils.getPrevInfo(recipes);

    res.send(recipesP);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
