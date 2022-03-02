// HTML Element selectors
const posterSearchEl = document.querySelectorAll(".poster-search");
const titleSearchEl = document.querySelectorAll(".movie");
const searchYearEl = document.querySelectorAll(".releaseYear");
const searchResult = document.querySelector("#searchform")
const movieInput = document.querySelector("#searchbar")
const searchResultsContainer = document.querySelector('.searchresults')
const mainContentContainer = document.querySelector('.maincontent')
const mRating = document.querySelector("#movieRating")
const mGenre = document.querySelector("#genre")
const mPlot = document.querySelector("#plot")
const mScore = document.querySelector("#ratingScore")
const mainPoster = document.querySelector('.main-poster')
const mainYear = document.querySelector('.main-year')
const mainTitle = document.querySelector('.titleofmovie')

// Constants
let movieTitle; //Change to user input value
const youtubeAPI = 'AIzaSyARoCQOMM8wFTSsLyefC3mTZPCsXhr_pYg'

// Results variables
let title;
let movieYear;
let moviePoster;
let moviePlot;
let movieGenre;
let movieRated;


// YouTube Search API
function searchVideos(year, videoType) {
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${movieTitle} ${year} ${videoType}&key=${youtubeAPI}&type=video`)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            console.log('youtube', data)
        })
        .catch(err => {
            console.error(err);
        });
}

function getMovieDetails(movieId) {
    fetch(`http://www.omdbapi.com/?apikey=6c411e7c&i=${movieId}`)
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            mainTitle.textContent = data.Title
            mainYear.textContent = data.Year
            mainPoster.setAttribute('src',data.Poster)
            mPlot.textContent = data.Plot
            mGenre.textContent = data.Genre
            mRating.textContent = data.Rated
            mScore.textContent = data.imdbRating
            // console.log(movieGenre, movieTitle, moviePoster, movieRated, movieYear, moviePlot)
            console.log(data)
        })
}


// OMDB api
function searchMovie() {
    console.log("searchMovie");
    fetch(`http://www.omdbapi.com/?apikey=6c411e7c&s=${movieTitle}`)
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            console.log('OMDB', data)

            // Checks if a movie was found
            if (data.Response === 'True') {
                for (i = 0; i < 3; i++) {
                    titleSearchEl[i].textContent = data.Search[i].Title
                    console.log(data.Search[i].Poster)
                    if (data.Search[i].Poster != 'N/A') {
                        posterSearchEl[i].setAttribute("src", data.Search[i].Poster)
                    }
                    searchYearEl[i].textContent = data.Search[i].Year
                }
                // Random Id
                const movieId = data.Search[0].imdbID
                // Extracting the year from first omdb result.  Change later to Whichever result the user clicks on
                const year = data.Search[0].Year

                getMovieDetails(movieId)

                // Pulls up a video for each type
                // searchVideos(year,'Trailer')
                // searchVideos(year,'Clips')
                // searchVideos(year,'Review')
            } else {

                // Change from an alert to display on page
                alert('No such movie')
            }

        })
        .catch(err => {
            console.error(err);
        });
}

function handleSubmit(event) {
    event.preventDefault()
    movieTitle = movieInput.value
    searchMovie()
    searchResultsContainer.classList.remove('is-hidden')
}

searchResult.addEventListener("submit", handleSubmit)