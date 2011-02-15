class CreateCardTypes < ActiveRecord::Migration
  def self.up
    create_table :card_types do |t|

      t.timestamps
      t.string  :name
      t.text  :remark
    end
  end

  def self.down
    drop_table :card_types
  end
end
