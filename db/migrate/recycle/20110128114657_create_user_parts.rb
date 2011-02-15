class CreateUserParts < ActiveRecord::Migration
  def self.up
    create_table :user_parts do |t|
      t.integer :user_id
      t.string  :phone
      t.string  :address
      t.string  :identity_card
      t.string  :photo
      t.date    :birthday
      t.timestamps
    end
  end

  def self.down
    drop_table :user_parts
  end
end
