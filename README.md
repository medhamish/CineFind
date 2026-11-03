# CineFind

A movie discovery platform to explore popular releases, discover trending titles, and keep track of movies you want to watch.

## Features

- **Explore Movies** — Browse popular and trending movies.
- **Search** — Find movies by title.
- **Genre Discovery** — Filter movies by genre.
- **Movie Details** — View ratings, release dates, descriptions, and cast information.
- **Watchlist** — Save movies and manage your personal watchlist.
- **Persistent Storage** — Watchlist data is saved using browser local storage.

## Tech Stack

| Technology    | Purpose               |
| ------------- | --------------------- |
| HTML5         | Structure             |
| CSS3          | Styling and layout    |
| JavaScript    | Application logic     |
| TMDB API      | Movie data            |
| Local Storage | Watchlist persistence |

## Getting Started

### Prerequisites

- A modern web browser
- A TMDB API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/medhamish/CineFind.git
   ```

2. Navigate to the project directory:

   ```bash
   cd CineFind
   ```

3. Create a `config.js` file in the project root and add your own TMDB API key:

   ```javascript
   const API_KEY = "YOUR_TMDB_API_KEY";
   ```

4. Open the project using a local development server.

## API Reference

Movie information is provided by [The Movie Database (TMDB)](https://www.themoviedb.org/).

This product uses the TMDB API but is not endorsed or certified by TMDB.

## Project Structure

```text
CineFind/
├── index.html
├── style.css
├── script.js
├── config.example.js
├── .gitignore
└── README.md
```

## License

This project is intended for educational and portfolio purposes.
