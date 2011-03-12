# encoding: utf-8
class AddAdminData < ActiveRecord::Migration
  def self.up
    User.create(
      :password => "000000", 
      :password_confirmation => "000000", 
      :identity_card => "0000000000",
      :birthday => "1990-01-01",
      :email => "000000@admin.com",
      :name => "俊东",
      :login  => "admin",
      :sex => "男",
      :group_id => 1,
      :user => "1"
    )
  end

  def self.down
    User.delete_all
  end

end
