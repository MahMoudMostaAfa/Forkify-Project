// import state model
import { async } from 'regenerator-runtime';
import * as model from './model.js';
// import recipe view
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookMarksView from './views/bookMarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODULE_OUT } from './config.js';
//console.log(resultsView);
// for polyfilling
import 'core-js/stable';
// polyfilling async functions
import 'regenerator-runtime/runtime';
//console.log(icons);
// rerun new icon path of parcel conversion

// https://forkify-api.herokuapp.com/v2
// render spinner
if (module.hot) {
  module.hot.accept();
}
//* show recipe
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // showspinenr
    recipeView.renderSpiner();
    // 0) update recipe to view active recipe
    resultsView.update(model.getSearchResultsPage());
    // update bookmarks panal to show active on
    bookMarksView.update(model.state.bookmarks);
    //1) loading recipe
    // await because loadrecipe return promise as it async function
    await model.loadRecipe(id);
    // 2)render recipe

    recipeView.render(model.state.recipe);
  } catch (err) {
    //alert(err);
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    // 1-spiner and get query form user
    resultsView.renderSpiner();
    const query = searchView.getQuary();
    if (!query) return;
    // 2-load the results
    await model.loadSearchResults(query);

    // 3-render the results
    resultsView.render(model.getSearchResultsPage());
    // 4- render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    alert(err);
  }
};
const controlPagination = function (page) {
  resultsView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.search);
};
const controlServings = function (newServing) {
  // update the recipe serving (in state)
  model.updateServing(newServing);
  // render the  update the recipe
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmarks = function () {
  // 1 add or remove bookmarks
  if (!model.state.recipe.bookMarked) model.addBookmarks(model.state.recipe);
  else model.deleteBookmarks(model.state.recipe.id);
  // 2 update book marks
  recipeView.update(model.state.recipe);
  // 3 show bookmarks panal
  bookMarksView.render(model.state.bookmarks);
  //if (model.state.bookmarks.length === 0) bookMarksView.renderError();
};
const controlBookMarks = function () {
  bookMarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (recipeData) {
  try {
    await model.uploadRecipe(recipeData);
    console.log(model.state.recipe);
    addRecipeView.renderSpiner();
    // render data
    recipeView.render(model.state.recipe);
    // succes message
    addRecipeView.renderSucces();
    // close window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 1000 * MODULE_OUT);
    // render boomarks
    bookMarksView.render(model.state.bookmarks);
    // change url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};
// listen to hash and load the page
const init = function () {
  bookMarksView.addHandlerRender(controlBookMarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUdpateServing(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  (function () {})();
};
init();

///////////////////////////////////////
