class GroupsController < ApplicationController
  #comment this ation scaffold for a while. 
  #TODO find a new way to instead
  layout"application", :except => [ :scaffold ]

  def index
    @group = Group.all
    respond_to do |format|
      format.html  
      format.json  { render_json @group }
    end
  end

  def create
    group = params[:group]
    Group.create!(group)
    render :json => "success"
  rescue ActiveRecord::RecordInvalid => error
    render :json => { :message => error.message }, :status => 400
  end

  def destroy
    group = params[:id]
    Group.delete(group)
    render :json => group
  end

  def scaffold
  end
end
