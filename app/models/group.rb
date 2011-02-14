# == Schema Information
# Schema version: 20110202144440
#
# Table name: groups
#
#  id          :integer(4)      not null, primary key
#  name        :string(255)
#  description :text
#  created_at  :datetime
#  updated_at  :datetime
#

class Group < ActiveRecord::Base
    validates_presence_of     :name
end
