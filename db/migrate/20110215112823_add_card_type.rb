# encoding: utf-8
class AddCardType < ActiveRecord::Migration
  def self.up
    CardType.create(
      [{ :name => "学生证"},
      { :name => "工作证" }]
    )
  end

  def self.down
    CardType.delete_all
  end
end
