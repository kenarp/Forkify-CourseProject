import "core-js/stable";
import "regenerator-runtime/runtime";
import searchView from "./views/SearchView.js";
import resultsView from "./views/ResultsView.js";
import paginationView from "./views/PaginationView.js";
import addRecipeView from "./views/addRecipeView.js";
////
import * as model from "./model.js";
import recipeView from "./views/RecipeView.js";
import paginationView from "./views/PaginationView.js";
import bookMarksView from "./views/BookMarksView.js";
import { MODAL_CLOSE_SEC } from "./config.js";

if (module.hot) {
  module.hot.accept();
}
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return;
    recipeView.renderSpinner();
    //0)Update results view and Bookmark List to mark selected recipe
    resultsView.update(model.getSearchResultsPage());
    bookMarksView.render(model.state.bookmarks);
    //1)Loading Recipe
    await model.loadRecipe(id);
    //2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
    // console.log(error);
  }
};

const controlSearchResults = async function (params) {
  try {
    resultsView.renderSpinner();
    //1) get search query
    const query = searchView.getQuery();
    if (!query) throw new Error("Please enter a food name");

    //2) Load search results
    await model.loadSearchResults(query);
    //3)render results
    // resultsView.render(model.getSearchResultsPage());
    //4)render pagination
    controlPagination();
    // paginationView.render(resultsLength); //First Page
  } catch (error) {
    resultsView.renderError(error.message);
  }
};

const controlPagination = function (currPage = 1) {
  // model.state.search.page = currPage;
  paginationView.setPage(currPage);
  paginationView.render(model.state.search.results.length); //Any page
  resultsView.render(model.getSearchResultsPage(currPage));
};

const controlServings = function (newServings) {
  // Update the recipe servings(in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
  //Less flicker compared to recipeView.render(model.state.recipe) which refresh the whole view;
};

const controlBookmark = function () {
  // Update the bookmark(in state)
  model.updateBookmark(model.state.recipe);
  // Update the recipe view
  recipeView.update(model.state.recipe);
  // Render Bookmark List
  bookMarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);
    //Render bookmark view
    bookMarksView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    //Success message
    addRecipeView.renderMessage();
    // Close form window
    setTimeout(function (params) {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes); // equals to: window.addEventListener("hashchange", controlRecipes);
  recipeView.addHandlerUpdateServ(controlServings);
  recipeView.addHandlerBookmark(controlBookmark); //Add bookmark control handler
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination); //Add pagination control handler
  addRecipeView.addHandlerUpload(controlAddRecipe); //Add upload recipe control handler
};
init();
