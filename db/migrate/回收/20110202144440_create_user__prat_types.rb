class CreateUser_pratTypes < ActiveRecord::Migration
  def self.up
    create_table :user__prat_types do |t|

      t.timestamps
    end
  end

  def self.down
    drop_table :user__prat_types
  end
end
