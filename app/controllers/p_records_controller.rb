class PRecordsController < ApplicationController
  def create
    PRecord.create_new params[:p_records],current_user.id
    render :json => "success"
 rescue ActiveRecord::RecordInvalid => e
    render :json => { :message => error.message }, :status => 400
  end
end
