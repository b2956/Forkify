import { elements } from "./base";
import fracty from 'fracty';
const translate = require('google-translate-api');


/*
const formatCount = count => {
    if (count) {
        // count = 2.5 --> 5/2 --> 2 1/2
        // count = 0.5 --> 1/2
        //const newCount = Math.round(count * 10000) / 10000;
        const [int, dec] = newCount.toString().split('.').map(el => parseInt(el, 10));

        if (!dec) return count;

        if (int === 0) {
            const fr = new Fraction(count);
            return `${fr.numerator}/${fr.denominator}`;
        } else {
            const fr = new Fraction(count - int);
            return `${int} ${fr.numerator}/${fr.denominator}`;
        }
    }
    return '?';
};
*/



const formatCount = count => {
    
    if (count) {
      return `${fracty(count)}`;
    }
    return '?';
};
  
export const clearRecipe = () => {
    elements.recipe.innerHTML = "";
} 

const createIngredient = (ingredient) => `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
`;

export const renderRecipe = (recipe, isLiked) => {

    recipe.title = translateText(recipe.title);

    recipe.ingredients = recipe.ingredients.map(cur => {
        translateText(cur, pt - br)
    });
    

    const markup = `
        <figure class="recipe__fig">
            <img src="${recipe.img}" alt="${recipe.title}"class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
        </figure>
        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-datarecipe__info-data--minutes">${recipe.time}</span> 
                <span class="recipe__info-text">minutes<span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-man"><use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">
                    ${recipe.servings} servings
                </span>
                <span class="recipe__info-text">  
                <div class="recipe__info-buttons">

                <button class="btn-tiny btn-decrease">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-minus"><use>
                    </svg>
                </button>
                <button class="btn-tiny btn-increase">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-plus"><use>
                    </svg>
                </button>
            </div>
                <span>
                
            </div>
            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
                </svg>
            </button>
        </div>
        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map(cur => createIngredient(cur)).join('')}
            </ul>
            <button class="btn-small recipe__btn recipe__btn--add">
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>
        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed andtested by
                <span class="recipe__by">${recipe.author}<span>. Please check out directions at theirwebsite.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>
            </a>
        </div>
    `;

    elements.recipe.insertAdjacentHTML('afterbegin', markup);


};

export const updateServingsIngredients = recipe => {

    // Update servings
    
    document.querySelector('.recipe__info-data').textContent = `${recipe.servings} servings`;

    // Update ingredients

    document.querySelectorAll('.recipe__count').forEach((cur, i) => cur.textContent = formatCount(recipe.ingredients[i].count));
    
};