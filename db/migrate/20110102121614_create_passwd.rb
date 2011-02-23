class CreatePasswd < ActiveRecord::Migration

  def self.up
    create_table :passwd,:id => false do |t|
      t.string  :user, :null => false, :limit => 32 
      t.string  :password, :limit => 35
      t.integer :enabled, :default => 1 
      t.string  :fullname
      t.string  :comment
      t.timestamps
    end

    remove_column :passwd, :created_at
    remove_column :passwd, :updated_at
    add_index :passwd, :user, :name => "passwd_user_index", :unique => true   
  end

  def self.down
    drop_table :passwd
  end

end
