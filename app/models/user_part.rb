# == Schema Information
# Schema version: 20110128184947
#
# Table name: user_parts
#
#  id                 :integer(4)      not null, primary key
#  user_id            :integer(4)
#  phone              :string(255)
#  address            :string(255)
#  identity_card      :string(255)
#  photo              :string(255)
#  birthday           :date
#  created_at         :datetime
#  updated_at         :datetime
#  image_file_name    :string(255)
#  image_content_type :string(255)
#  image_file_size    :integer(4)
#  image_updated_at   :datetime
#

class UserPart < ActiveRecord::Base
  has_attached_file :image, :styles => { :normal => "150x150" }
  belongs_to  :user
  has_many    :log_users
  #TODO 检验 等待rails3
  validates_presence_of     :identity_card
  #validates_length_of       :identity_card,    :within => 18..18
  #validates_attachment_size :image, :less_than => 1.megabytes
  #validates_attachment_content_type :image, :content_type => ['image/jpeg', 'image/png', 'image/gif'], 
  #查找非管理员用户
  def self.find_normal_user
    UserPart.find(:all, :conditions => "up_type = '1'")
  end
end
