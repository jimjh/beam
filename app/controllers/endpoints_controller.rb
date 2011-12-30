class EndpointsController < ApplicationController

  before_filter :check_access

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
    authenticate_or_request_with_http_basic { |user_name, password|
      # Change these to username and password required
      user_name == "codex" && password == "abc"
    }
  end
  
  # register an endpoint (AJAX)
  def create
    @endpoint = Endpoint.create(
                  :lat => params[:lat],
                  :lon => params[:lon]
                )
    respond_to { |format|
      format.json {render :json => ""}
    }
  end

end
