// A class whose responsibility is to manage the database connection and provide a simple interface for interacting with the database
// The database is IndexedDB
// It should be able to:
// - Connect to the database
// - Store a recipe

export default class DB {
    constructor() {
        this.db = null;
    }

    async connect(onsuccess) {
        const request = await indexedDB.open("recipem8", 1);
        request.onerror = (event) => {
            console.error("Error opening database", event);
        };
        request.onsuccess = (event) => {
            this.db = event.target.result;
            onsuccess();
        };
        request.onupgradeneeded = (event) => {
            this.db = event.target.result;

            if (!this.db.objectStoreNames.contains("recipes")) {
                const recipe_store = this.db.createObjectStore("recipes", { keyPath: "title" });
                if (!recipe_store.indexNames.contains("title")) {
                    recipe_store.createIndex("title", "title", { unique: true });
                };
            };
        };
    }

    storeRecipe(recipe_title) {
        const transaction = this.db.transaction("recipes", "readwrite");
        const store = transaction.objectStore("recipes");
        return store.add({ title: recipe_title });
    }

    getRecipes() {
        const transaction = this.db.transaction("recipes", "readonly");
        const store = transaction.objectStore("recipes");
        return store.getAll();
    }
}