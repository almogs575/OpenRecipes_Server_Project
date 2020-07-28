var express = require("express");
var router = express.Router();
const DButils = require("../utils/DButils");
const utils= require("../utils/helpingFunc");
const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";


router.get("/search", async (req, res, next) => {
  try {
    const { query, cuisine, diet, intolerances, number } = req.query;
    const search_response = await axios.get(`${api_domain}/search`, {
      params: {
        query: query,
        cuisine: cuisine,
        diet: diet,
        intolerances: intolerances,
        number: number,
        apiKey: process.env.spooncular_apiKey
      }
    });
    let recipes = await Promise.all(
      search_response.data.results.map((recipe_raw) =>
        utils.getRecipeInfo(recipe_raw.id)
      )
    );
    recipes = recipes.map(
      function (recipe) {
        if(recipe.data.extendedIngredients && recipe.data.analyzedInstructions)
      return recipe.data
  })
          const recipesP = await utils.getPrevInfo(recipes);
   
      res.send( recipesP );
    } catch (error) {
      next(error);
    }
  });


  module.exports = router;
