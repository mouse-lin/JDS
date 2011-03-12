class Material < ActiveRecord::Base
  has_many :prices
  has_many :records
  has_many :p_records
  belongs_to :unit
  after_update :create_record
  include NestedAssignment
  accessible_associations :prices

  def self.find_normal_material page_conditions = nil, field = nil
    Material.find(:all, page_conditions)
  end

  def create_record
    data ={ :quantity => self.add_quantity,:user_id => User.find(self.user_id), :material_id => self.id }
    Record.create(data)
  end

  #按时间查找今天所有的p_records资料
  def find_today_p_records date_time
    self.p_records.where("date_time = ?",date_time)
  end

  #按时间查找昨天剩余的物料
  def find_remian_quantity date_time
    remain_quantity = self.p_records.where("date_time = ?",date_time).try(:last).try(:remain_quantity) 
    remain_quantity ||= 0.0
  end

  #按时间查找坏掉的物料数量
  def fail_quantity date_time
    fail_quantity = 0.0
    self.find_today_p_records(date_time).each do |p|
      fail_quantity += p.fail_quantity ||= 0.0
    end
    return fail_quantity
  end

  #按时间查找生产的数量
  def find_quantity date_time
    quantity = 0.0
    self.find_today_p_records(date_time).each do |p|
      quantity += p.quantity
    end
    return quantity
  end

  #按时间查找所有的物料汇总的价格  all_money = 生产物料 - 坏掉 - 剩余 * 单价
  def all_money quantity,fail_quantity,remain_quantity
    all_money = 0.0
    price = 0.0
    sale_quantity = 0.0 #总共卖出的数量
    price = self.try(:prices).try(:last).try(:price) unless self.try(:prices).try(:last).try(:price).nil? 
    sale_quantity = quantity - fail_quantity - remain_quantity
    all_money = sale_quantity * price 
  end
  
 # def get_predict
 #   
 # end

end
