export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike (id, title, author, img) {
        const like = {
            id,
            title,
            author,
            img
        }

        this.likes.push(like);

        // Persist Data in localStarage (which helps in retrieving data when we reload the webpage)
        this.persistData();

        return like;
    }

    deleteLike (id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1); 


        // Persist Data in localStarage (which helps in retrieving data when we reload the webpage)
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
            // Here,  this.likes.findIndex(el => el.id === id) === -1 if it is not liked already, it is number otherwise.
    }

    getNumLikes() {     // returns number of likes
        return this.likes.length;
    }

    persistData() {        // This helps in retrieving data when we reload the webpage
        localStorage.setItem('likes', JSON.stringify(this.likes)); // localStorage.setItem sets the data in key, value pairs
               // JSON.stringify() method would convert the entire array(here it is likes string) into a string
    }


    // Method that is used to read the localStorage data (here it is likes) so that we can display them on UI when we reload the page
    readStorage() {
        //JSON.parse() converts the string back to data structures before converting back to JSON string(here the likes is array)   
        const storage = JSON.parse(localStorage.getItem('likes'));     
        
        // Restoring likes from the localStorage
        if(storage) { // Checks if we have data in storage because if we dont have any data it would return null
            this.likes = storage;
        }

    }
}