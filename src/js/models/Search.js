import axios from 'axios'; // converts json automatically

// import {key, proxy} from "../config"

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);

            this.result = res.data.recipes;
    
            // console.log(res);
            // console.log(this.result);
        } catch (error) {
            alert(error);
        }
    
    }
}



/*
async function getResults(query) {
    const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`)
    const recipes = res.data.recipes;

    console.log(result);

};
*/

// getResults('salad');