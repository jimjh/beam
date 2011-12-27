class AddTimestampToEndpoint < ActiveRecord::Migration
  def change
    change_table( :endpoints ) do |t|
      t.timestamp :updated_on
      t.timestamp :created_on
    end
  end
end
