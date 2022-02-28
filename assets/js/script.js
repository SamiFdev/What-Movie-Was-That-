// 
// HTML Element selectors
// 

// Constants
const movieTitle = 'shrek'
const youtubeAPI = 'AIzaSyARoCQOMM8wFTSsLyefC3mTZPCsXhr_pYg'


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


// OMDB api
function searchMovie(){
    fetch(`http://www.omdbapi.com/?apikey=6c411e7c&s=${movieTitle}`)
        .then(function(response) {
            return response.json()
        }).then(function(data) {
            console.log('OMDB',data)

            // Extracting the year from first omdb result.  Change later to Whichever result the user clicks on
            const year = data.Search[0].Year

            // Pulls up a video for each type
            searchVideos(year,'Trailer')
            searchVideos(year,'Clips')
            searchVideos(year,'Review')

        })
        .catch(err => {
            console.error(err);
        });
}


searchMovie()


