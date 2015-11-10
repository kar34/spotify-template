Parse.initialize("ylAdm8qMnlL0q73019PIl7tEfi1jcxQe0HZnL10i", "mFapH5QDtUv4Jzn71NW515MBCy3OiSOTUf9H5chE");
var ParseObject = Parse.Object.extend('ParseObject');

var data;
var baseUrl = 'https://api.spotify.com/v1/search?type=track&query='
var myApp = angular.module('myApp', []);

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  
  $scope.audioObject = {};
  
  $scope.getSongs = function() {
    $http.get(baseUrl + $scope.track).success(function(response) {
      data = $scope.tracks = response.tracks.items;      
    })
  };
  
  $scope.play = function(song) {
    if ($scope.currentSong == song) {
      $scope.audioObject.pause();
      $scope.currentSong = false;
      return
    } else {
      if ($scope.audioObject.pause != undefined) $scope.audioObject.pause()
      $scope.audioObject = new Audio(song);
      $scope.audioObject.play();  
      $scope.currentSong = song;
    }
  };

/*
    // displays whether song is explicit
  function isExplicit(explicit) {
    if (explicit)
      $(".results:last-child").append("<p>Explicit</p>");
    else
      $(".results:last-child").append("<p>Clean</p>");
  }

  // calculates duration of song, given ms
  function calculateDuration(duration) {
    var mins = Math.floor(duration / 60000);
    var secs = Math.floor((duration - (mins * 60000)) / 1000);
    var result = "<p id='explicit'>Duration: " + mins + ":" + secs + " </p>";
    $(".results:last-child").append(result);
    addButtons();
  }

  // adds buttons to search result
  function addButtons() {
    var previewButton = "<button class='btn btn-primary' ng-click='play(track.preview_url);'>Preview</button>";
    var playlistButton = "<button class='btn btn-primary' ng-click='addToPlaylist('SOMETHINGGOESHEREEE')'>Add to Favorites</button>";
    $(".results:last-child").append(previewButton);
    $(".results:last-child").append(playlistButton);
  }
*/

  // adds the song to Parse, which stores info about the songs in the playlist
  $scope.addToPlaylist = function(track) {
    var db = new ParseObject();
    db.set("artworkUrl", track.album.images[0].url);  
    db.set("song", track.name);
    db.set("artist", track.artists[0].name);  
    db.set("popularity", track.popularity);
    db.set("url", "http://open.spotify.com/track/" + track.id);
    db.save();
    displayFavs();
  }; 

  // displays playlist contents
  window.onload = function() {
    displayFavs();
  }



  function displayFavs() {
    $("#favoriteslist").html("");
    var search = new Parse.Query(ParseObject);
    search.matches("song", "[\s\S]*");
    search.find({
        success:function(data) {
            for (var n = 0; n < data.length; n++) {
                
                // gets data from parse
                var artworkUrl = data[n].get("artworkUrl");
                var song = data[n].get("song");
                var artist = data[n].get("artist");
                var popularity = data[n].get("popularity");
                var url = data[n].get("url");

                // creates elements
                var div = document.createElement("div");
                $(div).addClass("result");
                var img = document.createElement("img");
                $(img).addClass("imgresult");
                $(img).attr("src", artworkUrl);
                
                var pSong = document.createElement("p");
                $(pSong).html(song);
                var pArtist = document.createElement("p");
                $(pArtist).html(artist);
                var pPopularity = document.createElement("p");
                $(pPopularity).html("Popularity: " + pPopularity + "/100");
                var br = document.createElement("br");

                var a = document.createElement("a");
                $(a).attr("href", url);
                var playButton = document.createElement("button");
                $(playButton).html("Play");
                $(playButton).addClass("btn btn-primary play");                

                // appending
                $(a).append(playButton);
                $(div).append(img);
                $(div).append(pSong);
                $(div).append(pArtist);
                $(div).append("Popularity: " + popularity + "/100");
                $(div).append(br);
                $(div).append(a);
                $("#favoriteslist").append(div);
            }
        }
    })
  }

});

