class CardTypesController < ApplicationController
  
  before_filter :authenticate_user!
  #显示所有证件类型
  def  show_card_type
    default_params = {:offset => params[:offset].to_i, :limit => params[:limit].to_i}
    card_types = CardType.find_normal_card_types default_params
    count = CardType.count
    render_json card_types,count
  end

  #创建证件类型
  def create
    card_type = params[:card_type]
    CardType.create!(card_type)
    render :json => "success"
  rescue ActiveRecord::RecordInvalid => error
    render :json => { :message => error.message }, :status => 400
  end

end
