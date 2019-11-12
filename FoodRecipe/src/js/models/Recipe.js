import axios from 'axios';
import { proxy, key } from '../config';

export default class Recipe { // defualt would export only single data structure, whereas named export would export any number of data
    constructor(id) {
        this.id = id;
    }

    // Method to get the search results
    async getRecipe() {
        try {
            const res = // await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
                        await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);     
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }
        catch(error) {
            alert(error);
        }
    }

    calcTime() {
        // Assuming that each 3 ingredients take 15 minutes
        const numINg = this.ingredients.length;
        const periods = Math.ceil(numINg / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'taespoons', 'taespoon', 'cups', 'pounds']; // Original Units
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound']; // Units we want
        const units = [...unitsShort, 'kg', 'g'];   // ...unitsShort copies all the array contents to units

        const newIngredients = this.ingredients.map(el => {
            // 1.) UNiform Units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2.) Remove Paranthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ')


            // 3.) Parse Ingredients into count, unit and ingredient  (By far most complex one)
            const arrIng = ingredient.split(' ');   // splitting ingredient into words and saving them to arrIng array
            // const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));      // we can find the array of the unknown itel we are searching in the array
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                // There is a unit

                //For Ex: 4 1/2 cups....., then arrCount is [4, 1/2]
                //For Ex: 4 cups....., then arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if(arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));   // Ex:  4 --> eval(4) = 4
                                                                 // Ex: 4-1/4 --> 4+1/4 --> eval(4+1/4) = 4.25
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));   // Ex:  4 1/2...  --> 4+1/2 --> eval(4+1/2) = 4.5
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ') // This will give entire array starting after units' position and joined as single string
                }

            } else if (parseInt(arrIng[0], 10)) {       // Checks the 1st position of the array
                //There is NO unit, but first element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ') // ingredient is entire array except 1st position and put back the array contents as single string
                }
            } else if(unitIndex === -1) {
                //There is NO unit and NO number in the 1st postion
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient    // This is equivalent to ingredient: ingredient
                }
            }

            return objIng; //ingredient;
        });
        this.ingredients = newIngredients;

    }

    updateServings(type) { // type determine increase or decrease

        //Update Servings
        const newServings = (type === 'dec') ? this.servings - 1 : this.servings + 1;

        //Update Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings); // update count w.r.to the new servings and the old servings 
        });

        this.servings = newServings;
    }
    
}
