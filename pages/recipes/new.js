import DB from "../../services/db.js";

class RecipeData {
    constructor() {
        this.titles = [];
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const db = new DB();
    var recipe_data = new RecipeData();
    
    await db.connect(async () => {
        const request = await db.getRecipes();
        request.onsuccess = (event) => {
            recipe_data.titles = event.target.result.map(recipe => recipe.title);
        };
    });

    const form = document.querySelector("form");
    const nameInput = document.querySelector("input[name='name']");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        if (!nameInput.validity.valid) {
            nameInput.reportValidity();
            return;
        }

        // Name should be stored as a slug with lowercase letters and spaces replaced with hyphens
        const name = nameInput.value.toLowerCase().replace(/ /g, "-");
        if (!recipe_data.titles.includes(name)) {
            const store_request = db.storeRecipe(name);
            store_request.onsuccess = () => {
                recipe_data.titles.push(name);
                form.reset();
            };
            store_request.onerror = (event) => {
                console.error("Error storing recipe", event);
            };
        } else {
            console.log("Recipe already exists");
        };
    });
});
