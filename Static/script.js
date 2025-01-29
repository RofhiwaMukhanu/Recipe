document.addEventListener('DOMContentLoaded', () => {
    const recipeForm = document.getElementById('recipeForm');
    const recipesList = document.getElementById('recipesList');
    
    // Load recipes on page load
    fetchRecipes();
    
    // Form submit handler
    recipeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const recipe = {
            title: document.getElementById('title').value,
            ingredients: document.getElementById('ingredients').value,
            instructions: document.getElementById('instructions').value
        };
        
        addRecipe(recipe);
        recipeForm.reset();
    });
});

async function fetchRecipes() {
    const response = await fetch('/recipes');
    const recipes = await response.json();
    displayRecipes(recipes);
}

function displayRecipes(recipes) {
    const recipesList = document.getElementById('recipesList');
    recipesList.innerHTML = '';
    
    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe-card';
        recipeDiv.innerHTML = `
            <h3>${recipe.title}</h3>
            <p><strong>Ingredients:</strong><br>${recipe.ingredients}</p>
            <p><strong>Instructions:</strong><br>${recipe.instructions}</p>
            <button onclick="editRecipe(${recipe.id})">Edit</button>
            <button onclick="deleteRecipe(${recipe.id})">Delete</button>
        `;
        recipesList.appendChild(recipeDiv);
    });
}

async function addRecipe(recipe) {
    await fetch('/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe)
    });
    fetchRecipes();
}

async function deleteRecipe(id) {
    await fetch(`/recipes/${id}`, {
        method: 'DELETE'
    });
    fetchRecipes();
}

async function editRecipe(id) {
    const response = await fetch(`/recipes/${id}`);
    const recipe = await response.json();
    
    // Populate form with recipe data
    document.getElementById('title').value = recipe.title;
    document.getElementById('ingredients').value = recipe.ingredients;
    document.getElementById('instructions').value = recipe.instructions;
    
    // Change form to update mode
    const form = document.getElementById('recipeForm');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const updatedRecipe = {
            title: document.getElementById('title').value,
            ingredients: document.getElementById('ingredients').value,
            instructions: document.getElementById('instructions').value
        };
        
        await fetch(`/recipes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedRecipe)
        });
        
        form.reset();
        fetchRecipes();
    };
}