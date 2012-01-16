require 'uuid_helper'

# @attr uuid      unique UUID of endpoint
# @attr lat       latitude
# @attr lon       longitude
# @attr updated   date this endpoint was last updated
# @attr status    status of endpoint (either {ACTIVE} or {INACTIVE})
# @author Jiunn Haur Lim <jim@jh-lim.com>
class Endpoint < ActiveRecord::Base
  
  include UUIDHelper 
  
  before_create( :init_uuid )
  set_primary_key( :uuid )
  
  # Constant for {#status}. Should have been an enum, but this is easier to deal
  # with for now.
  ACTIVE = '1'
  # Constant for {#status}
  INACTIVE = '0'
  
  # Returns string representation of this endpoint
  def to_s
    return "#<uuid:#{self.uuid}, " + 
           "lat:#{self.lat}, lon:#{self.lon}, " + 
           "updated:#{self.updated_on}, status:#{self.status}>"
  end

end
