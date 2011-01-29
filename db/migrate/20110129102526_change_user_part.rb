class ChangeUserPart < ActiveRecord::Migration
  def self.up
    add_column :user_parts, :paperwork, :string
    add_column :user_parts, :sex, :string
    #change_column :identity_card, :pwnumber
  end

  def self.down
    remove_column :user_parts, :paperwork
    remove_column :user_parts, :sex
  end
end
