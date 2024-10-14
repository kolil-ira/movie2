const API_KEY = '7f3b3666656f3efe1ad3f599e1283a0c'; // API key
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&api_key=' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?api_key=' + API_KEY;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

getMovies(API_URL);

function getMovies(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            showMovies(data.results);
        })
        .catch(error => console.error('Error:', error));
}

function showMovies(movies) {
    main.innerHTML = '';
    movies.forEach(movie => {
        const { title, poster_path, vote_average, overview, id } = movie;

        // Create movie element
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <div class="movie">
                <img src="${IMG_URL + poster_path}" alt="${title}" />

                <div class="movie-info">
                    <h2>${title}</h2>
                    <span class="${getColor(vote_average)}">${vote_average}</span>
                </div>
                <div class="overview">
                    <h3>Overview</h3>
                    ${overview}
                    <button class="trailer-btn" id="trailer-${id}">Play Trailer</button>
                </div>
            </div>
        `;
        main.appendChild(movieEl);

        // Fetch the trailer for each movie and add event listener to the trailer button
        fetchTrailer(id, `trailer-${id}`);
    });
}

function fetchTrailer(movieId, buttonId) {
    const trailerURL = `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`;

    fetch(trailerURL)
        .then(res => res.json())
        .then(data => {
            const youtubeTrailer = data.results.find(video => video.site === 'YouTube' && video.type === 'Trailer');
            if (youtubeTrailer) {
                const trailerButton = document.getElementById(buttonId);
                trailerButton.addEventListener('click', () => {
                    window.open(`https://www.youtube.com/watch?v=${youtubeTrailer.key}`, '_blank');
                });
            } else {
                // If no trailer is available, disable the button
                const trailerButton = document.getElementById(buttonId);
                trailerButton.textContent = 'Trailer Not Available';
                trailerButton.disabled = true;
            }
        })
        .catch(error => console.error('Error fetching trailer:', error));
}

function getColor(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    if (searchTerm) {
        getMovies(searchURL + '&query=' + searchTerm);
    } else {
        getMovies(API_URL);
    }
});
