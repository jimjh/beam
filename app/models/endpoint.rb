require 'uuid_helper'

class Endpoint < ActiveRecord::Base
   
  before_create :init_uuid
  include UUIDHelper

  #set_primary_key( :uuid )

end
