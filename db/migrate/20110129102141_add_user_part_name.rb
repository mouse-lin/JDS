class AddUserPartName < ActiveRecord::Migration
  def self.up
    add_column :user_parts, :name, :string
  end

  def self.down
    remove_column :user_parts, :name
  end
end
