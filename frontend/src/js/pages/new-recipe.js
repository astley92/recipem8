import RecipeStorage from '../services/recipeStorage.js';

addEventListener("DOMContentLoaded", async () => {
    const recipeStorage = new RecipeStorage();
    const form = document.getElementById('new-recipe-form');
    const titleInput = document.getElementById('recipe-title');
    const titleError = document.getElementById('title-error');
    const submitBtn = document.getElementById('submit-btn');

    // Validation functions
    const validateTitle = (title) => {
        const errors = [];
        
        if (title.length < 3) {
            errors.push('Title must be at least 3 characters long');
        }
        
        if (title.length > 100) {
            errors.push('Title must be no more than 100 characters long');
        }
        
        if (title.includes(' ')) {
            errors.push('Title cannot contain spaces');
        }
        
        return errors;
    };

    const checkUniqueTitle = async (title) => {
        try {
            const existingRecipes = await recipeStorage.getRecipeNames();
            const titleLower = title.toLowerCase();
            return !existingRecipes.some(recipe => recipe.toLowerCase() === titleLower);
        } catch (error) {
            console.error('Error checking unique title:', error);
            return false;
        }
    };

    const showError = (message) => {
        titleError.textContent = message;
        titleError.style.display = 'block';
        titleInput.classList.add('error');
    };

    const clearError = () => {
        titleError.textContent = '';
        titleError.style.display = 'none';
        titleInput.classList.remove('error');
    };

    // Real-time validation
    titleInput.addEventListener('input', async () => {
        const title = titleInput.value.trim();
        clearError();
        
        if (title.length > 0) {
            const validationErrors = validateTitle(title);
            
            if (validationErrors.length > 0) {
                showError(validationErrors[0]);
                return;
            }
            
            // Check uniqueness only if basic validation passes
            const isUnique = await checkUniqueTitle(title);
            if (!isUnique) {
                showError('A recipe with this title already exists');
            }
        }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = titleInput.value.trim();
        clearError();
        
        // Final validation
        const validationErrors = validateTitle(title);
        if (validationErrors.length > 0) {
            showError(validationErrors[0]);
            return;
        }
        
        const isUnique = await checkUniqueTitle(title);
        if (!isUnique) {
            showError('A recipe with this title already exists');
            return;
        }
        
        // Disable submit button to prevent double submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating...';
        
        try {
            // Get existing recipes and add the new one (saved in lowercase)
            const existingRecipes = await recipeStorage.getRecipeNames();
            const titleLower = title.toLowerCase();
            const updatedRecipes = [...existingRecipes, titleLower];
            
            // Store the updated recipe list
            await recipeStorage.storeRecipeNames(updatedRecipes);
            
            // Redirect to the new recipe page
            window.location.href = `recipe.html?name=${encodeURIComponent(titleLower)}`;
            
        } catch (error) {
            console.error('Error creating recipe:', error);
            showError('Failed to create recipe. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Recipe';
        }
    });
}); 