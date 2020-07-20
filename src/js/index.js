// Global app controller

/*
import string from './models/Search';

// import { add as a, multiply as m, ID } from './views/searchView';

// import { add as a, multiply as m, ID } from './views/searchView'; // changing variable names

import * as searchView from './views/searchView';

console.log(string);

// console.log(`Using imported functions! ${add(ID, 2)} and ${multiply(3, 5)}. ${string}`);

// console.log(`Using imported functions! ${a(ID, 2)} and ${m(3, 5)}. ${string}`);

console.log(`Using imported functions! ${searchView.add(searchView.ID, 2)} and ${searchView.multiply(3, 5)}. ${string}`);
*/
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';
import { renderRecipe, clearRecipe, updateServingsIngredients } from './views/recipeView';






/*

    ******* Global State of the app *********

    * - Search object
    * - Current recipe object
    * - Shopping list object
    * - Liked recipes

*/

const state = {

};

////////////////////////////////////////////////////////////

//////////////////// SEARCH CONTROLLER /////////////////////

////////////////////////////////////////////////////////////

const ctrlSearch = async ()  => {
    // 1) get input query from view
    const query = searchView.getInput();
    // const query = 'pizza'; (testing)

    if (query) {
        // 2) new search object and add to State
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);

        try {
            // 4) Search for recipes
            await state.search.getResults();

            // 5)Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch (err) {
            clearLoader();
            alert('Something went wrong with the search!');
        }        
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    ctrlSearch();
});

/*
testing
window.addEventListener('load', e => {
    e.preventDefault();
    ctrlSearch();
});
*/
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }


});


////////////////////////////////////////////////////////////

//////////////////// RECIPE CONTROLLER /////////////////////

////////////////////////////////////////////////////////////

const controlRecipe = async () => {
    // Get ID from Url
    const id = window.location.hash.replace('#', '');

    // console.log(id);

    if (id) {
        // Prepare UI for changes

        await clearRecipe();

        renderLoader(elements.recipe);

        // Highlight selected recipe
        if (state.search) {
            searchView.highlightSelected(id);
        }

        // create new recipe Object

        state.recipe = new Recipe(id);

        // Testing 
        // window.r = state.recipe;

        try {
            // Get recipe data and parse ingredients

            await state.recipe.getRecipe();

            state.recipe.parseIngredients();

            // Calculate servings and time

            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            if (state.likes) {
                renderRecipe(
                    state.recipe,
                    state.likes.isLiked(id)
                );
            } else {
                renderRecipe(
                    state.recipe,
                    false
                );
            }
            
            
        } catch (err) {
            clearLoader();
            alert('Error processing recipe!');
            
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)); 

// Handling recipe button clicks

elements.recipe.addEventListener('click', async e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            updateServingsIngredients(state.recipe);
        }
        
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controler

        controlLike();
    }
});

////////////////////////////////////////////////////////////

//////////////////// LIST CONTROLLER /////////////////////

////////////////////////////////////////////////////////////

const controlList = () => {
    // create a new list if there is none yet

    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI

    state.recipe.ingredients.forEach(cur => {
        const item = state.list.addItem(cur.count, cur.unit, cur.ingredient);

        listView.renderItem(item);

    });

};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

// Handle delete and update list

elements.itemList.addEventListener('click', e => {

    // get ID
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // handle delete event

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state

        state.list.deleteItem(id);

        // delete from ui

        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);

        state.list.updateCount(id, val);
    }

});

////////////////////////////////////////////////////////////

//////////////////// LIKES CONTROLLER /////////////////////

////////////////////////////////////////////////////////////

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();

    const currentId = state.recipe.id;

    if (!state.likes.isLiked(currentId)) {
        
        //recipe is NOT liked yet. add like to state
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // toggle like button

        likesView.toggleLikeBtn(true);

        // add like to UI list
        likesView.renderLike(newLike);


    } else {

        // recipe is already liked, remove like from state
        state.likes.deleteLike(currentId);

        // toggle like button

        likesView.toggleLikeBtn(false);

        // delete like from UI list
        likesView.deleteLike(currentId);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// window.state = state;


window.addEventListener('load', () => {
    state.likes = new Likes;

    state.likes.readStorage();

    likesView.toggleLikeMenu(state.likes.getNumLikes());

    state.likes.likes.forEach(like => likesView.renderLike(like));
});
