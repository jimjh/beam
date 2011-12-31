# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/
`
var REGISTER_URL = "/endpoints";
var WEB_SOCKET_SWF_LOCATION = "/vendor/web-socket-js/WebSocketMain.swf";
var SOCKET_URL = "http://smooth-waterfall-8178.herokuapp.com:80/";

/**
 * Registers endpoint UUID with Web Sockets server
 */
var register_socket = function (endpoint_uuid){
  var socket = io.connect (SOCKET_URL);
  socket.on ('connect', function (data) {
    socket.emit ('set uuid', endpoint_uuid);
  });
};

/**
 * Reports current location to server
 */
var report_location = function (position){

  $.ajax(REGISTER_URL, {
    type: 'post',
    data: {
      lat: position.coords.latitude,
      lon: position.coords.longitude
    },
    dataType: 'json',
    success: function (data, textStatus, jqXHR){
      register_socket(data.uuid);
    }
  });

};

// document.ready
$(function() {
  navigator.geolocation.getCurrentPosition (report_location);
});
`