class AddAdminData < ActiveRecord::Migration
  def self.up
    User.create(
      :password => "000000", 
      :password_confirmation => "000000", 
      :email => "admin@admin.com"
    )
  end

  def self.down
    User.delete_all
  end
end
