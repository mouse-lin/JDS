class GroupsController < ApplicationController
  #comment this ation scaffold for a while. 
  #TODO find a new way to instead
  layout"application", :except => [ :scaffold ]

  #显示所有的用户小组 show all the user group
  def index
    @group = Group.all
    respond_to do |format|
      format.html  
      format.json  { render_json @group }
    end
  end

  #创建用户小组 create a user group
  def create
    group = params[:group]
    Group.create!(group)
    render :json => "success"
  rescue ActiveRecord::RecordInvalid => error
    render :json => { :message => error.message }, :status => 400
  end

  # 删除一个用户小组 delete a user group
  def destroy
    group = params[:id]
    Group.delete(group)
    render :json => group
  end

  #删除所有用户小组 (delete all the user group)
  def delete_all
    Group.delete_all
    render :json => 'success'
  rescue ActiveRecord::RecordInvalid => error
    render :json => { :message => error.message }, :status => 400
  end

  # a new test way to comment
  def scaffold
  end

end
