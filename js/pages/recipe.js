import RecipeStorage from '../services/recipeStorage.js';

addEventListener("DOMContentLoaded", async () => {
    const recipeStorage = new RecipeStorage();
    const recipeContent = document.getElementById('recipe-content');
    
    // Get recipe name from URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeName = urlParams.get('name');

    if (!recipeName) {
        recipeContent.textContent = 'Recipe not found';
        return;
    }

    try {
        const recipes = await recipeStorage.getRecipeNames();
        if (!recipes.includes(recipeName)) {
            recipeContent.textContent = 'Recipe not found';
            return;
        }

        // Clear content
        recipeContent.innerHTML = '';

        // Create and append title
        const titleEl = document.createElement('h1');
        titleEl.textContent = recipeName;
        recipeContent.appendChild(titleEl);

        // Create and append remove button
        const removeBtn = document.createElement('button');
        removeBtn.id = 'remove-recipe-btn';
        removeBtn.className = 'btn btn-secondary remove-btn remove-btn-top';
        removeBtn.textContent = 'Remove Recipe';
        removeBtn.addEventListener('click', async () => {
            if (confirm(`Are you sure you want to remove the recipe "${recipeName}"?`)) {
                try {
                    await recipeStorage.removeRecipe(recipeName);
                    window.location.href = '../index.html';
                } catch (error) {
                    alert('Failed to remove recipe.');
                }
            }
        });
        recipeContent.appendChild(removeBtn);
    } catch (error) {
        console.error('Error loading recipe:', error);
        recipeContent.textContent = 'Error loading recipe';
    }
}); 