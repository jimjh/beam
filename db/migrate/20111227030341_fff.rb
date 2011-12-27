class Fff < ActiveRecord::Migration
  def change
    drop_table :endpoints
    create_table( :endpoints, :id => false ) do |t|
      t.string( :uuid, :limit => 36 )
    end
    add_index( :endpoints, :uuid, :unique => true )
  end
end
