document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const nameInput = document.querySelector("input[name='name']");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        if (!nameInput.validity.valid) {
            nameInput.reportValidity();
            return;
        }

        const name = nameInput.value;
        console.log(name);
    });
});
