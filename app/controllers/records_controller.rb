class RecordsController < ApplicationController
  def show_records
    default_params = {:offset => params[:offset].to_i, :limit => params[:limit].to_i}
    record = Record.find_normal_records default_params
    records = record.each.collect do |r|
      r.inject(
        :user_name => r.user.name,
        :material_name => r.material.name,
        :date_time => r.created_at.to_s(:db)
      )
    end
    count = Record.count
    render_json records,count
  end
end
