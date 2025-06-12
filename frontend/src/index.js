console.log("RecipeM8");

document.addEventListener("DOMContentLoaded", () => {
    async function listFiles() {
        const owner = "astley92";
        const repo = "recipem8";
        const path = "data/recipes";

        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        const res = await fetch(url);

        if (!res.ok) {
            document.getElementById("file-list").innerText = "Failed to load files.";
            return;
        }

        const files = await res.json();
        const list = document.getElementById("file-list");

        files.forEach(file => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="${file.html_url}" target="_blank">${file.name}</a>`;
            list.appendChild(li);
        });
    }

    listFiles();
});
