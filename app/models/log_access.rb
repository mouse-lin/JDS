class LogAccess < ActiveRecord::Base

  #所有访问量查看
  def self.find_log_access_date page_conditions = nil, field = nil
    LogAccess.order("date_time desc",page_conditions)
  end

  #用户访问查询
  def self.find_log_access_date_for_user page_conditions = nil, id = nil
    LogAccess.find(:all,page_conditions,:conditions => "id =#{ id }")
  end
  
end
