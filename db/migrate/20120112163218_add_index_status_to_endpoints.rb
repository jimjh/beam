class AddIndexStatusToEndpoints < ActiveRecord::Migration
  def change
    add_index( :endpoints, :status, { :name => "status_index" } )
  end
end
