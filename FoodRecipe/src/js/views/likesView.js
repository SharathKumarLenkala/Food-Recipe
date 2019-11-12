import { elements } from './base';
import { limitRecipeTitle } from './searchView'; // we are using this to show the limited recipe title in the likes list

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
    // setAttribute() method is used to change the attributes
};

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden'; 
        // if we dont have likes then the likes field should not be shown otherwise it should be visible
};

export const renderLike = like => {
    const markup = `
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="${like.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    `;

    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
        // The above code will select the parent of all the ids which are in likes__link by using Redular Expressions

    if (el) el.parentElement.removeChild(el);
};