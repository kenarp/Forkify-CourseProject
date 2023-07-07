import { API_URL, RES_PER_PAGE, API_KEY } from "./config";
import { getJSON, postJSON } from "./helpers";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    bookmarked: checkBookmark(recipe.id),
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`); // "https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcc40"
    // console.log(data);
    state.recipe = createRecipeObject(data);
    // console.log(state.recipe);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);
    // console.log(data);
    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //9;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity / state.recipe.servings) * newServings;
  });

  state.recipe.servings = newServings;
};

export const updateBookmark = function (recipe) {
  const thisBookmarkIndex = state.bookmarks.findIndex(
    (bookmark) => bookmark.id === recipe.id
  );
  if (thisBookmarkIndex === -1) {
    state.bookmarks.push(recipe); //Add a new bookmark
    state.recipe.bookmarked = true; //Mark current recipe as bookmarked
  } else {
    state.bookmarks.splice(thisBookmarkIndex, 1); //Remove existing bookmark
    state.recipe.bookmarked = false;
  }

  persistBookmarks();
};

export const checkBookmark = function (recipeID) {
  const hasBookmark =
    state.bookmarks.findIndex((bookmark) => bookmark.id === recipeID) === -1
      ? false
      : true;
  return hasBookmark;
};

const persistBookmarks = function (params) {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
};

init();

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};
// clearBookmarks()

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe) //Object to arrays
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        // const ingArr = ing[1].replaceAll(" ", "").split(",");
        const ingArr = ing[1].split(",").map((ing) => ing.trim());
        if (ingArr.length !== 3) throw new Error("Wrong ingredient format!");
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // console.log(ingredients);
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients: ingredients,
    };
    // console.log(recipe);
    const data = await postJSON(`${API_URL}?key=${API_KEY}`, recipe);
    console.log(data);
    state.recipe = createRecipeObject(data);
    updateBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
