const app = {};

//global variables
app.newsKey = 'jlArOAHO1cbdnKXGlHY4AuREzAi5fc11';
app.newsAPI = 'https://api.nytimes.com/svc/topstories/v2/world.json';
app.newsHTML = '';
app.trumpAPI = 'https://api.whatdoestrumpthink.com/api/v1/quotes/random';
app.trumpHTML = '';
app.counter = 0;

//get news + trump data
app.getData = (direction) => {
    //get news headline
    const newsData = app.getNewsData();

    //if news API call fails, set temp error
    newsData.fail( (res) => {
        app.newsHTML = `Hmmm...we're not getting any news...maybe no news is good news? Try refreshing the page or come back later.`
        $(".news-item").html(app.newsHTML);

        //hide the headers and trump section
        $('h2').css("display", "none");
        $('.trump-container').css("display", "none");
    });

    //if successful, display on screen and call trump quote API
    newsData.done( (res) => {
        //increment/decrement news article counter
        if (direction === 'right') {
            app.counter++
        } else if (direction === 'left') {
            app.counter--
        } else {
            app.counter = 0;
        }

        //reset counter if at end of news articles
        if (app.counter === res.results.length) {
            app.counter = 0;
        } else if (app.counter < 0) {
            app.counter = res.results.length - 1;
        }

        //set news item to display
        const newsItem = res.results[app.counter];

        //construct + update news item html
        app.newsHTML = `
            <h3 class="news-title">${newsItem.title}</h3>
            <div class="news-body">
                <div class="news-text">
                    <h4>${newsItem.byline}</h4>
                    <p>${newsItem.abstract}</p>
                    <a class="news-link"href="${newsItem.url}" target="_blank">Full Article</a>
                </div>
                <img class="news-img" src="${newsItem.multimedia[0].url}" alt="${newsItem.multimedia[0].caption}">
            </div>
            <div class="arrows">
            <i class="fas fa-chevron-circle-left"></i>
            <i class="fas fa-chevron-circle-right"></i>
            </div>
        `;
        $(".news-item").html(app.newsHTML);

        //get trump quote + display
        const trumpData = app.getTrumpData();

        //if trump call fails, set temp error
        trumpData.fail( (res) => {
            app.trumpHTML = `Hmmm...Trump isn't saying anything right now, that's new! Try refreshing the page or come back later.`

            $(".trump-container h3").html(app.trumpHTML);
        });

        //if trump call successful, construct + update html
        trumpData.done( (res) => {
            app.trumpHTML = res.message;
            $(".trump-container h3").html(app.trumpHTML);
        });     

    });
    
};

//get news headline
app.getNewsData = () => {
    return $.ajax({
        url: `${app.newsAPI}?api-key=${app.newsKey}`,
        method: `GET`,
        dataType: `JSON`
    });
}

//get trump quote
app.getTrumpData = () => {
    return $.ajax({
        url: app.trumpAPI,
        method: `GET`,
        dataType: `JSON`
    });
}



//doc ready
$(document).ready(function() {
    //initialize
    app.init()
});

//initialize
app.init = () => {
    app.getData();
    
    //event listeners
    $('.news-item').on('click', '.fa-chevron-circle-right', function() {
        app.getData('right');
    });

    $('.news-item').on('click', '.fa-chevron-circle-left', function() {
        app.getData('left');
    });
};