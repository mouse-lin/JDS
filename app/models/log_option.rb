# encoding: utf-8
class LogOption < ActiveRecord::Base
  belongs_to :user

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

end
