class CreateLogUsers < ActiveRecord::Migration
  def self.up
    create_table :log_users do |t|
      t.integer :user_id
      t.date  :date_time
      t.text  :remark
      t.timestamps
    end
  end

  def self.down
    drop_table :log_users
  end
end
