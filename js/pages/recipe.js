import RecipeStorage from '../services/recipeStorage.js';

addEventListener("DOMContentLoaded", async () => {
    const recipeStorage = new RecipeStorage();
    const recipeContent = document.getElementById('recipe-content');
    
    // Get recipe name from URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeName = urlParams.get('name');

    if (!recipeName) {
        recipeContent.innerHTML = '<h1>Recipe not found</h1>';
        return;
    }

    try {
        const recipes = await recipeStorage.getRecipeNames();
        if (!recipes.includes(recipeName)) {
            recipeContent.innerHTML = '<h1>Recipe not found</h1>';
            return;
        }

        // Display recipe name
        recipeContent.innerHTML = `<h1>${recipeName}</h1>`;
    } catch (error) {
        console.error('Error loading recipe:', error);
        recipeContent.innerHTML = '<h1>Error loading recipe</h1>';
    }
}); 