class MakePrimaryKeyInEndpoint < ActiveRecord::Migration
  def change
    drop_table :endpoints
    create_table :endpoints do |t|
      t.string :uuid, :limit => 36, :primary => true
    end
  end
end
