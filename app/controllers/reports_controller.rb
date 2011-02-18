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
  end

  #证件类型统计
  def card_type_statis
    @card_type_graph = open_flash_chart_object(350,300,"/reports/card_type_graph_code").html_safe
    @card_type_name = CardType.find_card_type_name
    @card_type_value = CardType.find_card_type_value
    @user_all_count = User.all.count
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
    pie.values  = [PieValue.new(4,"1-19岁"), PieValue.new(4,"20-39岁"),PieValue.new(2,"40-50岁")]

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

end
