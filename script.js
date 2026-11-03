const BASE_URL = "https://api.themoviedb.org/3";

async function getMovies(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        displayMovies(data.results);

    } catch (error) {
        console.error(error);
        document.getElementById("movies").innerHTML =
            "<p>Unable to load movies. Try again!</p>";
    }
}


function displayMovies(movies) {

    const container = document.getElementById("movies");

    if (!movies || movies.length === 0) {
        container.innerHTML = "<p>No movies found!</p>";
        return;
    }

    const watchlist = JSON.parse(
        localStorage.getItem("cinefindWatchlist")
    ) || [];

    container.innerHTML = movies.map(movie => {

        const saved = watchlist.some(
            item => item.id === movie.id
        );

        return `
            <div class="movie-card" data-id="${movie.id}">

                <img
                    src="${movie.poster_path
                        ? "https://image.tmdb.org/t/p/w300" + movie.poster_path
                        : "https://placehold.co/300x450?text=No+Poster"}"
                    alt="${movie.title}"
                >

                <h3>${movie.title}</h3>

                <p>⭐ ${movie.vote_average.toFixed(1)}</p>

                <button
                    class="watchlist-add"
                    data-id="${movie.id}"
                    data-title="${movie.title.replace(/"/g, '&quot;')}"
                    data-poster="${movie.poster_path || ''}"
                    data-rating="${movie.vote_average}"
                >
                    ${saved ? "✓ Saved" : "＋ Add to Watchlist"}
                </button>

            </div>
        `;
    }).join("");
}


function searchMovies() {

    const query = document
        .getElementById("searchInput")
        .value.trim();

    if (!query) {
        alert("Please enter a movie name!");
        return;
    }

    document.getElementById("sectionTitle").innerText =
        "Search Results";

    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;

    getMovies(url);
}

function loadPopularMovies() {

    document.getElementById("sectionTitle").innerText =
        "Popular Movies";

    getMovies(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
}

// Search when Enter is pressed
document.getElementById("searchInput")
    .addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            searchMovies();
        }
    });

loadPopularMovies();

async function showMovieDetails(movieId) {

    const modal = document.getElementById("movieModal");
    const details = document.getElementById("movieDetails");

    modal.style.display = "flex";
    details.innerHTML = "<h2>Loading movie details...</h2>";

    try {

        const url =
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Could not fetch movie details");
        }

        const movie = await response.json();

        const poster = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "";

        const backdrop = movie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : "";

        const cast = movie.credits.cast
            .slice(0, 5)
            .map(actor => actor.name)
            .join(", ");

        details.innerHTML = `
            <div class="detail-backdrop"
                 style="background-image: url('${backdrop}')">

                <div class="detail-info">

                    <img src="${poster}" alt="${movie.title}">

                    <div>
                        <h1>${movie.title}</h1>

                        <p>⭐ ${movie.vote_average.toFixed(1)} / 10</p>

                        <p>Release date: ${movie.release_date}</p>

                        <p>Genres:
                            ${movie.genres.map(g => g.name).join(", ")}
                        </p>

                        <p>${movie.overview}</p>

                        <p><b>Cast:</b> ${cast}</p>
                    </div>

                </div>
            </div>
        `;

    } catch (error) {
        details.innerHTML = "<p>Unable to load movie details.</p>";
        console.error(error);
    }
}

document.getElementById("movies").addEventListener("click", function(event) {

    // Don't open movie details when saving a movie
    if (event.target.closest(".watchlist-add")) {
        return;
    }

    const card = event.target.closest(".movie-card");

    if (card) {
        showMovieDetails(card.dataset.id);
    }

});

function closeModal() {
    document.getElementById("movieModal").style.display = "none";
}


// ===== GENRE FILTERS =====

const genres = [
    { id: 0, name: "All" },
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 18, name: "Drama" },
    { id: 14, name: "Fantasy" },
    { id: 27, name: "Horror" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
    { id: 53, name: "Thriller" }
];

function loadGenreButtons() {

    const container = document.getElementById("genres");

    container.innerHTML = genres.map(genre => `
        <button
            class="genre-btn ${genre.id === 0 ? "active" : ""}"
            data-genre="${genre.id}">
            ${genre.name}
        </button>
    `).join("");

}

// Handle genre button clicks
document.getElementById("genres").addEventListener("click", function(event) {

    const button = event.target.closest(".genre-btn");

    if (!button) return;

    const genreId = Number(button.dataset.genre);

    // Update active button
    document.querySelectorAll(".genre-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    // Update heading
    const selectedGenre = genres.find(g => g.id === genreId);

    document.getElementById("sectionTitle").innerText =
        genreId === 0 ? "Popular Movies" : selectedGenre.name + " Movies";

    // Fetch movies
    if (genreId === 0) {
        loadPopularMovies();
    } else {

        const url =
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`;

        getMovies(url);
    }

});

// Display genre buttons
loadGenreButtons();


// ===== TRENDING MOVIES =====

async function loadTrending(period) {

    // Update active button
    document.querySelectorAll(".trend-btn").forEach(button => {
        button.classList.remove("active");
    });

    document.querySelector(
        `.trend-btn[data-period="${period}"]`
    ).classList.add("active");

    // Update heading
    document.getElementById("sectionTitle").innerText =
        period === "day"
            ? "Trending Today 🔥"
            : "Trending This Week ✨";

    // Reset genre selection
    document.querySelectorAll(".genre-btn").forEach(button => {
        button.classList.remove("active");
    });

    // Fetch trending movies
    const url =
        `${BASE_URL}/trending/movie/${period}?api_key=${API_KEY}`;

    await getMovies(url);
}

// Handle trending button clicks
document.querySelector(".trending-controls")
    .addEventListener("click", function(event) {

        const button = event.target.closest(".trend-btn");

        if (!button) return;

        loadTrending(button.dataset.period);

    });

// Load today's trending movies when selected

function getWatchlist() {
    return JSON.parse(
        localStorage.getItem("cinefindWatchlist")
    ) || [];
}

// Add or remove movies
document.getElementById("movies").addEventListener(
    "click",
    function(event) {

        const button = event.target.closest(".watchlist-add");

        if (!button) return;

        event.stopPropagation();

        let watchlist = getWatchlist();

        const id = Number(button.dataset.id);

        const existing = watchlist.some(
            movie => movie.id === id
        );

        if (existing) {

            watchlist = watchlist.filter(
                movie => movie.id !== id
            );

            button.innerText = "＋ Add to Watchlist";

        } else {

            watchlist.push({
                id: id,
                title: button.dataset.title,
                poster_path: button.dataset.poster,
                vote_average: Number(button.dataset.rating)
            });

            button.innerText = "✓ Saved";
        }

        localStorage.setItem(
            "cinefindWatchlist",
            JSON.stringify(watchlist)
        );
    }
);

// Display saved movies
function showWatchlist() {

    const watchlist = getWatchlist();

    document.getElementById("sectionTitle").innerText =
        "⭐ My Watchlist";

    displayMovies(watchlist);
}

// Watchlist navigation
document.getElementById("watchlistBtn")
    .addEventListener("click", showWatchlist);
