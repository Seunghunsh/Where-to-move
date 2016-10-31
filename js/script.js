
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var $street = $('#street').val();
    var $city = $('#city').val();

    $body.append('<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x300&location='+ $street + ', ' + $city + '">');
    
    //NY TIMES ARTICLE SEARCH
    var NYTIMESURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    var WIKIURL = "https://en.wikipedia.org/w/api.php?action=query&titles="+ $city +"&prop=revisions&rvprop=content&format=json";
    NYTIMESURL += '?' + $.param({
      'q': $city,
      'sort': "newest"
    });
    $.ajax({
        url: NYTIMESURL,
        method: 'GET',
    })
    .done(function(result) {
      var items = [];
      $('#nytimes-header').text('New York Times Articles about ' +$city );
      $.each (result.response.docs, function(){
        items.push("<li class='article'><a href="+ this.web_url +">"+this.snippet+"</a></li><p>"+this.lead_paragraph+"</p>");
      });
      $('#nytimes-articles').append(items);
    })
    .fail(function(result) {
      $('#nytimes-header').text('New York Times articels could not be loaded' );
    });

    // Wikipedia
    var wikiBaseUrl = 'http://en.wikipedia.org/w/api.php?format=json&action=opensearch&search=';
    var wikiUrl = wikiBaseUrl + $city;

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text('Could not load wikipedia links');
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function(data){
            for (var i = 0; i <= data[1].length - 1; i++) {
                var pageLink = '<li><a href="' + data[3][i] + '">' + data[1][i] + '</a></li>';
                $wikiElem.append(pageLink);
            };

            clearTimeout(wikiRequestTimeout);
        }
    });    

    // $.ajax({
    //     url: WIKIURL,
    //     method: 'GET',
    // })
    // .done(function(result) {
    //   var items = [];
    //   $('#wikipedia-header').text('wikipedia pages about ' +$city );
    //   $.each (result.query.pages, function(){
    //     items.push("<li class='article'><a href="+ this.web_url +">"+this.snippet+"</a></li><p>"+this.lead_paragraph+"</p>");
    //   });
    //   $('#wikipedia-links').append(items);
    // })
    // .fail(function(result) {
    //   $('#nytimes-header').text('New York Times articels could not be loaded' );
    // });

    return false;
};

$('#form-container').submit(loadData);
