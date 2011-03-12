class CreatePrices < ActiveRecord::Migration
  def self.up
    create_table :prices do |t|
      t.float :price
      t.text  :remark
      t.integer :material_id

      t.timestamps
    end
  end

  def self.down
    drop_table :prices
  end
end
