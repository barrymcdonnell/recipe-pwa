let recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
let editIndex = -1;

function renderRecipes() {
  const list = document.getElementById('recipe-list');
  list.innerHTML = '';
  recipes.forEach((r, i) => {
    const el = document.createElement('div');
    el.className = 'recipe';
    el.innerHTML = `
      <h2>${r.title}</h2>
      <p>${r.description}</p>
      <button onclick="editRecipe(${i})">Edit</button>
      <button onclick="deleteRecipe(${i})">Delete</button>
    `;
    list.appendChild(el);
  });
}

function showRecipeForm() {
  editIndex = -1;
  document.getElementById('form-title').textContent = 'New Recipe';
  document.getElementById('recipe-title').value = '';
  document.getElementById('recipe-description').value = '';
  document.getElementById('recipe-form').classList.remove('hidden');
}

function cancelEdit() {
  document.getElementById('recipe-form').classList.add('hidden');
}

function saveRecipe() {
  const title = document.getElementById('recipe-title').value.trim();
  const description = document.getElementById('recipe-description').value.trim();
  if (!title) return alert('Title is required');
  if (editIndex > -1) {
    recipes[editIndex] = { title, description };
  } else {
    recipes.push({ title, description });
  }
  localStorage.setItem('recipes', JSON.stringify(recipes));
  document.getElementById('recipe-form').classList.add('hidden');
  renderRecipes();
}

function editRecipe(index) {
  editIndex = index;
  document.getElementById('form-title').textContent = 'Edit Recipe';
  document.getElementById('recipe-title').value = recipes[index].title;
  document.getElementById('recipe-description').value = recipes[index].description;
  document.getElementById('recipe-form').classList.remove('hidden');
}

function deleteRecipe(index) {
  if (!confirm('Delete this recipe?')) return;
  recipes.splice(index, 1);
  localStorage.setItem('recipes', JSON.stringify(recipes));
  renderRecipes();
}

function importRecipe() {
  const url = document.getElementById('import-url').value.trim();
  if (!url) return alert('Please enter a URL');
  fetch(url)
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const title = doc.querySelector('h1, title')?.innerText || 'Imported Recipe';
      const description = doc.querySelector('p')?.innerText || 'No description available';
      recipes.push({ title, description });
      localStorage.setItem('recipes', JSON.stringify(recipes));
      renderRecipes();
    })
    .catch(() => alert('Failed to import recipe'));
}

document.getElementById('search').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll('.recipe').forEach(recipe => {
    recipe.style.display = recipe.innerText.toLowerCase().includes(query) ? '' : 'none';
  });
});

renderRecipes();
