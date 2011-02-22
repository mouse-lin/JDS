class Passwd < ActiveRecord::Base
  #自定义主键
  set_primary_key :user  
  #validates_uniqueness_of   :user
  has_many :users 
end
