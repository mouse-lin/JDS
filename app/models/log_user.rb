# == Schema Information
# Schema version: 20110129140655
#
# Table name: log_users
#
#  id         :integer(4)      not null, primary key
#  user_id    :integer(4)
#  date_time  :date
#  remark     :text
#  created_at :datetime
#  updated_at :datetime
#

class LogUser < ActiveRecord::Base
  belongs_to  :user_part
end
