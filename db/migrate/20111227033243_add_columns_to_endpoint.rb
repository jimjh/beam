class AddColumnsToEndpoint < ActiveRecord::Migration
  def change
    change_table( :endpoints ) do |t|
      t.string :name
      t.string :hash
      t.float :lat
      t.float :lon
    end
  end
end
