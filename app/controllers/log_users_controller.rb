class LogUsersController < ApplicationController

  def index
    default_params = {:offset => params[:offset].to_i, :limit => params[:limit].to_i, :conditions => "user_id = #{ params[:id]}",:order => "id DESC"}
    log_users = LogUser.find_user_log_users default_params
    count = log_users.count
    render_json log_users,count
  end

  def create_log_user
    params[:log_user][:date_time] = Time.now
    loguser = LogUser.new(params[:log_user])
    loguser.save
    render :json => "success"
  rescue ActiveRecord::RecordInvalid => error
    render :json => { :message => error.message }, :status => 400
  end

end
