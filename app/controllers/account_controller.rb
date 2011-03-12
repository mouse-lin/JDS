class AccountController < ApplicationController
  def create
    account = Account.new(params[:accounts])
    account.save!
    render :json => "success"
 rescue ActiveRecord::RecordInvalid => e
    render :json => { :message => error.message }, :status => 400
  end
   
  #统计出入帐记录
  def show_accounts
    default_params = {:offset => params[:offset].to_i, :limit => params[:limit].to_i}
    params[:date_time] ||= Time.now.strftime "%Y-%m-%d" 
    condition = { :conditions => ["date_time = ?",params[:date_time]] }
    account = Account.find_normal_material default_params,condition 
    out = 0.0
    in_quantity = 0.0
    all_money = 0.0
    account.each do |a|
      out += a.out ||= 0.0
      in_quantity += a.in ||= 0.0
    end

    # 查找全部物料/并获取所有物料总价格（根据每天时间来获取）
    Material.all.each do |m|
      quantity = m.find_quantity(params[:date_time])
      remain_quantity = m.find_remian_quantity(params[:date_time])
      fail_quantity = m.fail_quantity(params[:date_time])
      all_money += m.all_money(quantity,fail_quantity,remain_quantity)
    end

    accounts = [{ :out => out, :in => in_quantity, :date_time => account.try(:first).try(:date_time), :all_money => all_money }]
    count = 1
    render_json accounts,count
  end

end
