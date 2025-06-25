import RecipeStorage from '../services/recipeStorage.js';

addEventListener("DOMContentLoaded", async () => {
    const recipeStorage = new RecipeStorage();
    const ingredientContent = document.getElementById('ingredient-content');
    
    // Get ingredient name from URL
    const urlParams = new URLSearchParams(window.location.search);
    const ingredientName = urlParams.get('name');

    if (!ingredientName) {
        ingredientContent.textContent = 'Ingredient not found';
        return;
    }

    try {
        const ingredients = await recipeStorage.getIngredientNames();
        if (!ingredients.includes(ingredientName)) {
            ingredientContent.textContent = 'Ingredient not found';
            return;
        }

        // Clear content
        ingredientContent.innerHTML = '';

        // Create and append title
        const titleEl = document.createElement('h1');
        titleEl.textContent = ingredientName;
        ingredientContent.appendChild(titleEl);

        // Create and append remove button
        const removeBtn = document.createElement('button');
        removeBtn.id = 'remove-ingredient-btn';
        removeBtn.className = 'btn btn-secondary remove-btn remove-btn-top';
        removeBtn.textContent = 'Remove Ingredient';
        removeBtn.addEventListener('click', async () => {
            if (confirm(`Are you sure you want to remove the ingredient "${ingredientName}"?`)) {
                try {
                    await recipeStorage.removeIngredient(ingredientName);
                    window.location.href = 'ingredients.html';
                } catch (error) {
                    alert('Failed to remove ingredient.');
                }
            }
        });
        ingredientContent.appendChild(removeBtn);
    } catch (error) {
        console.error('Error loading ingredient:', error);
        ingredientContent.textContent = 'Error loading ingredient';
    }
}); 