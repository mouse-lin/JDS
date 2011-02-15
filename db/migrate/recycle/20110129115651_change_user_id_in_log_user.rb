class ChangeUserIdInLogUser < ActiveRecord::Migration
  def self.up
    rename_column :log_users, :user_id, :user_part_id
  end

  def self.down
  end
end
