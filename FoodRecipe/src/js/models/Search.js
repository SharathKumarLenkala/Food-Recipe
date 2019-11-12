import axios from 'axios';
import { proxy, key } from '../config';

export default class Search { // defualt would export only single data structure, whereas named export would export any number of data
    constructor(query) {
        this.query = query;
    }

    // Method to get the search results
    async getResults() {
        try {
            const res = // await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
                                            await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);     
            this.result = res.data.recipes;
        }
        catch(error) {
            alert(error);
        }
    }
    
}
