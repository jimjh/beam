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
  
  var NODE_TMPL = 'node-tmpl';
  var NODE_CONTAINER = '#node-container';
  
  /** @const Selector for forms that use fileupload plugin */
  var FORM_SELECTOR = ".fileupload";

  /**
   * Entry point - called when websockets have been registered. Listens
   * for neighbor additions and removals.
   * @param {Socket}  socket.io web socket
   * @public
   */
  var init = function (socket){
  
    if (!socket){
      // TODO: error handling
      return;
    }
    
    socket.on (EVT_NEIGHBOR_ARRIVED, function(arrival){
    
      if (!arrival){
        // TODO: error handling
        return;
      }
      
      var node = $(tmpl(NODE_TMPL, arrival));
      Uploader.register(node.find(FORM_SELECTOR));
      node.appendTo($(NODE_CONTAINER));
      
    });
    
    socket.on (EVT_NEIGHBOR_LEFT, function(departure){
      
      if (!departure){
        // TODO: error handling
        return;
      }
      
      if (document.getElementById(departure.id)){
        $('#' + departure.id).remove();
      }
      
    });
  
  };

  //////////////// PUBLIC ////////////////
  return {
    onConnected: init
  };

}();

