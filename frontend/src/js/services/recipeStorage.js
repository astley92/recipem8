class RecipeStorage {
    constructor() {
        this.db = null;
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("recipem8", 1);

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
                if (!db.objectStoreNames.contains("sync")) {
                    db.createObjectStore("sync", { keyPath: "id" });
                }
            };
        });
    }

    async storeRecipeNames(recipeNames) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["recipes", "sync"], "readwrite");
            const recipeStore = transaction.objectStore("recipes");
            const syncStore = transaction.objectStore("sync");

            // Clear existing recipes
            recipeStore.clear();

            // Store new recipe names
            recipeNames.forEach(name => {
                recipeStore.add({ name });
            });

            // Update sync timestamp
            syncStore.put({ id: "lastSync", timestamp: Date.now() });

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
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
}

export default RecipeStorage; 