class LogUsersController < ApplicationController
  def create
    params[:log_user][:date_time] = Time.now
    loguser = LogUser.new(params[:log_user])
    loguser.save
    render :json => "success"
  rescue ActiveRecord::RecordInvalid => error
    render :json => { :message => error.message }, :status => 400
  end
end
