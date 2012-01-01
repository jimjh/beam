/**
 * @author <a href="mailto:jim@jh-lim.com">Jiunn Haur Lim</a>
 */

// URL of SWF fallback
var WEB_SOCKET_SWF_LOCATION = '/vendor/web-socket-js/WebSocketMain.swf';
 
var Loader = function (){

  // URL on app server to create endpoint
  var ENDPOINT_CREATE_URL = '/endpoints';
  // URL on app server to update endpoint
  var ENDPOINT_UPDATE_URL = '/endpoints';
  // URL on node server to register web sockets
  var SOCKET_URL = 'http://smooth-waterfall-8178.herokuapp.com:80/';
  
  var COOKIE_UUID = 'endpoint_uuid';
  
  /**
   * Entry point - called when a location is retrieved.
   *
   * Checks if an endpoint UUID is available in the cookie. If available,
   * updates the server with <tt>position</tt>; otherwise, creates a new
   * endpoint on the server with <tt>position</tt>.
   *
   * Finally, registers UUID with the websocket server.
   */
  var init = function (position){
  
    // checks if the UUID is available in the cookie
    var endpoint_uuid = $.cookie(COOKIE_UUID);
    if (null == endpoint_uuid){
      // if not available, create and store UUID in cookie
      endpoint_uuid =
        create_endpoint(position, function(endpoint_uuid){
          $.cookie(COOKIE_UUID, endpoint_uuid, {expires: 365, path: '/' });
          register_socket(endpoint_uuid);
        });
    }else {
      // update endpoint with location
      update_endpoint(endpoint_uuid, position);
      register_socket(endpoint_uuid);
    }
    
  };
  
  /**
   * Creates a new endpoint on the app server
   * @param position        location coordinates
   * @param callback        callback on XHR success
   */
  var create_endpoint = function (position, callback){
    
    $.ajax(ENDPOINT_CREATE_URL, {
      type: 'post',
      data: {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      },
      dataType: 'json',
      success: function (data, textStatus, jqXHR){
        callback(data.uuid);
      }
    });
  
  };
  
  /**
   * Updates endpoint on app server with location coordinates
   * @param endpoint_uuid   uuid of endpoint to update
   * @param position        location coordinates
   */
  var update_endpoint = function (endpoint_uuid, position){
  
    $.ajax(ENDPOINT_UPDATE_URL + '/' + endpoint_uuid, {
      type: 'put',
      data: {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      },
      dataType: 'json',
      success: function (data, textStatus, jqXHR){
        // TODO
      }
    });
  
  }
  
  /**
   * Registers endpoint UUID with web sockets server
   */
  var register_socket = function (endpoint_uuid){
    var socket = io.connect (SOCKET_URL);
    socket.on ('connect', function (data) {
      socket.emit ('set uuid', endpoint_uuid);
    });
  };
  
  return {
    init: init
  };
  
}();

// document.ready
$(function() {
  navigator.geolocation.getCurrentPosition (Loader.init);
});