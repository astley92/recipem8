import GitHubService from './js/services/github.js';
import RecipeStorage from './js/services/recipeStorage.js';

addEventListener("DOMContentLoaded", async () => {
    const githubService = new GitHubService("astley92", "recipem8");
    const recipeStorage = new RecipeStorage();

    async function syncRecipes() {
        try {
            const files = await githubService.getAllFilesAtPath('data/recipes');
            const recipeNames = files
                .filter(file => file.endsWith('.json'))
                .map(file => file.replace('.json', ''));
            
            await recipeStorage.storeRecipeNames(recipeNames);
            console.log('Recipes synced successfully');
            return recipeNames;
        } catch (error) {
            console.error('Failed to sync recipes:', error);
            throw error;
        }
    }

    async function loadRecipes() {
        try {
            // Check if we need to sync
            if (await recipeStorage.needsSync()) {
                console.log('Syncing recipes from GitHub...');
                return await syncRecipes();
            }

            // Otherwise, load from IndexedDB
            console.log('Loading recipes from IndexedDB...');
            return await recipeStorage.getRecipeNames();
        } catch (error) {
            console.error('Error loading recipes:', error);
            throw error;
        }
    }

    // Load and display recipes
    try {
        const recipes = await loadRecipes();
        console.log('Available recipes:', recipes);
        // Here you can do something with the recipes, like display them
    } catch (error) {
        console.error('Failed to load recipes:', error);
    }
});