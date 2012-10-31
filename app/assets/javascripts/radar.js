/**
 * Copyright 2011 Jiunn Haur Lim.
 * All rights reserved.
 * @author <a href="mailto:jim@jh-lim.com">Jiunn Haur Lim</a>
 */
var x = 0;
/**
 * @fileOverview This file contains functions for real-time neighbor updates.
 */
 
/** 
 * @namespace Contains functions for real-time neighbor updates.
 */
var Radar = function (){

  /** @const Name of event for a new neighbor */
  var EVT_NEIGHBOR_ARRIVED = "neighbor arrived";
  
  /** @const Name of event for a leaving neighbor */
  var EVT_NEIGHBOR_LEFT =  "neighbor left";
  
  /** @const Selector of node container */
  var CONTAINER_SELECTOR = '#neighbor-container';
  
  var origin = undefined;

  /**
   * Entry point - called when websockets have been registered and after
   * a location fix has been obtained. Listens for neighbor additions and
   * removals.
   * @param {Socket}    socket.io web socket
   * @param {Position}  geolocation fix
   * @public
   */
  var init = function (socket, center){
  
    if (!socket || !center){
      // TODO: error handling
      return;
    }
    
    // listen for neighbor arrival
    socket.on (EVT_NEIGHBOR_ARRIVED, function(arrival){
    
      if (!arrival){
        // TODO: error handling
        return;
      }
      
      var node = $(tmpl(Neighbor.TEMPLATE, arrival)).nodify();
      node.appendTo($(CONTAINER_SELECTOR));
      
    });
    
    // listen for neighbor departure
    socket.on (EVT_NEIGHBOR_LEFT, function(departure){
      
      if (!departure){
        // TODO: error handling
        return;
      }
      
      if (document.getElementById(departure.id)){
        $('#' + departure.id).remove();
      }
      
    });
    
    // position nodes
    origin = {lat: center.coords.latitude, lon: center.coords.longitude};
    console.log (origin);
  
  };

  //////////////// PUBLIC ////////////////
  return {
    onConnected: init
  };

}();

