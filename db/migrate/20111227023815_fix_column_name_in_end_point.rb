class FixColumnNameInEndPoint < ActiveRecord::Migration
  def up
    rename_column :Endpoints, :id, :uuid
  end

  def down
    rename_column :Endpoints, :uuid, :id
  end
end
