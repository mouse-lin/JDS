# encoding: utf-8
class ReportsController < ApplicationController
  layout"report"

  def index
  end

  #会员总数统计
  def sex_statis
    @sex_graph = open_flash_chart_object(350,300,"/reports/sex_graph_code").html_safe
    @girls_count = User.find_girls.count
    @boys_count = User.find_boys.count
    @all_count =  @boys_count + @girls_count
  end

  #年龄总数统计
  def age_statis
    @age_graph = open_flash_chart_object(350,300,"/reports/age_graph_code").html_safe
    @first_age_people_count = 0
    @second_age_people_count = 0
    @third_age_people_count = 0
    User.age.each do |u|
      @first_age_people_count += 1 if 1 < u[:age] and u[:age] < 20
      @second_age_people_count += 1 if 19 < u[:age] and u[:age] < 40 
      @third_age_people_count += 1 if 39 < u[:age] and u[:age] < 51
    end

  end

  #证件类型统计
  def card_type_statis
    @card_type_graph = open_flash_chart_object(350,300,"/reports/card_type_graph_code").html_safe
    @card_type_name = CardType.find_card_type_name
    @card_type_value = CardType.find_card_type_value
    @user_all_count = User.all.count
  end

  def web_statis_f
    @web_statis_f = open_flash_chart_object(500,400,"/reports/web_statis_f_code").html_safe
  end


  def web_statis_f_code
    title = Title.new("查看访问量最大网站")
    bar = BarGlass.new

    #证件类型统计
    host_name =  [] 
    host_value = []
    Host.order("total desc").limit(20).each do |h |
      host_name << h.name
      host_value << h.total
    end
    y_axis = YAxis.new
    y_axis.set_range(0,Host.order("total desc").limit(1).first.total , Host.order("total desc").limit(1).first.total/10)

    x_axis = XAxis.new
    x_axis.labels = host_name

    bar.set_values(host_value)

    chart = OpenFlashChart.new
    chart.bg_colour = '#ffffff'
    chart.y_axis = y_axis
    chart.x_axis = x_axis
    chart.set_title(title)
    chart.add_element(bar)
    render :text => chart.to_s
  end

  def web_statis_s
    @web_statis_s = open_flash_chart_object(500,400,"/reports/web_statis_s_code").html_safe
  end


  def web_statis_s_code
    title = Title.new("查看当天访问量最大网站")
    bar = BarGlass.new

    #证件类型统计
    host_name =  [] 
    host_value = []
    Host.order("count desc").limit(20).each do |h |
      host_name << h.name
      host_value << h.count
    end
    y_axis = YAxis.new
    y_axis.set_range(0,Host.order("count desc").limit(1).first.count, Host.order("count desc").limit(1).first.count/10)

    x_axis = XAxis.new
    x_axis.labels = host_name

    bar.set_values(host_value)

    chart = OpenFlashChart.new
    chart.bg_colour = '#ffffff'
    chart.y_axis = y_axis
    chart.x_axis = x_axis
    chart.set_title(title)
    chart.add_element(bar)
    render :text => chart.to_s
  end


  def sex_graph_code
    title = Title.new("会员总数")

    pie = Pie.new
    pie.start_angle = 35
    pie.animate = true
    pie.tooltip = '<br>#percent# of 100%'
    pie.colours = ["#356aa0","#d01f3c"]
    
    #统计男女生人数
    @girls_count = User.find_girls.count
    @boys_count = User.find_boys.count
    @all_count =  @boys_count + @girls_count
    @girls_percent = @girls_count/@all_count.to_f
    @boys_percent = @boys_count/@all_count.to_f

    pie.values  = [PieValue.new(@boys_percent,"男生"), PieValue.new(@girls_percent,"女生")]

    chart = OpenFlashChart.new
    chart.title = title
    chart.add_element(pie)
    chart.bg_colour = '#ffffff'

    chart.x_axis = nil

    render :text => chart.to_s
  end
  
  def age_graph_code
    title = Title.new("年龄统计")

    pie = Pie.new
    pie.start_angle = 35
    pie.animate = true
    pie.tooltip = '<br>#percent# of 100%'
    pie.colours = ["#459a89","#9a89f9","#c01f30"]

    first_age_people_count = 0
    second_age_people_count = 0
    third_age_people_count = 0
    User.age.each do |u|
      first_age_people_count += 1 if 1 < u[:age] and u[:age] < 20
      second_age_people_count += 1 if 19 < u[:age] and u[:age] < 40 
      third_age_people_count += 1 if 39 < u[:age] and u[:age] < 51
    end

    pie.values  = [PieValue.new(first_age_people_count,"1-19岁"), PieValue.new(second_age_people_count,"20-39岁"),PieValue.new(third_age_people_count,"40-50岁")]

    chart = OpenFlashChart.new
    chart.title = title
    chart.add_element(pie)
    chart.bg_colour = '#ffffff'

    chart.x_axis = nil

    render :text => chart.to_s

  end
  
  def card_type_graph_code
    title = Title.new("证件类型统计")
    bar = BarGlass.new

    #证件类型统计
    card_type_name = CardType.find_card_type_name
    all_user_count = User.count
    card_type_value = CardType.find_card_type_value

    y_axis = YAxis.new
    y_axis.set_range(0, User.count, User.count/10)

    x_axis = XAxis.new
    x_axis.labels = card_type_name

    bar.set_values(card_type_value)

    chart = OpenFlashChart.new
    chart.bg_colour = '#ffffff'
    chart.y_axis = y_axis
    chart.x_axis = x_axis
    chart.set_title(title)
    chart.add_element(bar)
    render :text => chart.to_s
  end

  #============= 访问量统计 ===================
  def log_access_date
    default_params = {:offset => params[:offset].to_i, :limit => params[:limit].to_i}
    log_access = LogAccess.find_log_access_date(default_params)
    count = LogAccess.count
    render_json log_access,count
  end
  #============================================

  #============= 用户特定访问量查看 ============
  def log_access_date_for_user
    default_params = {:offset => params[:offset].to_i, :limit => params[:limit].to_i,:order => "date_time desc"}
    log_access = LogAccess.find_log_access_date_for_user(default_params,params[:id])
    count = log_access.count
    render_json log_access,count
  end
  #=============================================

end
