class CreateLogAccesses < ActiveRecord::Migration
  def self.up
    create_table :log_accesses do |t|
      t.integer :user_id
      t.integer :ip_id
      t.integer :host_id
      t.datetime  :date_time

      t.timestamps
    end
  end

  def self.down
    drop_table :log_accesses
  end
end
