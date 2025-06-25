import SyncManager from './js/services/syncManager.js';
import RecipeStorage from './js/services/recipeStorage.js';

addEventListener("DOMContentLoaded", async () => {
    const syncManager = new SyncManager("astley92", "recipem8");
    const recipeStorage = new RecipeStorage();
    const recipeList = document.getElementById('recipe-list');
    const searchInput = document.getElementById('recipe-search');
    let allRecipes = [];

    async function loadRecipes() {
        try {
            // Check if we need to sync
            if (await syncManager.needsSync()) {
                console.log('Syncing data from GitHub...');
                await syncManager.syncAll();
            }

            // Load from IndexedDB
            console.log('Loading recipes from IndexedDB...');
            return await recipeStorage.getRecipeNames();
        } catch (error) {
            console.error('Error loading recipes:', error);
            throw error;
        }
    }

    function displayRecipes(recipes) {
        recipeList.innerHTML = '';
        recipes.forEach(recipe => {
            const li = document.createElement('li');

            // Flex container
            const flexDiv = document.createElement('div');
            flexDiv.className = 'recipe-list-flex';

            const a = document.createElement('a');
            a.href = `pages/recipe.html?name=${encodeURIComponent(recipe)}`;
            a.textContent = recipe;
            
            // Remove button
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'btn btn-secondary remove-btn';
            removeBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                if (confirm(`Are you sure you want to remove the recipe "${recipe}"?`)) {
                    try {
                        await recipeStorage.removeRecipe(recipe);
                        // Remove from allRecipes and update display
                        allRecipes = allRecipes.filter(r => r !== recipe);
                        displayRecipes(allRecipes);
                    } catch (error) {
                        alert('Failed to remove recipe.');
                    }
                }
            });

            flexDiv.appendChild(a);
            flexDiv.appendChild(removeBtn);
            li.appendChild(flexDiv);
            recipeList.appendChild(li);
        });
    }

    function filterRecipes(searchTerm) {
        const filtered = allRecipes.filter(recipe => 
            recipe.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displayRecipes(filtered);
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Set up search with debouncing
    const debouncedFilter = debounce((searchTerm) => {
        filterRecipes(searchTerm);
    }, 300);

    searchInput.addEventListener('input', (e) => {
        debouncedFilter(e.target.value);
    });

    // Load and display recipes
    try {
        allRecipes = await loadRecipes();
        displayRecipes(allRecipes);
    } catch (error) {
        console.error('Failed to load recipes:', error);
        recipeList.innerHTML = '<li>Failed to load recipes</li>';
    }
});