class CreatePRecords < ActiveRecord::Migration
  def self.up
    create_table :p_records do |t|

      t.timestamps
      t.string  :remark
      t.float   :quantity,:default => 0.0
      t.integer :material_id
      t.integer :user_id
      t.float :fail_quantity, :default => 0.0
      t.float :remain_quantity, :default => 0.0
      t.date  :date_time
    end

  end

  def self.down
    drop_table :p_records
  end
end
