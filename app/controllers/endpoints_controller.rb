# Endpoints Controller.
# Deals with creating, destroying, and deactivating endpoints.
# @author Jiunn Haur Lim <jim@jh-lim.com>
class EndpointsController < ApplicationController

  protect_from_forgery :except => [:deactivate]
  # [TODO]: remove for release
  before_filter :check_access

  # Displays a list of all active endpoints. Creates an endpoint for the user
  # if he was not already associated with one.
  # @example GET /endpoints
  def index
  
    # check for endpoint ID, create if not available
    if (cookies[:endpoint_id].nil?)
      cookies[:endpoint_id] = {
        :value => create,
        :expires => 1.day.from_now
      }
    end
  
    # get all active endpoints
    @endpoints = Endpoint.where(:status => Endpoint::ACTIVE)
    
    respond_to { |format|
      format.html
    }
    
  end
  
  # Deactivates the specified endpoint. Does nothing if the endpoint was
  # already inactive.
  # [TODO]: security
  # - If the UUID is missing, returns +400+
  # - If the endpoint was not found, returns +404+
  # - If the endpoint was found but _not_ _modified_, returns +302+
  # - If the endpoint was found and _modified_, returns +200+
  # @param [String] id UUID of endpoint to deactivate
  # @example DELETE /endpoints/<uuid>/deactivate
  def deactivate
  
    return head :bad_request if params[:id].nil?
  
    begin
    
      # find endpoint
      @endpoint = Endpoint.find(params[:id])
      if (Endpoint::INACTIVE == @endpoint.status)
        # if already inactive, do nothing
        return head :found
      end
      # otherwise, set status to inactive and save
      @endpoint.status = Endpoint::INACTIVE
      @endpoint.save
      return head :ok
      
    rescue ActiveRecord::RecordNotFound => e
      # missing endpoint
      logger.warn e.message
      raise ActionController::RoutingError.new(
        "Endpoint with uuid=#{params[:id]} was not found."
      )
    end
    
  end
  
  # Updates the current endpoint with the given coordinates. "Current endpoint"
  # refers to the endpoint associated with the current session.
  # Status of endpoint becomes {Endpoint::ACTIVE}.
  # - All parameters are required; returns +400+ if any of them are missing
  # - If endpoint was not found, returns +404+
  # - Otherwise, returns +200+
  # @param [float]  lat  latitude
  # @param [float]  lon  longitude
  # @example PUT /endpoints/<uuid>
  def update
  
    return head :bad_request if(  params[:lat].nil? or
                                  params[:lon].nil? )
  
    begin
    
      # find endpoint
      @endpoint = Endpoint.find(cookies[:endpoint_id])
      
      @endpoint.lat = params[:lat]
      @endpoint.lon = params[:lon]
      @endpoint.status = Endpoint::ACTIVE
      
      @endpoint.save
      
      return head :ok
      
    rescue ActiveRecord::RecordNotFound => e
      # missing endpoint, so create new one and reset session
      @endpoint = Endpoint.create(
                  :lat => params[:lat],
                  :lon => params[:lon],
                  :status => Endpoint::ACTIVE
                )
      cookies.delete(:endpoint_id)
      cookies[:endpoint_id] = @endpoint.id
      return head :ok
    end
    
  end

  # development only: closes off this entire controller
  def check_access
    authenticate_or_request_with_http_basic { |user_name, password|
      user_name == "codex" && password == "abc"
    }
  end
  
  private
  
  # Creates an active endpoint.
  # @return [String] ID of endpoint
  def create
    endpoint = Endpoint.create(
                  :lat => 0,
                  :lon => 0,
                  :status => Endpoint::ACTIVE
                )
    return endpoint.id
  end

end
