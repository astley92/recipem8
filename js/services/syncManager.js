import GitHubService from './github.js';
import RecipeStorage from './recipeStorage.js';

class SyncManager {
    constructor(owner, repo) {
        this.githubService = new GitHubService(owner, repo);
        this.storage = new RecipeStorage();
    }

    async syncAll() {
        try {
            console.log('Starting full sync...');
            
            // Sync recipes
            const recipeFiles = await this.githubService.getAllFilesAtPath('data/recipes');
            const recipeNames = recipeFiles
                .filter(file => file.endsWith('.json'))
                .map(file => file.replace('.json', ''));
            await this.storage.storeRecipeNames(recipeNames);
            console.log('Recipes synced successfully');

            // Sync ingredients
            const ingredientFiles = await this.githubService.getAllFilesAtPath('data/ingredients');
            const ingredientNames = ingredientFiles
                .filter(file => file.endsWith('.json'))
                .map(file => file.replace('.json', ''));
            await this.storage.storeIngredientNames(ingredientNames);
            console.log('Ingredients synced successfully');

            // Update sync timestamp
            await this.storage.storeLastSyncTime();
            console.log('Sync completed successfully');
        } catch (error) {
            console.error('Error during sync:', error);
            throw error;
        }
    }

    async needsSync() {
        return this.storage.needsSync();
    }
}

export default SyncManager; 