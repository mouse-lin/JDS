# Load the rails application
require File.expand_path('../application', __FILE__)
#model 类帮助方法
require 'model_helper'

# Initialize the rails application
Mytest::Application.initialize!
ActiveRecord::Base.include_root_in_json = false

