class AddUserPart_type < ActiveRecord::Migration
  def self.up
    add_column :user_parts,  :type, :string    
  end

  def self.down
    remove_column :user_parts, :type
  end
end
