class GitHubService {
    constructor(owner, repo) {
        this.owner = owner;
        this.repo = repo;
        this.baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
    }

    async getAllFilesAtPath(path) {
        const files = await this._getContents(path);
        return files
            .filter(file => file.type === 'file')
            .map(file => file.name);
    }

    async _getContents(path) {
        try {
            const url = `${this.baseUrl}/contents/${path}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch contents: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching contents:', error);
            throw error;
        }
    }
}

export default GitHubService; 