require 'rubygems'
require 'uuidtools'

module UUIDHelper
  def init_uuid ()
    self.uuid = UUIDTools::UUID.timestamp_create.to_s
  end
end
