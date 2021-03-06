class CreateHosts < ActiveRecord::Migration
  def self.up
    create_table :hosts do |t|
      t.string  :name
      t.integer :total
      t.integer :count
      t.datetime :date_time
      t.integer  :enable
      t.timestamps
    end
  end

  def self.down
    drop_table :hosts
  end
end
