class Account < ActiveRecord::Base

  #需要把相同日期的合在一起
  def self.find_normal_material page_conditions = nil, field = nil
    Account.find(:all, page_conditions,field)
  end

end
