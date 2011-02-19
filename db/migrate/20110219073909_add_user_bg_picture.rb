class AddUserBgPicture < ActiveRecord::Migration
  def self.up
    add_column :users, :bg_picture, :string
  end

  def self.down
    remove_column :users, :bg_picture
  end
end
