class UnitsController < ApplicationController
  def show_units
    units = Unit.all
    render_json units
  end

  def create
    unit = Unit.new(params[:units])
    unit.save!
    render :json => "success"
 rescue ActiveRecord::RecordInvalid => e
    render :json => { :message => error.message }, :status => 400
  end

end
