class UploadsController < ApplicationController

  # create security policy for amazon S3
  def create
    @redirect = SOCKET_URL + '/' + params[:target_uuid]
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
  
  SOCKET_URL = 'http://beam-node.nodester.com/transfer';
  BUCKET_NAME = 'beam';
  BUCKET_HOST = BUCKET_NAME + '.s3.amazonaws.com';
  # SOCKET_URL = 'http://localhost:13359'
  
  # generate the policy document that amazon is expecting.
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
        # TODO: limit content-length?
        ["content-length-range", 0, 1048576]
      ]
    }
    @policy = Base64.encode64(ret.to_json).gsub("\n","")
    return @policy
  end

  # sign our request by Base64 encoding the policy document.
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