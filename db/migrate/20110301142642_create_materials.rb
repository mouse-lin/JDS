class CreateMaterials < ActiveRecord::Migration
  def self.up
    create_table :materials do |t|
      t.string  :name
      t.float  :quantity, :default => 0.0
      t.integer :unit_id
      t.text  :remark
      t.float :add_quantity, :default => 0.0
      t.float :add_quantity_show, :default => 0.0
      t.integer :user_id
      t.float :predict_quantity
      t.float :sum

      t.timestamps
    end
  end

  def self.down
    drop_table :materials
  end
end
