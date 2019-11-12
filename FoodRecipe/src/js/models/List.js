import uniqid from 'uniqid';    // this external package helps in creating unique IDs for the list items

export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,  // equivivalent to count: count in ES6
            unit,
            ingredient
        }

        this.items.push(item);
        return item;
    }

    deleteItem (id) {
        const index = this.items.findIndex(el => el.id === id);  // Find index of the id we passed

        // Ex1: [2, 4, 8, 16] then splice(1, 2) --> return [4, 8], original array is [2, 16], splice() would mutate orinal array and second parameter in spilce(1st, 2nd) is the how many elements we take
        // Ex1: [2, 4, 8, 16] then slice(1, 2) --> return 4, but the original array is [2, 4, 8, 16], slice() wont mutate original array and second parameter in spilce(1st, 2nd) is the end index
        // Ex2: [2, 4, 8, 16] then splice(1, 3) --> return [4, 8, 16], but the original array is [2]
        // Ex2: [2, 4, 8, 16] then slice(1, 3) --> return [4, 8], but the original array is [2, 4, 8, 16]
        this.items.splice(index, 1); // delete the item which have id we passed and delete it using the index value
    }

    updateCount(id, newCount) { // we are updating only count but not the unit and ingredient
        this.items.find(el => el.id === id).count = newCount;     // this will find the item with the given id and update the count by using the cound property
    }
}