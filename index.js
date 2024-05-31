let listaDeFavoritos = false;

// Función para obtener personajes
function getCharacters(done) {
    const results = fetch("https://dragonball-api.com/api/characters?limit=100");
    results
        .then(response => response.json())
        .then(data => {
            done(data);
        });
}

// Inicializar los personajes y configurar los botones
getCharacters(data => {
    data.items.forEach(personaje => {
        const article = document.createRange().createContextualFragment(/*html*/
        `
        <article data-id="${personaje.id}">
            <div class="contenedor-imagen">
                <img src="${personaje.image}" alt="Personajes">
            </div>
                <h2>${personaje.name}</h2>
                <h4>${personaje.race}</h4>
                <h4>${personaje.gender}</h4>
                <h4>${personaje.ki}</h4>
                <h4>${personaje.maxKi}</h4>
                <button type="button" class="btn btn-danger agregar-favotiro" data-id="${personaje.id}">Añadir a favorito</button>
        </article>
        `);
        const main = document.querySelector("main");
        main.append(article);
    });

    updateFavoriteButtons();

    // Agregar eventos a los botones de favoritos
    document.querySelectorAll('.agregar-favotiro').forEach(button => {
        button.addEventListener('click', () => toggleFavorite(button.dataset.id));
    });

    document.getElementById('filtrar-por-favoritos').addEventListener('click', toggleFilterFavorites);
});

// Función para agregar o quitar favoritos
function toggleFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButtons();

    // Si el filtro de favoritos está activado, actualizar la lista de filtrados por favoritos
    if (listaDeFavoritos) {
        filterFavorites();
    }
}


// Función para actualizar los botones de favoritos
function updateFavoriteButtons() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    document.querySelectorAll('.agregar-favotiro').forEach(button => {
        if (favorites.includes(button.dataset.id)) {
            button.textContent = 'Quitar de favoritos';
            button.classList.add('btn-success');
            button.classList.remove('btn-danger');
        } else {
            button.textContent = 'Añadir a favorito';
            button.classList.add('btn-danger');
            button.classList.remove('btn-success');
        }
    });
}

// Función para alternar entre mostrar todos los personajes y solo los favoritos
function toggleFilterFavorites() {
    if (listaDeFavoritos) {
        showAllCharacters();
    } else {
        filterFavorites();
    }
    listaDeFavoritos = !listaDeFavoritos;
    updateFilterButton();
}

// Función para mostrar solo los personajes favoritos
function filterFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    document.querySelectorAll('article').forEach(article => {
        const id = article.dataset.id;
        if (favorites.includes(id)) {
            article.style.display = 'block';
        } else {
            article.style.display = 'none';
        }
    });
}

// Función para mostrar todos los personajes
function showAllCharacters() {
    document.querySelectorAll('article').forEach(article => {
        article.style.display = 'block';
    });
}

// Función para actualizar el texto del botón de filtrar
function updateFilterButton() {
    const filterButton = document.getElementById('filtrar-por-favoritos');
    if (listaDeFavoritos) {
        filterButton.textContent = 'Mostrar todos';
        filterButton.classList.add('btn-primary');
        filterButton.classList.remove('btn-danger');
    } else {
        filterButton.textContent = 'Filtrar por favoritos';
        filterButton.classList.add('btn-danger');
        filterButton.classList.remove('btn-primary');
    }
}

// Función para actualizar la vista de los personajes
function updateView() {
    getCharacters(data => {
        const main = document.querySelector('main');
        main.innerHTML = ''; // Limpiar el contenido actual
        data.items.forEach(personaje => {
            const article = document.createRange().createContextualFragment(/*html*/
            `
            <article data-id="${personaje.id}">
                <div class="contenedor-imagen">
                    <img src="${personaje.image}" alt="Personajes">
                </div>
                    <h2>${personaje.name}</h2>
                    <h4>${personaje.race}</h4>
                    <h4>${personaje.gender}</h4>
                    <h4>${personaje.ki}</h4>
                    <h4>${personaje.maxKi}</h4>
                    <button type="button" class="btn btn-danger agregar-favotiro" data-id="${personaje.id}">Añadir a favorito</button>
            </article>
            `);
            main.append(article);
        });

        updateFavoriteButtons();

        // Agregar eventos a los botones de favoritos
        document.querySelectorAll('.agregar-favotiro').forEach(button => {
            button.addEventListener('click', () => toggleFavorite(button.dataset.id));
        });
    });
}