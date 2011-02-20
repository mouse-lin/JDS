class AddUserBgPicture < ActiveRecord::Migration
  def self.up
    add_column :users, :bg_picture, :string
    add_column :users, :theme, :string
  end

  def self.down
    remove_column :users, :bg_picture
    remove_column :users, :theme
  end
end
