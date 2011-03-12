class Record < ActiveRecord::Base
  belongs_to :user
  belongs_to :material
  #record_type 有两种类型 1. 库存直接修改的 one 2.添加出炉的数量 two

  def self.find_normal_records page_conditions = nil, field = nil
    Record.find(:all, page_conditions)
  end

end
