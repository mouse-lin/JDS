# encoding: utf-8
class UserPartsController < ApplicationController
  layout"login"
  before_filter :authenticate_user!

  #protect_from_forgery :except => :upload
  #skip_before_filter :verify_authenticity_token 
  def index
    #user_parts = UserPart.find_normal_user
    default_params = {:offset => params[:offset].to_i, :limit => params[:limit].to_i}
    user = User.find_normal_user(default_params)
    users = user.each.collect do |u|
      u.inject(:card_type_name => u.try(:card_type).try(:name)) 
    end
    count = User.count
    render_json users,count
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

  def print_user_details
    @user = User.find(params[:id])
  end

  #TODO 暂时用于显示登录用户view
  def edit_user_part_index
    @card_type = CardType.find_types
  end

  #===================    创建 修改 删除 用户 =============================
  #TODO 暂时用于创建普通用户资料
  def create_user
    #默认生成用户时候都是执行 账号12位 密码6位,TODO:待封装
    params[:user][:login] = params[:user][:identity_card].first(12)
    params[:user][:password] = params[:user][:identity_card].last(6)
    params[:user][:password_confirmation] = params[:user][:identity_card].last(6)
    params[:user][:email] = params[:user][:login] + "@#{ params[:user][:name] }.com"
    #============================

    @user = User.new(params[:user])
    @user.save!
    
    #保存创建记录
    new_user = User.last
    LogOption.create_new_record new_user,current_user
    #======

    flash[:notice] = "用户 #{ params[:user][:name] } 创建成功!"
    redirect_to :action => "edit_user_part_index"
  rescue ActiveRecord::RecordInvalid => e
    flash[:notice] = e.message 
    redirect_to :action => "edit_user_part_index"
  end

  def delete_user
    operate_user = User.find(params[:user_id])
    operate_user_name = operate_user.name
    operate_user_id = operate_user.id
    operate_user_id_card = operate_user.id

    User.find(params[:user_id]).image.destroy
    User.destroy(params[:user_id])

    #保存删除记录
    LogOption.delete_user operate_user_name,operate_user_id,operate_user_id_card,current_user

    render :json => "success"
 rescue ActiveRecord::RecordInvalid => e
    render :json => { :message => error.message }, :status => 400
  end

  def edit_user_win
    unless params[:id].nil?
      number = params[:id].index("f")
      user_id = params[:id].first(number)
      @user = User.find(user_id)
    else
      @user = User.find(params[:user_id])
    end
      @card_type = CardType.find_types
  end

  def edit_user
    @user = User.find(params[:id])
    @user.update_attributes!(params[:user])

    #保存更新记录
    LogOption.edit_user @user,current_user

    flash[:error] = "更新成功,请刷新表格查看数据！"
    redirect_to :controller => "user_parts",:action => "edit_user_win",:user_id => params[:id]
  rescue ActiveRecord::RecordInvalid => e
    flash[:error] = e.message 
    redirect_to :controller => "user_parts",:action => "edit_user_win"

  end
  #========================================================================

  #用户详细资料
  def personality_detail
    number = params[:id].index("f")
    user_id = params[:id].first(number)
    @user = User.find(user_id)
  end
  
  #用户密码修改界面
  def update_pw_win
  end

  def update_pw
    user = current_user
    user.update_attributes!(params[:user])
    flash[:notice] = "密码修改成功"
    redirect_to :controller => "user_parts",:action => "update_pw_win"
  rescue ActiveRecord::RecordInvalid => e
    flash[:notice] = e.message 
    redirect_to :controller => "user_parts",:action => "update_pw_win"
  end

#===============  用户界面个性化设计 ==================================

  def update_bg_image_win
    
  end

  def update_bg_image
    flash[:image_notice] = "背景图片选择成功,请刷新页面查看!"
    current_user.update_attributes!(:bg_picture => params[:name])
    redirect_to :action => "update_bg_image_win"
  end

  def update_theme_win
  end

  def update_theme
    flash[:image_notice] = "主题选择成功,请刷新页面查看!"
    current_user.update_attributes!(:theme => params[:theme])
    redirect_to :action => "update_theme_win"

  end

#=====================================================================


  #TODO 搜索功能，暂时保留
  #Comment: change the old search action to search_user_parts
  def search_user
    result_data = User.search( params[:search]) 
    user = result_data.current_scope
    count = user.count
    render_json  user, count
  end

  protected
  #用来渲染不同的模板
  def render_index
    render "user_parts/choose_image"  
  end

end
