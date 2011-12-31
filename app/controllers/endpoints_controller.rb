class EndpointsController < ApplicationController

  protect_from_forgery :except => [:destroy, :index]

  # displays a list of all endpoints
  def index
    # get all endpoints
    @endpoints = Endpoint.all
    respond_to { |format|
      format.html
    }
  end

  # destroys the specified endpoint
  # [id]: UUID of endpoint to delete
  def destroy
    @endpoint = Endpoint.find(params[:id])
    @endpoint.destroy
    respond_to { |format|
      format.html {redirect_to endpoints_url}
    }
  end
  
  # displays details of the specified endpoint
  # [id]: UUID of endpoint to show
  def show
    @endpoint = Endpoint.find(params[:id])
    respond_to { |format|
      format.html
    }
  end 

  # development only: closes off this entire controller
  def check_access
    authenticate_or_request_with_http_basic { |user_name, password|
      user_name == "codex" && password == "abc"
    }
  end
  
  # register an endpoint with the specified latitude and longitude
  # [lat]: latitude
  # [lon]: longitude
  # TODO: how to force AJAX/XHR only?
  def create
    @endpoint = Endpoint.create(
                  :lat => params[:lat],
                  :lon => params[:lon]
                )
    respond_to { |format|
      format.json
    }
  end

end
