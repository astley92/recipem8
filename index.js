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
            const a = document.createElement('a');
            a.href = `pages/recipe.html?name=${encodeURIComponent(recipe)}`;
            a.textContent = recipe;
            li.appendChild(a);
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