import { elements } from './base';      // here { elements } name should be same as it is in base.js if we import named exports

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';  // innerHTML will delete all the html content inside (that is in <li> here)
    elements.searchResPages.innerHTML = ''; // it will clear the previous buttons on the page
};

export const highlightSelected = id => {

    // below code removes highlight from all the elements so that the last line of code makes sure that only one element is active at any time
    const resultsArr = Array.from(document.querySelectorAll('.results__link'))
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
};

// The below function would limit the number of words of a title to single line
/*DEMO:  input string  'Pasta with tomato and spinach'
acc: 0/ acc + cur.length = 5/ newTitle = ['pasta']
acc: 5/ acc + cur.length = 9/ newTitle = ['pasta', 'with']
acc: 9/ acc + cur.length = 15/ newTitle = ['pasta', 'with', 'tomato']
acc: 15/ acc + cur.length = 18/ newTitle = ['pasta', 'with', 'tomato']
acc: 18/ acc + cur.length = 24/ newTitle = ['pasta', 'with', 'tomato']
*/
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > 17) {
        title.split(' ').reduce((acc, cur) => {  // it will check the length of item word by word through accumulator, 
                                            // If the lengh of new word of item exceeds 17 then it wouldn't be displayed
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;

        }, 0);

        // return the result
        return `${newTitle.join(' ')} ...`;    // join() is exact opposite of split() method, here it adds elements of array to single string
                                                // We will add ... at end if the item is more than 17(limit)
    }
    return title;
};

const renderRecipe = recipe => { 
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// Here type can be 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
    `;

const renderButtons = (page, numResults, resPerpage) => {
    const pages = Math.ceil(numResults / resPerpage);

    let button;       // we are using let since we gonna change the variable contents, which we can't using const
    if(page === 1 && pages > 1) {
        // Only button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Both prev and next buttons
        button = `
        ${createButton(page, 'next')}
        ${createButton(page, 'prev')}
        `;
    } else if (page === pages && pages > 1) {
        // Only button to go to prev page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML( 'afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {

    // render results of current page
    const start = (page - 1) * resPerPage;    //0;
    const end = (page * resPerPage);      //10;

   // recipes.forEach(renderRecipe);
   recipes.slice(start, end).forEach(renderRecipe);    // Instead of printing all elements of array, 
                                       // we are just printing part of the array using slice() method
    
    // render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};