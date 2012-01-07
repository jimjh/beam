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

  /** @const ID of hook for fileupload plugin */
  const HOOK_ID = "#fileupload";
  
  /** @const URL to create a new Amazon upload policy */
  const POLICY_CREATE_URL = "/uploads";

  /**
   * Entry point - called when page is ready. Initializes the file upload
   * plugin.
   * @public
   */
  var init = function (){
  
    var hook = $(HOOK_ID);
    
    // initialize
    hook.fileupload ({
    
      forceIframeTransport: true,
      autoUpload: true,
      
      add: function (event, data) {
        $.ajax({
        
          url: POLICY_CREATE_URL,
          type: 'POST',
          dataType: 'json',
          data: {doc: {title: data.files[0].name},
                target_uuid: data.form[0].target_uuid.value},
          async: false,
          
          // TODO: error handling and validation
          success: function (doc){
    
            $(HOOK_ID).find('input[name=key]').val(doc.key);
            $(HOOK_ID).find('input[name=AWSAccessKeyId]').val(doc.aws);
            $(HOOK_ID).find('input[name=success_action_redirect]').val(doc.redirect);
            $(HOOK_ID).find('input[name=policy]').val(doc.policy);
            $(HOOK_ID).find('input[name=signature]').val(doc.signature);
            
            // submit file and policy to Amazon S3
            data.submit();
            
          }
          
        });
        
      },
      
      send: function(e, data) {
        // TODO
        console.log ("sending...");
        // $('#loading').show();
      },
      
      fail: function(e, data) {
        // TODO
        console.log('fail');
        console.log(data);
      },
      
      done: function (event, data) {
        console.log ("done");
        // TODO
        // $('#loading').hide();
      }
      
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