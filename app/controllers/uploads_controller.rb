class UploadsController < ApplicationController

  # create security policy for amazon S3
  def create
    @document = {
      :key => params[:doc][:title],
      :policy => s3_upload_policy, 
      :signature => s3_upload_signature, 
      :aws => ENV['S3_KEY'],
      :redirect => SUCCESS_REDIRECT
    }
    respond_to { |format|
      format.json
    }
  end
 
  private
  
  SUCCESS_REDIRECT = ""
  
  # generate the policy document that amazon is expecting.
  def s3_upload_policy
    return @policy if @policy
    ret = {"expiration" => 5.minutes.from_now.utc.xmlschema,
      "conditions" =>  [ 
        {"bucket" =>  "beam"}, 
        ["starts-with", "$key", ""],
        {"acl" => "private"},
        {"success_action_status" => "200"},
        {"success_action_redirect"=> SUCCESS_REDIRECT},
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