class CreatePasswds < ActiveRecord::Migration

  def self.up
    create_table :passwds,:id => false do |t|
      t.string  :user, :null => false, :limit => 32 
      t.string  :password, :limit => 35
      t.integer :enabled 
      t.string  :fullname
      t.string  :comment
      t.timestamps
    end

    remove_column :passwds, :created_at
    remove_column :passwds, :updated_at
    add_index :passwds, :user, :name => "passwds_user_index", :unique => true   
  end

  def self.down
    drop_table :passwds
  end

end
