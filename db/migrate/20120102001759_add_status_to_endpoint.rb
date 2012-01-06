class AddStatusToEndpoint < ActiveRecord::Migration
  def change
    change_table(:endpoints) do |t|
      t.column :status, :string, :limit => 1
    end
  end
end
