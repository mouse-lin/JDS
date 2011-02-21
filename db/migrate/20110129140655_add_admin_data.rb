# encoding: utf-8
class AddAdminData < ActiveRecord::Migration
  def self.up
    User.create(
      :password => "000000", 
      :password_confirmation => "000000", 
      :identity_card => "0000000000",
      :birthday => "1990-01-01",
      :email => "admin@admin.com",
      :name => "admin",
      :login  => "admin",
      :sex => "男"
    )
  end

  def self.down
    User.delete_all
  end

end
