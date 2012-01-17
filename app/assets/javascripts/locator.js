/**
 * Copyright 2011 Jiunn Haur Lim.
 * All rights reserved.
 * @author <a href="mailto:jim@jh-lim.com">Jiunn Haur Lim</a>
 */
var x = 0;
/**
 * @fileOverview This file contains functions for handling the user's location,
 * registering endpoints, and creating web sockets.
 */
 
/** 
 * @namespace Contains functions for registering endpoints and creating web
 * sockets.
 */
var Locator = function (){

  /** @const URL on app server to create endpoint (POST) */
  var ENDPOINT_CREATE_URL = '/endpoints';
  /** @const URL on app server to update endpoint (PUT) */
  var ENDPOINT_UPDATE_URL = '/endpoints';
  /** @const Name of cookie where we store our endpoint ID */
  var COOKIE_UUID = 'endpoint_id';
  
  /** @const Name of event for registering UUID */
  var EVT_SET_UUID = 'set uuid';
  /** @const Name of event for file download notification */
  var EVT_GET_FILE = 'get file';
  
  /**
   * Entry point - called when a location is retrieved. Updates server
   * with <tt>position</tt> and registers UUID with the websocket server.
   *
   * @public
   * @param {Position} position     position returned from W3 geolocation
   *                                functions
   */
  var init = function (position){
  
    if (!position){
      no_location();    // defensively protect against bogus calls
      return;
    }
    
    var endpoint_uuid = $.cookie(COOKIE_UUID);
    
    if (!endpoint_uuid){
      // TODO: ask user to enable cookies
      console.log ("Missing cookie!");
      return;
    }
    
    // update endpoint with location
    update_endpoint(endpoint_uuid, position, function(){
      // server may have changed endpoint ID
      var endpoint_uuid = $.cookie(COOKIE_UUID);
      if (endpoint_uuid) register_socket(endpoint_uuid);
    });
    
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
   * Updates endpoint on app server with location coordinates
   * @param {UUID}      endpoint_uuid   uuid of endpoint to update
   * @param {Position}  position        position returned from W3 geolocation
   * @param {Coordinates} position.coords location coordinates
   * @param {function()}
   *                    callback        callback on XHR success
   * @param {Number}    retry_count     number of times this call has been retried
   */
  var update_endpoint = function (endpoint_uuid, position,
                                  callback, retry_count){
  
    if (!endpoint_uuid ||
        !position ||
        !callback){
      // stomp our feet and cry - we will at least get a "console is not defined."
      console.log ("endpoint, position, and callback may not be undefined/null.");
      return;
    }
  
    retry_count = retry_count || 0;
    if (retry_count >= 5) return;   // TODO: random retries like Gmail
  
    var error_handler =
      function (jqXHR, textStatus, errorThrown){
      
        // if non-fatal, just retry
        if (null == textStatus ||
            'timeout' == textStatus ||
            'abort' == textStatus){
            update_endpoint (endpoint_uuid, position,
                             callback, retry_count++);
            return;
        }
        
        // TODO: random retries like Gmail
        
      };
      
    var success_handler = 
      function (data, textStatus, jqXHR){
        callback ();
      };
  
    $.ajax(ENDPOINT_UPDATE_URL + '/' + endpoint_uuid, {
      type: 'put',
      data: {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      },
      success: success_handler,
      error: error_handler
    });
  
  }
  
  /**
   * Registers endpoint UUID with web sockets server
   * @param {UUID} endpoint_uuid    UUID of endpoint associated with this user
   */
  var register_socket = function (endpoint_uuid){
  
    if (!endpoint_uuid){
      // stomp our feet and cry - we will at least get a "console is not defined."
      console.log ("endpoint_uuid may not be undefined/null.");
      return;
    }
  
    var socket = io.connect (SOCKET_URL);
    socket.on ('connect', function (data) {
    
      socket.emit (EVT_SET_UUID, endpoint_uuid);
      
      socket.on (EVT_GET_FILE, function(query){
        console.log (query);
        $('<iframe style="display:none;"></iframe>')
          .prop('src', query)
          .appendTo(document.body);
      });
      
      // init radar
      Radar.onConnected(socket);
      
    });
    
  };
  
  //////////////// PUBLIC ////////////////
  return {
    init: init,
    no_location: no_location
  };
  
}();

// document.ready
$(function() {
  // do not use high accuracy -> unstable
  if(geo_position_js.init()){
    geo_position_js.getCurrentPosition(Locator.init, Locator.no_location);
  }else Locator.no_location();
});