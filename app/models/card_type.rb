class CardType < ActiveRecord::Base
  has_one :user
  
  def self.find_normal_card_types page_conditions = nil, field = nil
    CardType.find(:all, page_conditions)
  end

  #查询证件类型
  def self.find_types
    CardType.all.collect{ |c| [c.name,c.id] }
  end

  def self.find_card_type_name
    CardType.all.collect do |c|
      c.name
    end
  end

  def self.find_card_type_id
    CardType.all.collect do |c|
      c.id
    end
  end

  def self.find_card_type_value
    card_type_value = []
    CardType.find_card_type_id.each do |c|
     card_type_value << User.find(:all,:conditions => "card_type_id = #{ c }").count
    end
    return card_type_value
  end

end
