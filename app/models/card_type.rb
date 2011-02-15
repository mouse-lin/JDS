class CardType < ActiveRecord::Base
  has_one :user
  
  #查询证件类型
  def self.find_types
    CardType.all.collect{ |c| [c.name,c.id] }
  end
end
