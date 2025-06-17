import GitHubService from './js/services/github.js';

addEventListener("DOMContentLoaded", () => {
    const githubService = new GitHubService("astley92", "recipem8");
    
    githubService.getAllFilesAtPath('data/recipes')
        .then(files => {
            const recipeNames = files
                .filter(file => file.endsWith('.json'))
                .map(file => file.replace('.json', ''));
            console.log('Available recipes:', recipeNames);
        })
        .catch(error => {
            console.error('Failed to fetch recipe names:', error);
        });
});