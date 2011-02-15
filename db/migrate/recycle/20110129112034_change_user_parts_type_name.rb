class ChangeUserPartsTypeName < ActiveRecord::Migration
  def self.up
    rename_column :user_parts, :type, :up_type
  end

  def self.down
  end
end
