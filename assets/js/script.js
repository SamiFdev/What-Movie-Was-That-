// 
// HTML Element selectors
// 

// Constants
const movieTitle = 'shrek' //Change to user input value
const youtubeAPI = 'AIzaSyARoCQOMM8wFTSsLyefC3mTZPCsXhr_pYg'

// Results variables
let title;
let movieYear;
let moviePoster;
let moviePlot;
let movieGenre;
let movieRated;


// YouTube Search API
function searchVideos(year,videoType){
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${movieTitle} ${year} ${videoType}&key=${youtubeAPI}&type=video`)
        .then(function(res) {
            return res.json()
        })
        .then(function(data){
        console.log('youtube',data)
        })
        .catch(err => {
            console.error(err);
        });
}

function getMovieDetails(movieId){
    fetch(`http://www.omdbapi.com/?apikey=6c411e7c&i=${movieId}`)
        .then(function(response) {
            return response.json()
        }).then(function(data) {
            title = data.Title
            movieYear = data.Year
            moviePoster = data.Poster
            moviePlot = data.Plot
            movieGenre = data.Genre
            movieRated = data.Rated
            console.log(movieGenre,movieTitle,moviePoster,movieRated,movieYear,moviePlot)
        })
}


// OMDB api
function searchMovie(){
    fetch(`http://www.omdbapi.com/?apikey=6c411e7c&s=${movieTitle}`)
        .then(function(response) {
            return response.json()
        }).then(function(data) {
            console.log('OMDB',data)

            // Checks if a movie was found
            if (data.Response === 'True'){
                
                // Random Id
                const movieId = data.Search[0].imdbID
                // Extracting the year from first omdb result.  Change later to Whichever result the user clicks on
                const year = data.Search[0].Year

                getMovieDetails(movieId)

                // Pulls up a video for each type
                // searchVideos(year,'Trailer')
                // searchVideos(year,'Clips')
                // searchVideos(year,'Review')
            }
            else {

                // Change from an alert to display on page
                alert('No such movie')
            }

        })
        .catch(err => {
            console.error(err);
        });
}


searchMovie()


