# TODO: input validation and error handling
class EndpointsController < ApplicationController

  # TODO: need alternative forms of protection
  protect_from_forgery :except => [:deactivate]
  before_filter :check_access
  
  # constants for :status
  ACTIVE = '1'
  INACTIVE = '0'

  # Displays a list of all endpoints
  def index
    # get all endpoints
    @endpoints = Endpoint.all
    respond_to { |format|
      format.html
    }
  end

  # Destroys the specified endpoint.
  # [id]: UUID of endpoint to delete
  #--
  # TODO: probably should remove
  def destroy
    @endpoint = Endpoint.find(params[:id])
    @endpoint.destroy
    respond_to { |format|
      # TODO: json response
      format.html {redirect_to endpoints_url}
    }
  end
  
  # Deactivates the specified endpoint.
  # [id]: UUID of endpoint to deactivate
  def deactivate
    @endpoint = Endpoint.find(params[:id])
    @endpoint.status = INACTIVE
    @endpoint.save
    respond_to { |format|
      # TODO: json response
      format.html {redirect_to endpoints_url}
    }
  end
  
  # Updates the endpoint specified by :id with the given coordinates.
  # Status of endpoint becomes ACTIVE.
  # [id]:   UUID of endpoint to update
  # [lat]:  latitude
  # [lon]:  longitude
  def update
    @endpoint = Endpoint.find(params[:id])
    @endpoint.lat = params[:lat]
    @endpoint.lon = params[:lon]
    @endpoint.status = ACTIVE
    @endpoint.save
    respond_to { |format|
      format.json
    }
  end
  
  # Displays details of the specified endpoint
  # [id]: UUID of endpoint to show
  #--
  # TODO: can I remove this?
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
  
  # Creates an active endpoint with the specified latitude and longitude.
  # [lat]: latitude
  # [lon]: longitude
  #--
  # TODO: how to force AJAX/XHR only?
  def create
    @endpoint = Endpoint.create(
                  :lat => params[:lat],
                  :lon => params[:lon],
                  :status => ACTIVE
                )
    respond_to { |format|
      format.json
    }
  end

end
