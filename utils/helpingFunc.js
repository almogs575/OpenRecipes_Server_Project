require("dotenv").config();
const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";

exports.getRecipeInfo = async function (id) {
  return axios.get(`${api_domain}/${id}/information`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey,
    },
  });
};



exports.getPrevInfo = async function (info) {
  try {
    return info.map((recipe) => {
      return {
        id: recipe.id,
        image: recipe.image,
        title: recipe.title,
        vegetarian: recipe.vegetarian,
        vegan: recipe.vegan,
        glutenFree: recipe.glutenFree,
        aggregateLikes: recipe.aggregateLikes,
        readyInMinutes: recipe.readyInMinutes,
      };
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getFullInfo = async function (info) {
  
  return {
    id: info.id,
    image: info.image,
    title: info.title,
    vegetarian: info.vegetarian,
    vegan: info.vegan,
    glutenFree: info.glutenFree,
    aggregateLikes: info.aggregateLikes,
    readyInMinutes: info.readyInMinutes,
    extendedIngredients: info.extendedIngredients,
    analyzedInstructions: info.analyzedInstructions[0],
    servings: info.servings,
    type: "public",
  
  };
};

