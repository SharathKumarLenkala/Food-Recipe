// Global app controller

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';      // here { elements } name should be same as it is in base.js if we import named exports


/* Global state of the app
    - Search Object
    - Current Recipe Object
    - Shopping List Object
    - Liked Recipes
*/
const state = {};

        // // For TESTING purpose
        // window.state = state;

/* 
* SEARCH CONTROLLER 
*/
const controlSearch = async () => {
    // 1.) Get query from view
    const query = searchView.getInput();                   // getting query from the UI search bar
    
                // For TESTING
                // const query = 'pizza';

    if(query) {
        // 2.) New Search object andadd to state
        state.search = new Search(query);
        

        // 3.) Prepare UI for results
        searchView.clearInput();           // Clear the text in the search bar for recipes
        searchView.clearResults();          // Clear the results of the previous list(by deleting entire inner html element)
        renderLoader(elements.searchRes);

        try {
            // 4.) Search for results
            await state.search.getResults();
            

            // 5.) Render results on UI
            // console.log(state.search.result);
            clearLoader(); // Clear Loader icon before displying the items of search result
            searchView.renderResults(state.search.result);
        }
        catch (err) {
            alert('Something wrong with the Search');
            clearLoader();       // we still want this even when there is error in search
        }
        
        
    }
}


elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

                // // FOR TESTING
                // window.addEventListener('load', e => {
                //     e.preventDefault();
                //     controlSearch();
                // });



elements.searchResPages.addEventListener('click', e => {   // using event delegation (if we dont have any pagination when the page is loaded)
    
    const btn = e.target.closest('.btn-inline'); // closest method accept the button presses of from its ancestors
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);      // ew can access data in the inline html code using the data attribute 
                                                // as in the case of createButton class in searchView.js
                                                // and 10 is the base of the number, for decimal it is 10
        searchView.clearResults(); 
        searchView.renderResults(state.search.result, goToPage);    // we are displaying results upon clickint next or prev page button
        
    }
    
});





/* 
* RECIPE CONTROLLER 
*/

const controlRecipe = async () => {

    // Get ID from URL
    const id = window.location.hash.replace('#', '');   
    // window.location give the entire URL and the window.location.hash give the hash part of the URL and 
      // replace('#', '') would replace the # in thehash part with the null string so that we get only the id
    console.log(id);

    if(id) {
        // Prepare the UI for changes
        recipeView.clearRecipe();  // clear recipe before displaying new recipe
        renderLoader(elements.recipe); // we call this before "Render the Recipe" step below

        // Highlight SELECTED search item
        if (state.search) {
            searchView.highlightSelected(id);   // highlight if there is search present    
        }

        // Create new Recipe object
        state.recipe = new Recipe(id);

                    // // For TESTING we are exposing the state recipe to the window
                    // window.r = state.recipe;
        try {
            // Get Recipe Data and Parse Ingredients
            await state.recipe.getRecipe();      // we are using await since we are getting the recipe asynchronously
                                    //  as with the case of writing async at the callback funciton defination
            state.recipe.parseIngredients();  // parse the ingredients

            // Calculate Servings and Time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render the Recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        }
        catch(error) {
            alert('Error Processing recipe!');
        }
        
        
    }
    
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);       // This will load the recipe with the id on the page when the page loaded

// Alternate Code for the above two lines is:
['hashchange', 'load'].forEach(event => window.addEventListener( event, controlRecipe ));


/* 
* LIST CONTROLLER 
*/
const controlList = () => {
    // Create a List if there is None
    if (!state.list) {
        state.list = new List();
    }

    // Add Each ingredient to the List and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient); // This will add item to the List
        console.log(item);
        
        listView.renderItem(item);   // This will add item to the UI

    });
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid; // closest() will handle the clicks closest to shopping__item class


    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // matches() method the clicks which are precise(the click can be recorded when we click on this class or its child elements)
        
        
        // Delete from state
        state.list.deleteItem(id);

        // Delete from the UI
        listView.deleteItem(id);

    // Handle the count update
    } else if(e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value); // read value from the input upon clicking the target element
        state.list.updateCount(id, val)
    } 
    
});

/* 
* LIKES CONTROLLER 
*/

            // // For TESTING (so that we dont get error that states.likes is not defined while loading) 
            // state.likes = new Likes();
            // likesView.toggleLikeMenu(state.likes.getNumLikes()); // when the page loaded, likes_field should be shown according to the num of likes
 

const controlLike = () => {
    if (!state.likes) {
        state.likes = new Likes();
    }
    const currentID = state.recipe.id;

    // User has NOT yet LIKED the current recipe
    if(!state.likes.isLiked(currentID)) {
        // Add the like to the state
        const newLike = state.likes.addLike(
            currentID, 
            state.recipe.title, 
            state.recipe.author,
            state.recipe.img
        );

        // Toggle the like button
        likesView.toggleLikeBtn(true);      // we are passing true because we are clicking on the like button above

        // Add the like to UI list
        likesView.renderLike(newLike);
        // console.log(state.likes); 
        


    // User HAS LIKED the current recipe
    } else {
        // Remove the like to the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);     // we are passing false because we are removing like by clicking on like button above

        // Remove the like to UI list
        likesView.deleteLike(currentID);
          //   console.log(state.likes);
        
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};
    

// Restore like reipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle the like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes()); // when the page loaded, likes_field should be shown according to the num of likes

    // Render the existing likes      (using two state.likes.likes gives an array)
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


// Handling the recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *'))  {    // .mctches is the another way of event delegation and 
                                // * gives information about the child element of selector btn-decrease
    // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }    
    
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {   // This is related to add to shopping button on recipe page
        // Add Ingredients to the Shopping LIst
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {          // This is related to Likes button on recipe page
        // Like Controller
        controlLike();

    }
});


            // // For TESTING
            // window.l = new List();
