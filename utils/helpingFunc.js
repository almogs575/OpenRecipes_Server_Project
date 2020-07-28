require("dotenv").config();
const axios = require("axios");
const DButils = require("./DButils");

const api_domain = "https://api.spoonacular.com/recipes";

exports.getRecipeInfo = async function (id) {
  return axios.get(`${api_domain}/${id}/information`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey,
    },
  });
};

// async function getRecipeInfoFromDB(id) {
//   const watchedRecipesArr = await DButils.execQuery(
//     `SELECT watched_recipes FROM dbo.users WHERE user_id = '${req.user_id}'`
//   );
//   let splitedWatched = watchedRecipesArr[0]; //.favorite_recipse;//.split(",");
//   splitedWatched = Object.values(splitedWatched);
//   // splited= JSON.stringify(splited);
//   splitedWatched = splitedWatched[0].split(",");
//   splitedWatched.pop();
//   const favoriteRecipesArr = await DButils.execQuery(
//     `SELECT favorite_recipes FROM dbo.users WHERE user_id = '${req.user_id}'`
//   );
//   let splitedfavorite = favoriteRecipesArr[0]; //.favorite_recipse;//.split(",");
//   splitedfavorite = Object.values(splitedfavorite);
//   // splited= JSON.stringify(splited);
//   splitedfavorite = splitedfavorite[0].split(",");
//   splitedfavorite.pop();
//   recipeDetails = {
//     watched: splitedWatched.includes(id),
//     saved: splitedfavorite.includes(id),
//   };
//   return recipeDetails;
// }

exports.getPrevInfo = async function (info) {
  try {
    // let details = await getRecipeInfoFromDB(recipe.id);
    return info.map((recipe) => {
      // let res = await axios.get(`http://localhost:3000/profile/recipeInfo/`, {
      //   params: {
      //     id: recipe.id,
      //     // apiKey: process.env.spooncular_apiKey,
      //   },
      // });

      // console.log(res);
      // await axios.get(`http://localhost:3000/profile/recipeInfo/${recipe.id}`);
      // let details = await axios.get(`http://localhost:3000/profile/recipeInfo/${recipe.id}`);
      // let a;

      return {
        id: recipe.id,
        image: recipe.image,
        title: recipe.title,
        vegetarian: recipe.vegetarian,
        vegan: recipe.vegan,
        glutenFree: recipe.glutenFree,
        aggregateLikes: recipe.aggregateLikes,
        readyInMinutes: recipe.readyInMinutes,
        // watched: false,
        // saved: false,
      };
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getFullInfo = async function (info) {
  // const recipeIngredients = info.extendedIngredients.map((ingredient) => {
  //   return {
  //     original: ingredient.original,
  //   };
  // });
  // const response = await axios.get(
  //   `http://localhost:3000/profile/recipeInfo/${req.query.id}`
  //   //   {
  //   //   params: { id: req.query.id }
  //   // }
  // );
  // const anInstructions = await getAnalyzedInstructions(info.id);
  // if (info.analyzedInstructions.length > 0)
  //   var analyzedInstructions = getAnalyzedSteps(
  //     info.analyzedInstructions[0].steps
  //   );
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
    // watched: false,
    // saved: false,
    // recipeOwner: recipe.data.recipe_owner,
    // inEvent: recipe.in_event
  };
};

exports.getCountries = async function () {
  return axios.get(`https://restcountries.eu/rest/v2/all`, {
    params: {
      //includeNutrition: false,
      //apiKey: process.env.spooncular_apiKey
    },
  });
};

function getAnalyzedSteps(steps) {
  return steps.map((step) => {
    let recipeIngredients = step.ingredients.map((ingredient) => {
      return {
        name: ingredient.name,
        image: ingredient.image,
      };
    });
    let recipeEquipment = step.equipment.map((equipment) => {
      return {
        name: equipment.name,
        image: equipment.image,
      };
    });
    return {
      number: step.number,
      step: step.step,
      ingredients: recipeIngredients,
      equipment: recipeEquipment,
    };
  });
}

function getAnalyzedInstructions(id) {
  return axios.get(`${api_domain}/${id}/analyzedInstructions`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey,
    },
  });
}

//- or we can use this:
//module.exports ={

//}
