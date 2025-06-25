import SyncManager from '../services/syncManager.js';
import RecipeStorage from '../services/recipeStorage.js';

addEventListener("DOMContentLoaded", async () => {
    const syncManager = new SyncManager("astley92", "recipem8");
    const recipeStorage = new RecipeStorage();
    const ingredientList = document.getElementById('ingredient-list');
    const searchInput = document.getElementById('ingredient-search');
    let allIngredients = [];

    async function loadIngredients() {
        try {
            // Check if we need to sync
            if (await syncManager.needsSync()) {
                console.log('Syncing data from GitHub...');
                await syncManager.syncAll();
            }

            // Load from IndexedDB
            console.log('Loading ingredients from IndexedDB...');
            return await recipeStorage.getIngredientNames();
        } catch (error) {
            console.error('Error loading ingredients:', error);
            throw error;
        }
    }

    function displayIngredients(ingredients) {
        ingredientList.innerHTML = '';
        ingredients.forEach(ingredient => {
            const li = document.createElement('li');

            // Flex container
            const flexDiv = document.createElement('div');
            flexDiv.className = 'recipe-list-flex';

            const a = document.createElement('a');
            a.href = `ingredient.html?name=${encodeURIComponent(ingredient)}`;
            a.textContent = ingredient;
            
            // Remove button
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'btn btn-secondary remove-btn';
            removeBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                if (confirm(`Are you sure you want to remove the ingredient "${ingredient}"?`)) {
                    try {
                        await recipeStorage.removeIngredient(ingredient);
                        // Remove from allIngredients and update display
                        allIngredients = allIngredients.filter(i => i !== ingredient);
                        displayIngredients(allIngredients);
                    } catch (error) {
                        alert('Failed to remove ingredient.');
                    }
                }
            });

            flexDiv.appendChild(a);
            flexDiv.appendChild(removeBtn);
            li.appendChild(flexDiv);
            ingredientList.appendChild(li);
        });
    }

    function filterIngredients(searchTerm) {
        const filtered = allIngredients.filter(ingredient => 
            ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displayIngredients(filtered);
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
        filterIngredients(searchTerm);
    }, 300);

    searchInput.addEventListener('input', (e) => {
        debouncedFilter(e.target.value);
    });

    // Load and display ingredients
    try {
        allIngredients = await loadIngredients();
        displayIngredients(allIngredients);
    } catch (error) {
        console.error('Failed to load ingredients:', error);
        ingredientList.innerHTML = '<li>Failed to load ingredients</li>';
    }
}); 