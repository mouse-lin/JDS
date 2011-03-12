class CreateAccounts < ActiveRecord::Migration
  def self.up
    create_table :accounts do |t|

      t.float :out, :default => 0.0
      t.float :in, :default => 0.0
      t.date  :date_time
      t.timestamps
    end
  end

  def self.down
    drop_table :accounts
  end
end
