class CreateEndpoints < ActiveRecord::Migration
  def change
    create_table :endpoints, :id => false do |t|
      t.string :id, :limit => 36, :primary =>  true
      t.string :name
      t.binary :hash
      t.float :lon
      t.float :lat

      t.timestamps
    end
  end
end
