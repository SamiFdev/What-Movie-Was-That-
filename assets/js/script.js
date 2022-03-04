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
const movieCard = document.querySelectorAll('.movieCard')
const videoEl = document.querySelector('.videos')
const clearButton = document.querySelector('.clearButton')
const backButton = document.querySelector('.backButton')
const favoriteEl = document.querySelector('.favorite')
const favoritesEl = document.querySelector('.favorites')
const favoriteBox = document.querySelector('.favoritesContainer')
const modalEl = document.querySelector('.modal')

// Constants
let movieTitle; 
let movieID;
let favorites = []
const youtubeAPI = 'AIzaSyARoCQOMM8wFTSsLyefC3mTZPCsXhr_pYg'

// YouTube Search API
function searchVideos(selectedTitle, year, videoType) {

    // Removes any previous videos
    videoEl.replaceChildren()

    // Creates elements for youtube section
    const embedded = document.createElement('iframe')
    const trailerTitle = document.createElement('h1')
    trailerTitle.classList.add("is-size-5");
    trailerTitle.classList.add("has-text-weight-bold")

    // Displays main page and hides search results
    searchResultsContainer.classList.add('is-hidden')
    mainContentContainer.classList.remove('is-hidden')

    // Gets Youtube data
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${selectedTitle} ${year} ${videoType}&key=${youtubeAPI}&type=video`)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {

            // Sets up the iframe
            embedded.setAttribute('src',`https://www.youtube.com/embed/${data.items[0].id.videoId}`)
            embedded.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture')
            embedded.setAttribute('allowfullscreen',true)
            embedded.setAttribute('style','height:400px;')
            trailerTitle.innerHTML = (data.items[0].snippet.title)
            videoEl.append(embedded)
            videoEl.append(trailerTitle)
        })
        .catch(err => {
            console.error(err);
        });
}

// Returns to search results page
function goBack() {
    mainContentContainer.classList.add('is-hidden')
    searchResultsContainer.classList.remove('is-hidden')
    backButton.classList.add('is-hidden')
}

// Gets full details of the movie
function getMovieDetails(movieId) {
    backButton.classList.remove('is-hidden')

    // Changes the star color if already favorited
    alreadyFavorited = false
    favorites.forEach(movie=>{
        if (movie.id === movieId){
            alreadyFavorited = true
        }
    })
    if (alreadyFavorited){
        favoriteEl.setAttribute("style", "color:yellow;");
    }else{
        favoriteEl.setAttribute("style", "color:black;");
    }

    
    fetch(`https://www.omdbapi.com/?apikey=6c411e7c&i=${movieId}`)
        .then(function (response) {
            return response.json()
        }).then(function (data) {

            // Stores relevant data
            movieTitle = data.Title
            movieID = data.imdbID
            mainTitle.textContent = movieTitle
            mainTitle.classList.add('has-text-weight-bold')
            mainYear.textContent = data.Year

            if (data.Poster !== 'N/A') {
                mainPoster.setAttribute('src', data.Poster)
            } else {
                mainPoster.setAttribute('src', './assets/images/default-image.png')
            }
            mPlot.textContent = data.Plot
            mGenre.textContent = data.Genre
            mRating.textContent = data.Rated
            mScore.textContent = data.imdbRating

            // Searches youtube for a trailer of the movie with the year to prevent incorrect searches
            searchVideos(data.Title, data.Year, 'Trailer')
        })
}


// OMDB api
function searchMovie(movieTitle) {
    
    fetch(`https://www.omdbapi.com/?apikey=6c411e7c&s=${movieTitle}`)
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            console.log('OMDB', data)

            // Checks if a movie was found
            if (data.Response === 'True') {
                searchResultsContainer.classList.remove('is-hidden')

                for (i = 0; i < 3; i++) {
                    
                    // Makes cards clickable to get details
                    movieCard[i].setAttribute('data-id', data.Search[i].imdbID)
                    movieCard[i].onclick = function (event) {

                        getMovieDetails(this.getAttribute('data-id'))

                    }
                    titleSearchEl[i].textContent = data.Search[i].Title
                    searchYearEl[i].textContent = data.Search[i].Year

                    // Checks if there is a poster
                    if (data.Search[i].Poster != 'N/A') {
                        posterSearchEl[i].setAttribute("src", data.Search[i].Poster)
                    } else {
                        posterSearchEl[i].setAttribute("src", './assets/images/default-image.png')
                    }
                }
              
            } else {

                // Opens modal if movie is not in database
                document.querySelector('#warning').classList.add('is-active')
            }

        })
        .catch(err => {
            console.error(err);
        });
}

function clearResults() {
    mainContentContainer.classList.add('is-hidden')
    searchResultsContainer.classList.add('is-hidden')
    backButton.classList.add('is-hidden')
    movieTitle = ''
    movieID = ''
}

// Searches movie, hides back button and detail page(in case it was searched from detail page)
function handleSubmit(event) {
    event.preventDefault()
    movieTitle = movieInput.value
    searchMovie(movieTitle)
    movieInput.value = ''
    mainContentContainer.classList.add('is-hidden')
    backButton.classList.add('is-hidden')
}

function loadFavorites() {

    // Clears favorite list
    favoriteBox.innerHTML=''

    // Temporarily loads storage to check if it is empty
    const favoritesLoaded = JSON.parse(localStorage.getItem('favorites'))
    if (!favoritesLoaded || !favoritesLoaded.length){
        favoriteBox.innerHTML = '<p>No favorites</p>'
    }
    else if (favoritesLoaded) {
       
        // Stores loaded data into favorites array
        favorites = favoritesLoaded
        
        // Creates favorites list in modal
        favorites.forEach((movie)=>{
            const horizontalLine = document.createElement('hr')
            let favoriteItem = document.createElement("p")
            favoriteItem.textContent=movie.name
            favoriteItem.setAttribute("data-name", movie.name)
            favoriteItem.setAttribute('data-id',movie.id)
            favoriteItem.onclick = function(){
                getMovieDetails(this.getAttribute("data-id"))
                modalEl.classList.remove('is-active')
            }
            favoriteBox.append(horizontalLine,favoriteItem)
        })

    } 
}

function saveFavorite() {
    alreadySaved = false;
    const currentfavorite = ({
        name: movieTitle,
        id: movieID
    })

    // Checks if movie is saved
    for (let i=0;i<favorites.length;i++){
        if (favorites[i].id===currentfavorite.id){
            alreadySaved = true;
        }
    }

    // Removes movie from favorites if star is clicked when already favorited
    if (alreadySaved) {
        favoriteEl.setAttribute("style", "color:black;");
        favorites = favorites.filter(function(v) {
            return v.id !== currentfavorite.id;
        });
        
    } 
    
    // Adds to favorites if star is clicked
    else {
        favorites.push({
            name: movieTitle,
            id: movieID
        }) 
        favoriteEl.setAttribute("style", "color:yellow;");
    }

    // Saves and loads data
    localStorage.setItem('favorites', JSON.stringify(favorites))
    loadFavorites()
}

// Runs on page load
function init () {
    loadFavorites()
    searchResult.addEventListener("submit", handleSubmit)
    clearButton.onclick = clearResults
    backButton.onclick = goBack
    favoriteEl.onclick = saveFavorite
    favoritesEl.onclick = loadFavorites

    // Modal
    document.addEventListener('DOMContentLoaded', () => {
        // Functions to open and close a modal
        function openModal($el) {
            $el.classList.add('is-active');
        }

        function closeModal($el) {
            $el.classList.remove('is-active');
        }

        function closeAllModals() {
            (document.querySelectorAll('.modal') || []).forEach(($modal) => {
                closeModal($modal);
            });
        }

        // Add a click event on buttons to open a specific modal
        (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
            const modal = $trigger.dataset.target;
            const $target = document.getElementById(modal);
            console.log($target);

            $trigger.addEventListener('click', () => {
                openModal($target);
            });
        });

        // Add a click event on various child elements to close the parent modal
        (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
            const $target = $close.closest('.modal');

            $close.addEventListener('click', () => {
                closeModal($target);
            });
        });

        // Add a keyboard event to close all modals
        document.addEventListener('keydown', (event) => {
            const e = event || window.event;

            if (e.keyCode === 27) { // Escape key
                closeAllModals();
            }
        });
    });

}

init()