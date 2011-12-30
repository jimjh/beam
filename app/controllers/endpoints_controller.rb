class EndpointsController < ApplicationController

  def index
    # get all endpoints
    @endpoints = Endpoint.all
    respond_to { |format|
      format.html
    }
  end

  def destroy
    @endpoint = Endpoint.find(params[:id])
    @endpoint.destroy
    respond_to { |format|
      format.html {redirect_to endpoints_url}
    }
  end
  
  def show
    @endpoint = Endpoint.find(params[:id])
    respond_to { |format|
      format.html
    }
  end 

  def check_access
    authenticate_or_request_with_http_basic do |user_name, password|
    # Change these to username and password required
    user_name == "codex" && password == "abc"
  end

end
