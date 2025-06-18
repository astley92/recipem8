import RecipeStorage from '../services/recipeStorage.js';

addEventListener("DOMContentLoaded", async () => {
    const recipeStorage = new RecipeStorage();
    const ingredientContent = document.getElementById('ingredient-content');
    
    // Get ingredient name from URL
    const urlParams = new URLSearchParams(window.location.search);
    const ingredientName = urlParams.get('name');

    if (!ingredientName) {
        ingredientContent.innerHTML = '<h1>Ingredient not found</h1>';
        return;
    }

    try {
        const ingredients = await recipeStorage.getIngredientNames();
        if (!ingredients.includes(ingredientName)) {
            ingredientContent.innerHTML = '<h1>Ingredient not found</h1>';
            return;
        }

        // Display ingredient name
        ingredientContent.innerHTML = `<h1>${ingredientName}</h1>`;
    } catch (error) {
        console.error('Error loading ingredient:', error);
        ingredientContent.innerHTML = '<h1>Error loading ingredient</h1>';
    }
}); 