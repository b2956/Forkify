// import { key, proxy } from "../config";
import axios from "axios";

const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);

      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      alert(`Something went wrong: ${error}`);
    }
  }

  calcTime() {
    // assuming every 3 ingredients take an average of 15 minutes
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "cup",
      "pounds",
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "cup",
      "pound",
    ];
    const units = [...unitsShort, "kg", "g"];

    const newIngredients = this.ingredients.map((cur) => {
      // Uniform units
      let objIng;
      let ingredient = cur.toLowerCase();

      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      if (ingredient.indexOf(" ") === 0) {
        ingredient = ingredient.replace(ingredient[0], "");
      }

      // 2 Remove parenthesis

      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      //console.log(ingredient);

      // Parse ingredients into count, unit and ingredient

      let arrIng = ingredient.replace("/", " ").replace("-", " ").split(" ");
      const unitIndex = arrIng.findIndex((el) => units.includes(el));
      let count;

      // console.log(arrIng);

      if (unitIndex > -1) {
        if (unitIndex === 0) {
          count = 1;
        } else if (unitIndex === 1) {
          count = parseInt(arrIng[0]);
        } else if (unitIndex === 2) {
          count = parseInt(arrIng[0]) / parseInt(arrIng[1]);
        } else if (unitIndex === 3) {
          count =
            parseInt(arrIng[0]) + parseInt(arrIng[1]) / parseInt(arrIng[2]);
        }

        objIng = {
          count: count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" "),
        };
      } else if (unitIndex === -1) {
        if (parseInt(arrIng[0], 10)) {
          if (parseInt(arrIng[2], 10)) {
            count =
              parseInt(arrIng[0]) + parseInt(arrIng[1]) / parseInt(arrIng[2]);

            objIng = {
              count: count,
              unit: "",
              ingredient: arrIng.slice(3).join(" "),
            };
          } else if (!parseInt(arrIng[2])) {
            if (!parseInt(arrIng[1])) {
              count = parseInt(arrIng[0]);
              //newIngredient = ;

              objIng = {
                count: count,
                unit: "",
                ingredient: arrIng.slice(1).join(" "),
              };
            } else if (parseInt(arrIng[1])) {
              count = parseInt(arrIng[0]) / parseInt(arrIng[1]);

              objIng = {
                count: count,
                unit: "",
                ingredient: arrIng.slice(2).join(" "),
              };
            }
          }
        } else {
          objIng = {
            count: 1,
            unit: "",
            ingredient: arrIng.join(" "),
          };
        }
      }

      return objIng;
    });

    this.ingredients = newIngredients;
  }

    updateServings(type) {
        
        // Servings     

        const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;    
        
        // Ingredients 
        
        this.ingredients.forEach((ing) => {
          ing.count = ing.count * (newServings / this.servings);
        });     

        this.servings = newServings;
    }
}

/*
export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${proxy}http:food2fork.com/api/    search?key=${key}&q=${this.id}`);
            console.log(res);


        } catch (error) {
          alert(error);
        }
    }
}
*/
