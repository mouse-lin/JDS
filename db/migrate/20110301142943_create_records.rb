class CreateRecords < ActiveRecord::Migration
  def self.up
    create_table :records do |t|
      t.integer :material_id
      t.integer :user_id
      t.float :quantity, :default => 0.0
      t.text :remark
      t.string  :record_type, :default => "one"

      t.timestamps
    end
  end

  def self.down
    drop_table :records
  end
end
