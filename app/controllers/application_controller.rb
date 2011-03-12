class ApplicationController < ActionController::Base
  protect_from_forgery

  private
  #ext  默认
  def render_json(result = nil , count = 0)
    render :json => "(#{{ :success => true, :content => result, :total => count }.to_json})"
    a =  "div "
    a.html_safe
  end

  
    def render_error error_msg = ""
      #logger.info "============  渲染错误 : #{error_msg.inspect} ============"
      respond_to do |format|
        format.html { render :text => error_msg.inspect , :layout => !request.xhr? , :status => 400 }
        format.js   { render :js   => "throw '#{error_msg}';" , :status => 400 }
        format.json do
          is_active_record = error_msg.is_a? ActiveRecord::Base
          content = {
            :active_record_error => is_active_record,
            :error_messages      => is_active_record ? error_msg.errors.full_messages.uniq : error_msg
          }
          render :json => "(#{{ :success => false, :content => content }.to_json})", :status => 400
        end
      end
    end


end
