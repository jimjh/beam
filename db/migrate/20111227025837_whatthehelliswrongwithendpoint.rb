class Whatthehelliswrongwithendpoint < ActiveRecord::Migration
  def change
    drop_table :endpoints
    create_table(:endpoints, :primary_key => 'uuid') do |t|
      t.column :uuid, :string, :limit => 36
    end
  end
end
