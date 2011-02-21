class CreateLogOptions < ActiveRecord::Migration
  def self.up
    create_table :log_options do |t|
      t.integer :user_id
      t.integer :group_id
      t.string  :ip
      t.string  :operation
      t.string  :note
      t.string  :other
      t.integer :user_operate_id
      t.string  :user_operate_name
      t.string  :user_operate_id_card
      t.timestamps
    end
  end

  def self.down
    drop_table :log_options
  end
end
