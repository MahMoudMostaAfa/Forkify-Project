import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
import { Ajax } from './helpers';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
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
    // important trick
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await Ajax(`${API_URL}/${id}?key=${KEY}`);
    // throw error
    // edit recipe to avoid unusal varible decleration like x_1
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookMarked = true;
    else state.recipe.bookMarked = false;
  } catch (err) {
    // alert(err);
    throw err;
  }
};
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await Ajax(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
    //console.log(state.search.results);
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};
export const updateServing = function (newServing) {
  state.recipe.ingredients.forEach(el => {
    el.quantity = (el.quantity * newServing) / state.recipe.servings;
  });
  state.recipe.servings = newServing;
};
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmarks = function (recipe) {
  // add recipe to bookmarks
  state.bookmarks.push(recipe);
  // show bookmark icon
  if (recipe.id === state.recipe.id) state.recipe.bookMarked = true;

  persistBookmarks();
};
export const deleteBookmarks = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  // show removed bookmark icon
  if (id == state.recipe.id) state.recipe.bookMarked = false;
  persistBookmarks();
};
const int = function () {
  const storage = localStorage.getItem('bookmarks');
  //console.log(JSON.parse(storage));
  if (storage) state.bookmarks = JSON.parse(storage);
  console.log('hello');
};
//console.log(state.bookmarks);
const clearLocalStorage = function () {
  localStorage.clear('bookmarks');
};
export const uploadRecipe = async function (newRecipe) {
  try {
    //1- prepare recipe and fillter it
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) throw new Error('wrong ingredient format');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // 2- prepare recipe object
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await Ajax(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmarks(state.recipe);
  } catch (err) {
    throw err;
  }
};

int();

//clearLocalStorage();
