class UserPartsController < ApplicationController
  layout"login"
  before_filter :authenticate_user!

  #protect_from_forgery :except => :upload
  #skip_before_filter :verify_authenticity_token

  def index
    #user_parts = UserPart.find_normal_user
    default_params = {:offset => params[:offset].to_i, :limit => params[:limit].to_i}
    user = User.find_normal_user(default_params)
    count = User.count
    render_json user,count
  end

  #创建个人的资料
  def create
    params[:user][:user] = current_user.id
    #params[:user][:up_type] = '0'
    @user_part = UserPart.new(params[:user_part])
    @user_part.save
    redirect_to :controller => "user_parts",:action => "show_image"
  end

  #TODO 重构choose_image 与 show_image 方法，
  def choose_image
    @action = "create"
    @user = current_user
    @card_type = CardType.find_types
  end

  def show_image
    @user = current_user
    @render = "user_parts/show_image"
    @card_type = CardType.find_types
    render_index
  end

  def update_image
    @user = current_user
    @user.update_attributes!(params[:user])
    redirect_to :controller => "user_parts",:action => "show_image"
  rescue ActiveRecord::RecordInvalid => e
    flash[:error] = e.message 
    redirect_to :controller => "user_parts",:action => "show_image"
  end

  def show_kind
  end

  #TODO 暂时用于显示登录用户view
  def edit_user_part_index
  end

  #TODO 暂时用于创建普通用户资料
  def create_user_part
    params[:user_part][:up_type] = '1'
    @user_part = UserPart.new(params[:user_part])
    @user_part.save
    redirect_to :controller => "user_parts",:action => "edit_user_part_index"
  end
  
  #TODO 搜索功能，暂时保留
  #Comment: change the old search action to search_user_parts
  def search_user_parts
    result_data = UserPart.search( params[:search]) 
    user_parts = result_data.current_scope
    count = user_parts.count
    render_json  user_parts, count
  end

  protected
  #用来渲染不同的模板
  def render_index
    render "user_parts/choose_image"  
  end

end
