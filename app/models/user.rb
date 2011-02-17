# == Schema Information
# Schema version: 20110129140655
#
# Table name: users
#
#  id                   :integer(4)      not null, primary key
#  email                :string(255)     default(""), not null
#  encrypted_password   :string(128)     default(""), not null #  password_salt        :string(255)     default(""), not null
#  reset_password_token :string(255)
#  remember_token       :string(255)
#  remember_created_at  :datetime
#  sign_in_count        :integer(4)      default(0)
#  current_sign_in_at   :datetime
#  last_sign_in_at      :datetime
#  current_sign_in_ip   :string(255)
#  last_sign_in_ip      :string(255)
#  name                 :string(255)
#  login                :string(255)
#  phone                :string(255)
#  address              :string(255)
#  identity_card        :string(255)
#  card_type_id         :integer(4)
#  birthday             :date
#  created_at           :datetime
#  updated_at           :datetime
#  image_file_name      :string(255)
#  image_content_type   :string(255)
#  image_file_size      :integer(4)
#  image_updated_at     :datetime
#  type                 :string(255)
#

class User < ActiveRecord::Base
  has_attached_file :image, :styles => { :normal => "150x150" }
  has_many  :log_users
  belongs_to   :card_type

  #验证select框值的保存
  #validates_inclusion_of :card_type_id,:in => CardType.find_types.map{|disp,value| value}

  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :lockable and :timeoutable
  devise :database_authenticatable,
         :registerable,
         :recoverable, 
         :rememberable, 
         :trackable, 
         :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :login, :name, 
    :image,
    :image_file_name,
    :image_content_type,
    :image_file_size,
    :image_updated_at,
    :address,
    :birthday,
    :sex,
    :identity_card,
    :card_type_id

  validates_presence_of     :login
  validates_uniqueness_of   :login

  #查找管理员用户
  #暂时为查找所有用户(包括管理员)
  def self.find_normal_user page_conditions = nil, field = nil
    User.find(:all, page_conditions)
  end

  acts_as_provider do
    add.self
    add.card_type
  end

end
