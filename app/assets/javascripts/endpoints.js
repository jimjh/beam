/**
 * @fileOverview This file contains functions for handling the user's location,
 * registering endpoints, and creating web sockets.
 * @author <a href="mailto:jim@jh-lim.com">Jiunn Haur Lim</a>
 */
 
/**
 * @namespace Contains functions for registering endpoints and creating web
 * sockets.
 */
var Loader = function (){

  /** @const URL on app server to create endpoint */
  const ENDPOINT_CREATE_URL = '/endpoints';
  /** @const URL on app server to update endpoint */
  const ENDPOINT_UPDATE_URL = '/endpoints';
  /** @const URL on node server to register web sockets */
  const SOCKET_URL = 'http://beam-node.nodester.com/';
  // const SOCKET_URL = 'http://smooth-waterfall-8178.herokuapp.com:80/';
  
  /** @const Name of cookie for endpoint UUID */
  const COOKIE_UUID = 'endpoint_uuid';
  /** @const General options for creating cookies */
  const COOKIE_OPTIONS = {expires: 365, path: '/' };
  
  /**
   * Entry point - called when a location is retrieved.
   *
   * Checks if an endpoint UUID is available in the cookie. If available,
   * updates the server with <tt>position</tt>; otherwise, creates a new
   * endpoint on the server with <tt>position</tt>.
   *
   * Finally, registers UUID with the websocket server.
   *
   * @public
   * @param {Position} position     position returned from W3 geolocation
   *                                functions
   */
  var init = function (position){
  
    // checks if the UUID is available in the cookie
    var endpoint_uuid = $.cookie(COOKIE_UUID);
    if (null == endpoint_uuid){
      // if not available, create and store UUID in cookie
      create_endpoint(position, function(endpoint_uuid){
        $.cookie(COOKIE_UUID, endpoint_uuid, COOKIE_OPTIONS);
        register_socket(endpoint_uuid);
      });
    }else {
      // else, update endpoint with location
      update_endpoint(endpoint_uuid, position, function(endpoint_uuid){
        register_socket(endpoint_uuid);
      });
    }
    
  };
  
  /**
   * Error handler - called when geolocation fails.
   * @public
   */
  var no_location = function (p){
    p = p || "";
    // TODO: some sort of "your browser is not supported?
  }
  
  /**
   * Creates a new endpoint on the app server
   * @param {Position}    position        position returned from W3 geolocation
   * @param {Coordinates} position.coords location coordinates
   * @param {function(UUID)}
   *                      callback        callback on XHR success
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
   * @param {UUID}      endpoint_uuid   uuid of endpoint to update
   * @param {Position}  position        position returned from W3 geolocation
   * @param {Coordinates} position.coords location coordinates
   * @param {function(UUID)}
   *                    callback        callback on XHR success
   * @param {Number}    retry_count     number of times this call has been retried
   */
  var update_endpoint = function (endpoint_uuid, position,
                                  callback, retry_count){
  
    retry_count = retry_count || 0;
  
    $.ajax(ENDPOINT_UPDATE_URL + '/' + endpoint_uuid, {
      type: 'put',
      data: {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      },
      dataType: 'json',
      success: function (data, textStatus, jqXHR){
        // TODO
        callback (endpoint_uuid);
      },
      error: function (jqXHR, textStatus, errorThrown){
      
        // if non-fatal, just retry
        if ((retry_count < 4) &&
            (null == textStatus ||
            'timeout' == textStatus ||
            'abort' == textStatus)){
            update_endpoint (endpoint_uuid, position,
                             callback, retry_count++);
            return;
        }
        
        // otherwise, delete cookie and re-initialize
        $.cookie(COOKIE_UUID, null, COOKIE_OPTIONS);
        init(position);
        
      }
    });
  
  }
  
  /**
   * Registers endpoint UUID with web sockets server
   * @param {UUID} endpoint_uuid    UUID of endpoint associated with this user
   */
  var register_socket = function (endpoint_uuid){
    var socket = io.connect (SOCKET_URL);
    socket.on ('connect', function (data) {
      socket.emit ('set uuid', endpoint_uuid);
    });
  };
  
  return {
    init: init,
    no_location: no_location
  };
  
}();

// document.ready
$(function() {
  // do not use high accuracy -> unstable
  if(geo_position_js.init()){
    geo_position_js.getCurrentPosition(Loader.init, Loader.no_location);
  }else Loader.no_location();
});