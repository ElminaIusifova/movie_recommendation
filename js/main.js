//search-> baseURL +"search/movie?api_key=<KEY>&query=<search words>
//recomended  -> baseURL + "movie/" + <movie_id> + "/recommendations?api_key=" + <KEY> + "&language=en-US"

let app = {
        URL: 'http://api.themoviedb.org/3/',
        //baseURL: 'https://image.tmdb.org/t/p/w500/',
        baseImageURL: null,
        configData: null,
        activePage: null,
        keyword: null,
        posterSize: null,
        movie_id: 0,
        title: '',
        

        init: function () {
            //focus on the txt field
            let input = document.getElementById('search-input');
            input.focus();
            app.getconfig();
            setTimeout(app.addHandler, 1000);
        },
        addHandler: function () {
            //add the click listener
            let btn = document.getElementById('search-button');
            btn.addEventListener('click', app.runSearch);


            let btn2 = document.getElementById('back-button');
            btn2.addEventListener('click', app.goBack);


            //add the listener for ENTER
            document.addEventListener('keypress', function (ev) {
                let char = ev.char || ev.charCode || ev.which;
                let str = String.fromCharCode(char);
                if (char == 10 || char == 13) {
                    //we have an enter or return key
                    btn.dispatchEvent(new MouseEvent('click'));

                }
            });
        },
    
    //getting the data from MOVIE DB API with fetch
    getconfig: function() {
        let configURL= app.URL + 'configuration?api_key=' + KEY;
        console.log(configURL);
        fetch(configURL)
        .then(response => response.json())
        .then(data =>{
            app.baseImageURL = data.images.secure_base_url;
            app.posterSize = data.images.poster_sizes[4];
        })
        .catch(err => {
            console.log(err);
        })
        
    },
    
    //function for btn
// 1 page 
    runSearch: function (ev) {
        //do the fetch to get the list of movies
        console.log(ev.type);
        ev.preventDefault();
        let page = 1;
        let input = document.getElementById('search-input');
        let x = input.value;
        //code will not run if the value is an empty string
        if (x == " ") {
            alert("Please Enter a Valid Movie Name");
            console.log("input.value:", x);
            return false;
        } else if (input.value) {
            
            let url = app.URL + "search/movie?api_key=" + KEY + "&query=" + input.value + "&page=" + page;
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    app.showMovies(data);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },
    
    // switch from 1 to 2 page
    showMovies: function (movies) {
        let container = document.querySelector('#search-results .content');
        let divSearchResults = document.querySelector('#search-results');
        divSearchResults.classList.add('active');
        let df = document.createDocumentFragment();
        container.innerHTML = " ";
        let x = document.querySelector('#search-results .title');
        x.innerHTML = " ";
        let p = document.createElement('p');
        p.textContent = " You have " + movies.total_results + " results ";
        console.log(p);
        x.appendChild(p);
        

// creating html for each card of movie
        
        movies.results.forEach(function (movie) {
            let div = document.createElement('div');

            div.classList.add('movie');
            let p = document.createElement('p');
            p.textContent = movie.overview;
            p.classList.add('movie-desc');
            let img = document.createElement('img');
            console.log(app.baseImageURL + movie.poster_path);
            let imgUrl = app.baseImageURL + app.posterSize; 
            img.setAttribute("src", imgUrl + movie.poster_path);
            img.classList.add('poster');
            let h = document.createElement('h2');
            h.classList.add("movie-title");
            h.textContent = movie.title;
            h.setAttribute("movie_id", movie.id);
            h.setAttribute("movie_title", movie.title);

            //add click listener for getting recommended movies
            h.addEventListener("click", app.movieSelected);
            div.appendChild(img);
            div.appendChild(h);
            div.appendChild(p);
            df.appendChild(div);

        });
        container.appendChild(df);
    },
    
//  switch from 1 to 2 Page 
    movieSelected: function (ev) {
        ev.preventDefault();
        let movieId = ev.target.getAttribute('movie_id');
        let movieTitle = ev.target.getAttribute('movie_title');
        console.log("movieTitle:", movieTitle);
        console.log("movieId:", movieId);
        let y = document.querySelector('#recommend-results .title');
        y.innerHTML = " ";
        let p = document.createElement('p');
        p.textContent = " Recomendations based on " + movieTitle;
        console.log(p);
        y.appendChild(p);
        let url = app.URL + "movie/" + movieId + "/recommendations?api_key=" + KEY + "&language=en-US";

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                app.showRecommended(data);
            })
            .catch(err => {
                console.log(err);
            })


        //hide search-results 
        let divSearchResults = document.querySelector('#search-results');

        divSearchResults.classList.remove('active');

        let divRecommendResults = document.querySelector('#recommend-results');

        divRecommendResults.classList.add('active');


    },
    
    //switching from 2 to 3 page

//function which is called while fetching data for recommended movies
    showRecommended: function (movies) {
        
        //creating html for each card of movie
        let container = document.querySelector('#recommend-results .content');
        let df = document.createDocumentFragment();
        container.innerHTML = " ";
        let back = document.getElementById('back-button');
        back.classList.remove('hidden');
        movies.results.forEach(function (movie) {
            let div = document.createElement('div');

            div.classList.add('movie');
            let p = document.createElement('p');
            p.textContent = " Released: " + movie.release_date;
            p.classList.add('movie-desc');
            let img = document.createElement('img');
            console.log(app.baseImageURL + movie.poster_path);
            let imgUrl = app.baseImageURL + app.posterSize; 
            img.setAttribute("src", imgUrl + movie.poster_path);
            img.classList.add('poster');
            let h = document.createElement('h2');
            h.classList.add("movie-title");
            h.textContent = movie.title;
            let p1 = document.createElement('p1');
            p1.textContent = " Average Rating: " + movie.vote_average;
            p1.classList.add('movie-desc');
            div.appendChild(img);
            div.appendChild(h);
            div.appendChild(p);
            div.appendChild(p1);
            df.appendChild(div);

        });
        container.appendChild(df);

    },
    
    //back button function, going back to previous page
    goBack: function (ev) {
        ev.preventDefault();
        document.querySelector("#recommend-results").classList.remove("active");
//        document.querySelector("#search-results").textContent = "";
        document.querySelector("#search-results").classList.add("active");
        document.getElementById("search-input").value = null;
        
    }

};



document.addEventListener('DOMContentLoaded', app.init);


