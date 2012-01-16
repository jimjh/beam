/**
 * Copyright 2011 Jiunn Haur Lim.
 * All rights reserved.
 * @author <a href="mailto:jim@jh-lim.com">Jiunn Haur Lim</a>
 */
var x = 0;
/**
 * @fileOverview This file contains functions for handling file uploads.
 */
 
/** 
 * @namespace Contains functions for handling file uploads.
 */
 
var Uploader = function (){

  /** @const Selector for forms that use fileupload plugin */
  var FORM_SELECTOR = ".fileupload";
  
  /** @const URL to create a new Amazon upload policy */
  var POLICY_CREATE_URL = "/uploads";

  /**
   * Entry point - called when page is ready. Initializes the file upload
   * plugin.
   * @public
   */
  var init = function (){
  
    var forms = $(FORM_SELECTOR);
    
    // initialize
    forms.fileupload ({
    
      forceIframeTransport: true,
      autoUpload: true,
      
      add: function (event, data) {

        var form = $(data.form[0]);

        $.ajax({
        
          url: POLICY_CREATE_URL,
          type: 'POST',
          dataType: 'json',
          data: {doc: {title: data.files[0].name},
                target_id: form.data("target-uuid")},
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
      }/*,
      
      done: function (event, data) {
        // TODO
      }*/
      
    });
    
  }
  
  return {
    init : init
  };

}();

// document.ready
$(function() {
  Uploader.init();
});