# encoding: utf-8
class LogOption < ActiveRecord::Base
  belongs_to :user
  
    

  #创建记录更新
  def self.create_new_record new_user,current_user
    LogOption.create(
      :user_id => current_user.id,
      #:group_id => current_user.group_id
      :ip => current_user.last_sign_in_ip,
      :operation => "创建",
      :user_operate_id => new_user.id,
      :user_operate_name => new_user.name,
      :user_operate_id_card => new_user.identity_card
    )
  end

  #保存更新用户记录
  def self.edit_user new_user,current_user
    LogOption.create(
      :user_id => current_user.id,
      #:group_id => current_user.group_id
      :ip => current_user.last_sign_in_ip,
      :operation => "更新",
      :user_operate_id => new_user.id,
      :user_operate_name => new_user.name,
      :user_operate_id_card => new_user.identity_card
    )
  end

  #删除记录更新
  def self.delete_user operate_user_name,operate_user_id,operate_user_id_card,current_user
    LogOption.create(
      :user_id => current_user.id,
      #:group_id => current_user.group_id
      :ip => current_user.last_sign_in_ip,
      :operation => "删除",
      :user_operate_id => operate_user_id,
      :user_operate_name => operate_user_name,
      :user_operate_id_card => operate_user_id_card
    )
  end

  def self.find_normal_log_option page_conditions = nil, field = nil
    LogOption.find(:all, page_conditions)
  end


end
