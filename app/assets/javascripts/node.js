/**
 * Copyright 2011 Jiunn Haur Lim.
 * All rights reserved.
 * @author <a href="mailto:jim@jh-lim.com">Jiunn Haur Lim</a>
 */
var x = 0;
/**
 * @fileOverview Defines functions for handling node behavior and file uploads.
 */

var Neighbor = function(){

  /** @const Name of node template */
  var NEIGHBOR_TMPL = 'neighbor-tmpl';
  
  /** @const Selector for neighbor elements */
  var NEIGHBOR_SELECTOR = '.neighbor';
  
  /** @const URL on app server to request a new Amazon upload policy */
  var POLICY_CREATE_URL = "/uploads";
  
  var FILE_UPLOAD_OPTIONS = {
      
    forceIframeTransport: true,
    autoUpload: true,
    add: function (event, data) {
  
      var form = $(data.form[0]);
    
      $.ajax({
      
        url: POLICY_CREATE_URL,
        type: 'POST',
        dataType: 'json',
        data: {doc: {title: data.files[0].name},
              target_id: form.data('target-uuid')},
        async: false,
        
        // TODO: error handling and validation
        success: function (doc){
    
          form.find('input[name=key]').val(doc.key);
          form.find('input[name=AWSAccessKeyId]').val(doc.aws);
          form.find('input[name=success_action_redirect]').val(doc.redirect);
          form.find('input[name=policy]').val(doc.policy);
          form.find('input[name=signature]').val(doc.signature);
          
          // submit file and policy to Amazon S3
          data.submit();
          
        }
        
      });
      
    },
    
    send: function(e, data) {
      // TODO
    },
    
    fail: function(e, data) {
      // TODO
    },
    
    done: function (event, data) {
      // TODO
    }
    
  };
  
  /**
   * Retrieves an array of DOM elements repesenting neighbors on our radar.
   */
  var all = function (){
    return $(NEIGHBOR_SELECTOR);
  };

  //////////////// PUBLIC ////////////////
  return {
    TEMPLATE: NEIGHBOR_TMPL,
    FILE_UPLOAD_OPTIONS: FILE_UPLOAD_OPTIONS,
    all: all
  };

}();

/**
 * Nodify widget. Adds node behavior.
 */
(function ($) {

  $.widget('beam.nodify', {
  
    options: {
      fileUploadOptions: Neighbor.FILE_UPLOAD_OPTIONS
    },
    
    _setOption: function( key, value ) {
      this._super( "_setOption", key, value );
    },
  
    _create: function(){
    
      var options = this.options;
      
      // initialize file upload widget
      this.element.fileupload(options.fileUploadOptions);
    
    },
 
    destroy: function() {
    }
    
  });

}(jQuery));
  
  
// document.ready
$(function() {
  Neighbor.all().nodify();
});