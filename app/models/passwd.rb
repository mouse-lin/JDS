class Passwd < ActiveRecord::Base
  #自定义主键
  set_primary_key :user  
  #validates_uniqueness_of   :user
  has_many :users 
  #自定义表名
  set_table_name :passwd
end
