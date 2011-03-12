class PRecord < ActiveRecord::Base
  belongs_to :material
  after_create :change_material_quantity

  def self.create_new  p_records,user_id
    new_p_records = []
    p_records.each do |p|
      p["quantity"] ||= 0.0
      p["remain_quantity"] ||= 0.0
      p["fail_quantity"] ||= 0.0
      p_records_hash = {  
        :user_id => user_id,
        :material_id => p["id"],
        :quantity => p["quantity"],
        :fail_quantity => p["fail_quantity"],
        :remain_quantity => p["remain_quantity"],
        :date_time => p["date_time"] 
      }
      new_p_records << p_records_hash
    end
   PRecord.create(new_p_records)
  end

  def change_material_quantity
    sum = self.quantity - self.remain_quantity - self.fail_quantity #统计出每次卖出的货品,TODO 待修改为以后可以根据日期查询
    material_id = self.material_id
    material = Material.find(material_id)
    quantity = material.quantity - self.quantity
    material.update_attributes(:quantity => quantity, :add_quantity => - self.quantity, :user_id => self.user_id, :sum => sum )
  end

end
