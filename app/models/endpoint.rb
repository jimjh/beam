require 'uuid_helper'

class Endpoint < ActiveRecord::Base
  
  include UUIDHelper 
  
  before_create( :init_uuid )
  set_primary_key( :uuid )
  
  def to_s
    return "#<uuid:#{self.uuid}, lat:#{self.lat}, lon:#{self.lon}, updated:#{self.updated_on}>"
  end

end
