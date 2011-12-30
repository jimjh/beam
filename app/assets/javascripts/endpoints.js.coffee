# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/
`
var REGISTER_URL = "/endpoints";

var init_pusher = function (){

  // Enable pusher logging - don't include this in production
  Pusher.log = function(message) {
    if (window.console && window.console.log) window.console.log(message);
  };

  // Flash fallback logging - don't include this in production
  WEB_SOCKET_DEBUG = true;

  pusher = new Pusher('73b24d21001257fdf1db');
  var channel = pusher.subscribe('test_channel');
  channel.bind('my_event', function(data) {
    alert(data);
  });
  
}

/**
 * Reports current location to server
 */
var report_location = function (position){

  $.ajax(REGISTER_URL, {
    type: 'post',
    data: {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      socket_id: pusher.connection.socket_id
    }
  });

};

// document.ready
$(function() {
  init_pusher ();
  navigator.geolocation.getCurrentPosition (report_location);
});
`