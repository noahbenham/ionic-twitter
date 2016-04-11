// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ionic_twitter', ['ionic', 'ngCordova', 'ngCordovaOauth'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    console.log("Running...");
    //console.log("Cordova plugins JSON: " + JSON.stringify(window.cordova.plugins));
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    /*if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }*/
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.controller('TwitterCtrl', ['$scope','$cordovaOauth','$cordovaOauthUtility','$http','$ionicPlatform', function ($scope,$cordovaOauth,$cordovaOauthUtility,$http,$ionicPlatform) {
  $scope.screen_name = "My Twitter";

  $scope.convertTwitterDate = function(tdate) {
    var system_date = new Date(Date.parse(tdate));
    var user_date = new Date();
    if (KWidget.ie) {
      system_date = Date.parse(tdate.replace(/( \+)/, ' UTC$1'))
    }
    var diff = Math.floor((user_date - system_date) / 1000);
    if (diff <= 1) {return "just now";}
    if (diff < 20) {return diff + " seconds ago";}
    if (diff < 40) {return "half a minute ago";}
    if (diff < 60) {return "less than a minute ago";}
    if (diff <= 90) {return "one minute ago";}
    if (diff <= 3540) {return Math.round(diff / 60) + " minutes ago";}
    if (diff <= 5400) {return "1 hour ago";}
    if (diff <= 86400) {return Math.round(diff / 3600) + " hours ago";}
    if (diff <= 129600) {return "1 day ago";}
    if (diff < 604800) {return Math.round(diff / 86400) + " days ago";}
    if (diff <= 907200) {return "1 week ago";}
    if (diff < 2419200) {return Math.round(diff / 604800) + " weeks ago";}
    if (diff <= 3945000) {return "1 month ago";}
    if (diff < 31536000) {return Math.round(diff / 2628000) + " months ago";}
    else {return "Over a year ago";}
  }

  // from http://widgets.twimg.com/j/1/widget.js
  var KWidget = function () {
    var a = navigator.userAgent;
    return {
      ie: a.match(/MSIE\s([^;]*)/)
    }
  }();

  $scope.twitterLogin = function(){
    console.log("twitterLogin function got called..");
    $cordovaOauth.twitter("XgJZmrnSqycxVipO9EaEYmToW", "wkbp85NxRwjmYZjE2upIpPozK9DmdQSVxn9nLxCmEc8oRFK3Sp").then(function(result) {
      console.log("JSON: " + JSON.stringify(result));

      // var storedToken = angular.fromJson(window.localStorage.getItem("twitterKey"));
      // var oauth_token = null;
      // if (storedToken !== null) {
      //   oauth_token = storedToken;
      // } else { // store new token
      //   oath_token = result.oauth_token;
      //   window.localStorage.setItem("twitterKey", JSON.stringify(result.oath_token));
      // }

      var oath_token = result.oauth_token;
      var oauth_token_secret = result.oauth_token_secret;
      var user_id = result.user_id;
      var screen_name = result.screen_name;

      // Access profile info from twitter
      var oauthObject = {
            oauth_consumer_key: "XgJZmrnSqycxVipO9EaEYmToW",
            oauth_nonce: $cordovaOauthUtility.createNonce(10),
            oauth_signature_method: "HMAC-SHA1",
            oauth_token: result.oauth_token,
            oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
            oauth_version: "1.0"
        };
        var signatureObj = $cordovaOauthUtility.createSignature("GET", "https://api.twitter.com/1.1/statuses/user_timeline.json", oauthObject, {screen_name:result.screen_name}, "wkbp85NxRwjmYZjE2upIpPozK9DmdQSVxn9nLxCmEc8oRFK3Sp", result.oauth_token_secret);
        console.log("Generating signature");
        $http.defaults.headers.common.Authorization = signatureObj.authorization_header;
        $http.get("https://api.twitter.com/1.1/statuses/user_timeline.json",
               {params: { screen_name: result.screen_name}})
      .success(function(response) {
                console.log("Success, response: " + JSON.stringify(response));
                $scope.tweets = response;
                $scope.screen_name = screen_name;
                $scope.user.profile_image_url = response;
      })
     .error(function(error) {
              console.log("ERROR: " + error);
              alert(error);
      });
    }, function(error) {
      console.log("ERROR: " + error);
    });

  }

}])
