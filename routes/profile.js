var express = require("express");
var router = express.Router();
const DButils = require("../utils/DButils");
const utils = require("../utils/helpingFunc");

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

router.use(function requireLogin(req, res, next) {
  if (!req.user_id) {
    next({ status: 401, message: "unauthorized" });
  } else {
    next();
  }
});

router.get("/recipeInfo", async (req, res, next) => {
  try {
    let id = req.query.id;
    //const id = req.params.id;
    const watchedRecipesArr = await DButils.execQuery(
      `SELECT watched_recipes FROM dbo.users WHERE user_id = '${req.user_id}'`
    );
    let splitedWatched = watchedRecipesArr[0]; //.favorite_recipse;//.split(",");
    splitedWatched = Object.values(splitedWatched);
    // splited= JSON.stringify(splited);
    splitedWatched = splitedWatched[0].split(",");
    splitedWatched = splitedWatched.filter((x) => x);

    // splitedWatched.pop();
    const favoriteRecipesArr = await DButils.execQuery(
      `SELECT favorite_recipes FROM dbo.users WHERE user_id = '${req.user_id}'`
    );
    let splitedfavorite = favoriteRecipesArr[0]; //.favorite_recipse;//.split(",");
    splitedfavorite = Object.values(splitedfavorite);
    // splited= JSON.stringify(splited);
    splitedfavorite = splitedfavorite[0].split(",");
    splitedfavorite = splitedfavorite.filter((x) => x);

    // splitedfavorite.pop();
    recipeDetails = {
      watched: splitedWatched.includes(id),
      saved: splitedfavorite.includes(id),
    };

    res.send(recipeDetails);
  } catch (error) {
    next(error);
  }
});

// router.post("/familyRecipes", async (req, res, next) => {
//   try {
//     const recipeIngredients = JSON.stringify(req.body.ingredients);
//     const recipeInstuctions = JSON.stringify(req.body.analyzedInstructions);
//     //const recipeIngrename=Object.keys(recipeIngre[0]);
//     await DButils.execQuery(
//       `INSERT INTO dbo.recipes VALUES (default,'${req.user_id}','${req.body.title}','${req.body.image}','${req.body.readyInMinutes}','${req.body.aggregateLikes}','${req.body.vegan}','${req.body.vegetarian}','${req.body.gluttenFree}','${recipeIngredients}','${recipeInstuctions}','${req.body.servings}','family','${req.body.recipeOwner}','${req.body.inEvent}');`
//     );
//     res.send({ sucess: true });
//   } catch (error) {
//     next(error);
//   }
// });

// router.get("/familyRecipes/:id", async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const familyRecipes = await DButils.execQuery(
//       `SELECT * FROM dbo.recipes WHERE user_id = '${req.user_id}' and id='${id}' and type='family'`
//     );
//     familyRecipes[0].ingredients = JSON.parse(familyRecipes[0].ingredients);
//     familyRecipes[0].analyzedInstructions = JSON.parse(
//       familyRecipes[0].analyzedInstructions
//     );

//     res.send(familyRecipes);
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/familyRecipes", async (req, res, next) => {
  try {
    const familyRecipse = await DButils.execQuery(
      `SELECT * FROM recipes where user_id = '${req.user_id}' and type='family'`
    );
    const familyRecipseP = await utils.getPrevInfo(familyRecipse);

    res.send(familyRecipseP);
  } catch (error) {
    next(error);
  }
});

router.get("/personalRecipes", async (req, res, next) => {
  try {
    const personalRecipes = await DButils.execQuery(
      `SELECT * FROM dbo.recipes where user_id = '${req.user_id}' and type = 'personal'`
    );
    const personalRecipesP = await utils.getPrevInfo(personalRecipes);

    res.send(personalRecipesP);
  } catch (error) {
    next(error);
  }
});

// router.get("/personalRecipes/:id", async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const personalRecipes = await DButils.execQuery(
//       `SELECT * FROM recipes  WHERE user_id = '${req.user_id}' and id='${id}' and type='personal'`
//     );
//     personalRecipes[0].ingredients = JSON.parse(personalRecipes[0].ingredients);
//     personalRecipes[0].analyzedInstructions = JSON.parse(
//       personalRecipes[0].analyzedInstructions
//     );

//     res.send(personalRecipes);
//   } catch (error) {
//     next(error);
//   }
// });

router.post("/newRecipe", async (req, res, next) => {
  try {
    // const recipeIngredients1 = JSON.stringify(req.body.ingredients);
    // const recipeInstuctions1 = JSON.stringify(req.body.analyzedInstructions);
    //const recipeIngrename=Object.keys(recipeIngre[0]);

    const extendedIngredients = JSON.stringify(req.body.extendedIngredients);
    const analyzedInstructions = JSON.stringify(req.body.analyzedInstructions);

    if (req.body.type == "personal")
      await DButils.execQuery(
        `INSERT INTO dbo.recipes VALUES (default,'${req.user_id}','${req.body.title}','${req.body.image}','${req.body.readyInMinutes}','${req.body.aggregateLikes}','${req.body.vegan}','${req.body.vegetarian}','${req.body.glutenFree}','${extendedIngredients}','${analyzedInstructions}','${req.body.servings}','personal','${req.body.recipeOwner}','${req.body.inEvent}');`
      );
    else if (req.body.type == "family")
      await DButils.execQuery(
        `INSERT INTO dbo.recipes VALUES (default,'${req.user_id}','${req.body.title}','${req.body.image}','${req.body.readyInMinutes}','${req.body.aggregateLikes}','${req.body.vegan}','${req.body.vegetarian}','${req.body.glutenFree}','${extendedIngredients}','${analyzedInstructions}','${req.body.servings}','family','${req.body.recipeOwner}','${req.body.inEvent}');`
      );

    //const recipeIngrename=Object.keys(recipeIngre[0]);

    res.send({ sucess: true });
  } catch (error) {
    next(error);
  }
});

router.get("/favoriteRecipes", async (req, res, next) => {
  try {
    const arr = await DButils.execQuery(
      `SELECT favorite_recipes FROM dbo.users where user_id = '${req.user_id}'`
    );

    let splited = arr[0];
    splited = Object.values(splited);
    splited = splited[0].split(",");
    if (splited.lenght > 1) splited.pop();
    splited = splited.filter((x) => x);
    splited = splited.filter((x) => x != '0');

    let recipes = await Promise.all(
      splited.map((recipe_raw) => {
        return utils.getRecipeInfo(parseInt(recipe_raw, 10));
      })
    );

    recipes = recipes.map((recipe) => recipe.data);
    const favoriteRecipesP = await utils.getPrevInfo(recipes);

    res.send(favoriteRecipesP);
  } catch (error) {
    next(error);
  }
});

// router.get("/favoriteRecipesID", async (req, res, next) => {
//   try {
//     const arr = await DButils.execQuery(
//       `SELECT favorite_recipes FROM dbo.users where user_id = '${req.user_id}'`
//     );

//     let splited = arr[0];
//     splited = Object.values(splited);
//     splited = splited[0].split(",");
//     if (splited.lenght > 1) splited.pop();
//     splited = splited.filter((x) => x);
//     // let recipes = await Promise.all(
//     //   splited.map((recipe_raw) => {
//     //     return utils.getRecipeInfo(parseInt(recipe_raw, 10));
//     //   })
//     // );

//     // recipes = recipes.map((recipe) => recipe.data);
//     // const favoriteRecipesP = await utils.getPrevInfo(recipes);

//     res.send(splited);
//   } catch (error) {
//     next(error);
//   }
// });

router.put("/favoriteRecipes", async (req, res, next) => {
  try {
    let newRecipe = req.body.id;
    let lastRecipes = await DButils.execQuery(
      `SELECT favorite_recipes FROM dbo.users WHERE user_id = '${req.user_id}'`
    );
    let newFavorites;
    if (lastRecipes[0].favorite_recipes != "")
      newFavorites = newRecipe + "," + lastRecipes[0].favorite_recipes;
    else newFavorites = newRecipe;

    await DButils.execQuery(
      `UPDATE dbo.users Set favorite_recipes =CAST('${newFavorites}' AS varchar) WHERE user_id = '${req.user_id}'`
    );
    res.send({ sucess: true });
  } catch (error) {
    next(error);
  }
});

router.get("/watchedRecipes", async (req, res, next) => {
  try {
    const arr = await DButils.execQuery(
      `SELECT watched_recipes FROM dbo.users where user_id = '${req.user_id}'`
    );
    let splited = arr[0];
    splited = Object.values(splited);
    splited = splited[0].split(",");
    if (splited.lenght > 1) splited.pop();
    splited = [...new Set(splited)];
    splited = splited.filter((x) => x != '0');

    splited = splited.slice(0, 3);
    let recipes = await Promise.all(
      splited.map((recipe_raw) => {
        return utils.getRecipeInfo(parseInt(recipe_raw, 10));
      })
    );

    recipes = recipes.map((recipe) => recipe.data);
    const watchedRecipesP = await utils.getPrevInfo(recipes);

    res.send(watchedRecipesP);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
