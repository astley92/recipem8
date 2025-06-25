class RecipeStorage {
    constructor() {
        this.db = null;
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("recipem8", 2);

            request.onerror = () => {
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("recipes")) {
                    db.createObjectStore("recipes", { keyPath: "name" });
                }
                if (!db.objectStoreNames.contains("ingredients")) {
                    db.createObjectStore("ingredients", { keyPath: "name" });
                }
                if (!db.objectStoreNames.contains("sync")) {
                    db.createObjectStore("sync", { keyPath: "id" });
                }
            };
        });
    }

    async storeRecipeNames(recipeNames) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction("recipes", "readwrite");
            const store = transaction.objectStore("recipes");

            // Clear existing recipes
            store.clear();

            // Store new recipe names
            recipeNames.forEach(name => {
                store.add({ name });
            });

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    async storeIngredientNames(ingredientNames) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction("ingredients", "readwrite");
            const store = transaction.objectStore("ingredients");

            // Clear existing ingredients
            store.clear();

            // Store new ingredient names
            ingredientNames.forEach(name => {
                store.add({ name });
            });

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    async storeLastSyncTime() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction("sync", "readwrite");
            const store = transaction.objectStore("sync");
            const request = store.put({ id: "lastSync", timestamp: Date.now() });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getRecipeNames() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction("recipes", "readonly");
            const store = transaction.objectStore("recipes");
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result.map(recipe => recipe.name));
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getIngredientNames() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction("ingredients", "readonly");
            const store = transaction.objectStore("ingredients");
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result.map(ingredient => ingredient.name));
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getLastSyncTime() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction("sync", "readonly");
            const store = transaction.objectStore("sync");
            const request = store.get("lastSync");

            request.onsuccess = () => {
                resolve(request.result?.timestamp || 0);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async needsSync() {
        const lastSync = await this.getLastSyncTime();
        const oneDayInMs = 24 * 60 * 60 * 1000;
        return Date.now() - lastSync > oneDayInMs;
    }

    async removeRecipe(name) {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction("recipes", "readwrite");
            const store = transaction.objectStore("recipes");
            const request = store.delete(name);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

export default RecipeStorage; 