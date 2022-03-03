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

// Constants
let movieTitle; //Change to user input value
const youtubeAPI = 'AIzaSyARoCQOMM8wFTSsLyefC3mTZPCsXhr_pYg'


// YouTube Search API
function searchVideos(selectedTitle,year, videoType) {
    videoEl.replaceChildren()
    const embeded = document.createElement('iframe')
    const trailerTitle = document.createElement('h1')
    trailerTitle.classList.add("is-size-5");
    trailerTitle.classList.add("has-text-weight-bold")
    searchResultsContainer.classList.add('is-hidden')
    mainContentContainer.classList.remove('is-hidden')
    console.log(selectedTitle)

    // 
    // CHANGE WHEN USING YOUTUBE!!!!
    // 
    

    const temp = document.createElement('img')
    temp.setAttribute('src','./assets/images/default-video.png')
    videoEl.append(temp)
    trailerTitle.textContent = 'TITLE OF VIDEO'
    videoEl.append(trailerTitle)
    
    
    // 
    // CHANGE WHEN USING YOUTUBE!!!!
    // 
    // fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${selectedTitle} ${year} ${videoType}&key=${youtubeAPI}&type=video`)
    //     .then(function (res) {
    //         return res.json()
    //     })
    //     .then(function (data) {
    //         // console.log('youtube', data,title)
    //         embeded.setAttribute('src',`https://www.youtube.com/embed/${data.items[0].id.videoId}`)
    //         // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    //         embeded.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture')
    //         embeded.setAttribute('allowfullscreen',true)
    //         trailerTitle.textContent = (data.items[0].snippet.title)
    //          videoEl.append(embeded)
    //         videoEl.append(trailerTitle)
           
    //     })
    //     .catch(err => {
    //         console.error(err);
    //     });
}

function getMovieDetails(movieId) {
    fetch(`http://www.omdbapi.com/?apikey=6c411e7c&i=${movieId}`)
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            mainTitle.textContent = data.Title
            mainTitle.classList.add('has-text-weight-bold')
            mainYear.textContent = data.Year
            if (data.Poster!=='N/A'){
                mainPoster.setAttribute('src',data.Poster)
            } else {
                mainPoster.setAttribute('src','./assets/images/default-image.png')
            }
            mPlot.textContent = data.Plot
            mGenre.textContent = data.Genre
            mRating.textContent = data.Rated
            mScore.textContent = data.imdbRating
            // console.log(movieGenre, movieTitle, moviePoster, movieRated, movieYear, moviePlot)
            console.log(data)
            searchVideos(data.Title,data.Year,'Trailer')
            // Pulls up a video for each type
                // searchVideos(year,'Trailer')
                // searchVideos(year,'Clips')
                // searchVideos(year,'Review')
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
                    movieCard[i].setAttribute('data-id',data.Search[i].imdbID)
                     movieCard[i].onclick=function(event){

                        getMovieDetails(this.getAttribute('data-id'))
                      
                    }
                    titleSearchEl[i].textContent = data.Search[i].Title
                    console.log(data.Search[i].Poster)
                    if (data.Search[i].Poster != 'N/A') {
                        posterSearchEl[i].setAttribute("src", data.Search[i].Poster)
                    } else {
                        posterSearchEl[i].setAttribute("src", './assets/images/default-image.png')
                    }
                    searchYearEl[i].textContent = data.Search[i].Year
                }
                // Random Id
                // const movieId = data.Search[0].imdbID
                // Extracting the year from first omdb result.  Change later to Whichever result the user clicks on
                // const year = data.Search[0].Year

                // getMovieDetails(movieId)

                // Pulls up a video for each type
                
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
function clearResults () {
    mainContentContainer.classList.add('is-hidden')
    searchResultsContainer.classList.add('is-hidden')
}

function handleSubmit(event) {
    event.preventDefault()
    movieTitle = movieInput.value
    movieInput.value=''
    searchMovie()
    mainContentContainer.classList.add('is-hidden')
    searchResultsContainer.classList.remove('is-hidden')
}

// Allows enter to be used to submit the input
function checkEnter(event){
    if (event.key === 'Enter'){
        handleSubmit(event)
    }
}

searchResult.addEventListener("submit", handleSubmit)
searchResult.addEventListener('keydown',checkEnter)
clearButton.onclick = clearResults