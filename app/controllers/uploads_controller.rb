# Uploads Controller.
# Deals with security policies for Amazon S3.
# @author Jiunn Haur Lim <jim@jh-lim.com>
class UploadsController < ApplicationController

  # Creates security policy for Amazon S3.
  # - If any of the parameters are missing, return +400+
  # - Otherwise, creates security policy and returns it in a JSON (along with
  #   signature etc.)
  # @params [String] target_id   ID of target endpoint
  # @params [Map]    doc         map containing +:title+
  # @example POST /uploads
  def create
  
    return head :bad_request if( params[:target_id].nil? or
                                 params[:doc].nil? or
                                 params[:doc][:title].nil? or
                                 cookies[:endpoint_id].nil?)
  
    # transfer/source/target
    @redirect = "#{SOCKET_URL}/#{cookies[:endpoint_id]}/#{params[:target_id]}"
    @document = {
      :key => params[:doc][:title],
      :policy => s3_upload_policy, 
      :signature => s3_upload_signature, 
      :aws => ENV['S3_KEY'],
      :redirect => @redirect
    }
    
    respond_to { |format|
      format.json
    }
    
  end
 
  private
  
  # URL of web sockets server to redirect user to
  SOCKET_URL = ENV['BEAM_SOCKET_TRANSFER_URL'];
  # Name of Amazon S3 bucket
  BUCKET_NAME = 'beam';
  # Virtual host of Amazon S3 bucket
  BUCKET_HOST = BUCKET_NAME + '.s3.amazonaws.com';
  
  # Generate the policy document that Amazon is expecting.
  def s3_upload_policy
    return @policy if @policy
    ret = {"expiration" => 5.minutes.from_now.utc.xmlschema,
      "conditions" =>  [ 
        {"bucket" =>  BUCKET_NAME}, 
        {"Content-Type" => "binary/octet-stream"},
        ["starts-with", "$key", ""],
        {"acl" => "private"},
        {"success_action_status" => "200"},
        {"success_action_redirect"=> @redirect},
        # [TODO]: limit content-length?
        ["content-length-range", 0, 1048576]
      ]
    }
    @policy = Base64.encode64(ret.to_json).gsub("\n","")
    return @policy
  end

  # Sign our request by Base64 encoding the policy document.
  def s3_upload_signature
    signature =
      Base64.encode64(
        OpenSSL::HMAC.digest(
          OpenSSL::Digest::Digest.new('sha1'),
          ENV['S3_SECRET'],
          s3_upload_policy)
      ).gsub("\n","")
  end

end