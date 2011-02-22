# encoding: utf-8
class AddGroupData < ActiveRecord::Migration
  def self.up
    Group.create([
      { :name => "system",:description => "超级管理员" },
      { :name => "admin", :description => "普通管理员" },
      { :name => "user",  :description => "普通用户" }
    ])
  end

  def self.down
    Group.delete_all
  end
end
