# encoding: utf-8
class MaterialsController < ApplicationController

  #显示所有的库存
  def show_materials
    default_params = {:offset => params[:offset].to_i, :limit => params[:limit].to_i}
    material = Material.find_normal_material default_params
    materials = material.each.collect do |m|
      m.inject(
        :price => m.try(:prices).try(:last).try(:price),
        :unit => m.try(:unit).try(:name)
      )
    end
    count = Material.count
    render_json materials,count
  end

  #显示所有统计的库存
  def show_statistic_materials
    default_params = {:offset => params[:offset].to_i, :limit => params[:limit].to_i}
    material = Material.find_normal_material default_params
    #显示的时间默认化
    params[:date_time] ||= Time.now.strftime "%Y-%m-%d" 
    materials = material.each.collect do |m|
      quantity = m.find_quantity(params[:date_time])
      remain_quantity = m.find_remian_quantity(params[:date_time])
      fail_quantity = m.fail_quantity(params[:date_time])
      all_money = m.all_money(quantity,fail_quantity,remain_quantity)

      m.inject(
        :price => m.try(:prices).try(:last).try(:price),
        :remain_quantity => remain_quantity,
        :fail_quantity => fail_quantity,
        :p_quantity => quantity,
        :all_money => all_money
      )
    end
    count = Material.count
    render_json materials,count
  end

  #保存物料库存
  def create
    material = Material.new(params[:materials])
    material.save!
    render :json => "success"
 rescue ActiveRecord::RecordInvalid => e
    render :json => { :message => error.message }, :status => 400
  end

  #保存多余的库存/以及编辑库存
  def update_materials_quantity
    params[:materials].each do |m|
      material = Material.find(m["id"])
      Price.create_price(material, m["price"].to_f)  if m["price"].to_f != material.try(:prices).try(:last).try(:price)
      m["quantity"] ||= 0 
      m["add_quantity"] = m["add_quantity_show"]
      m["add_quantity_show"] = 0.0
      m["quantity"] += m["add_quantity"].to_f
      m["unit_id"] = m["unit"] unless m["unit"].is_a? String  
      m.delete("unit")  
      m["user_id"] = current_user.id
      m.delete("price")
      Material.find(m["id"]).update_attributes!(m)
    end
    render :json => "success"
  rescue ActiveRecord::RecordInvalid => e
    render :json => { :message => error.message }, :status => 400
  end

end
