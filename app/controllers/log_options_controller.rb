class LogOptionsController < ApplicationController

  def show_log_options
    default_params = {:offset => params[:offset].to_i, :limit => params[:limit].to_i}
    log_option = LogOption.find_normal_log_option(default_params)
    log_options = log_option.each.collect do |u|
      u.inject(
        :user_name => u.try(:user).try(:name),
        :ip => u.try(:user).last_sign_in_ip
      ) 
    end
    count = LogOption.count
    render_json log_options,count

  end
end
