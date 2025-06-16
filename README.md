# RecipeM8

[WIP: Check it out](https://astley92.github.io/recipem8/)

A tool I plan to use to store recipes, their ingredients and how to cook them.
With some extra functionality:
- I can add and remove recipes and ingredients
- When viewing a recipe, I can increase / decrease ingredient amount and all other ingredients
  will be adjusted. This helps when I don't have enough of one ingredient or want to make
  more of a recipe.
- Other users can view recipes and adjust amounts for their preferences.
- I can share a PDF of each recipe
- I can generate shopping lists from recipes and ingredients that I currently have
- Ingredients hold nutritional information so a recipe should show all available nutritional data

# Dependencies

Only tailwind
Otherwise just use plain old HTML, CSS and Javascript

# Plan

Because I'm a cheapskate, I want to run this thing for free. The plan is:
- Host as a github project page
- Recipes and ingredients will actually be stored in this repository
    - As a json file
    - One recipe per file
    - One ingredient per file
- Data will be stored on the users end using indexeddb
- Requests made with write action (adding, deleting recipes and ingredients) will need auth:
    - Users can change whatever they want client side
    - But will need to click a sync button to sync recipes and ingredients
    - This button will add a confirmation modal that requires a password to do
    - This requests will then kick off an AWS lambda that:
        - Checks the password and halts if invalid
        - Has its own github API token with permissions on this repository
        - Makes a request to dispatch a github action on this repository that:
            - Stores the data in files
            - Makes a commit to the repository, commiting the newly added data

# To Confirm

- [x] Github project pages are compatible with stack
- [x] Nutritional info can be retrieved from woolworths item page

# Limitations

What limitations does this setup introduce if I want to stay within free tiers?

# Resources

[Using a custom domain on project page](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)
