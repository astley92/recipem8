addEventListener("DOMContentLoaded", () => {
    async function fetchRecipeNames() {
        const owner = "astley92";
        const repo = "recipem8";
        const path = "data/recipes";

        try {
            const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch recipes: ${response.statusText}`);
            }

            const files = await response.json();
            const recipeNames = files
                .filter(file => file.name.endsWith('.json'))
                .map(file => file.name.replace('.json', ''));

            return recipeNames;
        } catch (error) {
            console.error('Error fetching recipe names:', error);
            throw error;
        }
    }

    fetchRecipeNames()
        .then(recipeNames => {
            console.log('Available recipes:', recipeNames);
        })
        .catch(error => {
            console.error('Failed to fetch recipe names:', error);
        });
});