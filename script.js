const API_KEY = '14127c00';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&`;

const searchInput = document.getElementById('searchInput');
const moviesContainer = document.getElementById('moviesContainer');
const pagination = document.getElementById('pagination');

let currentPage = 1;
let currentSearch = '';

function fetchMovies(query, page = 1) {
    fetch(`${API_URL}s=${query}&page=${page}`)
        .then(response => response.json())
        .then(data => {
            displayMovies(data.Search);
            setupPagination(data.totalResults);
        })
        .catch(error => console.error('Error fetching movies:', error));
}

function fetchMovies(query, page = 1) {
    fetch(`${API_URL}s=${query}&page=${page}`)
        .then(response => response.json())
        .then(data => {
            const movies = data.Search;
            if (movies) {
                // Fetch additional details for each movie
                const movieDetailsPromises = movies.map(movie => 
                    fetch(`${API_URL}i=${movie.imdbID}`)
                    .then(response => response.json())
                );
                
                Promise.all(movieDetailsPromises)
                    .then(detailsArray => {
                        displayMovies(detailsArray);
                    });
            } else {
                moviesContainer.innerHTML = '<p>No movies found</p>';
            }
        })
        .catch(error => console.error('Error fetching movies:', error));
}


function displayMovies(movies) {
    moviesContainer.innerHTML = '';
    if (movies) {
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.innerHTML = `
                <img src="${movie.Poster}" alt="${movie.Title}" class="movie-poster">
                <div class="movie-details">
                    <h3 class="movie-title">${movie.Title}</h3>
                    <p class="movie-year">${movie.Year}</p>
                    <div class="movie-ratings">
                    <p class="rating-imdb">IMDB:  <strong>${movie.Ratings[0].Value}</p></strong>
                </div>
                    <p class="movie-genre">${movie.Genre}</p>
                    <button class="view-details-btn">View Details</button>
                </div>

            `;
            moviesContainer.appendChild(movieCard);
        });
    } else {
        moviesContainer.innerHTML = '<p>No movies found</p>';
    }
}


function debounce(func, delay) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

searchInput.addEventListener('input', debounce((e) => {
    const query = e.target.value.trim();
    if (query) {
        currentSearch = query;
        currentPage = 1;
        fetchMovies(query, currentPage);
    } else {
        moviesContainer.innerHTML = '';
        pagination.innerHTML = '';
    }
}, 300));









