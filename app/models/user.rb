# encoding: utf-8
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
  has_many  :log_options
  has_many  :records
  belongs_to   :card_type
  belongs_to   :group
  belongs_to   :passwd, :foreign_key  => :user

  after_create  :add_theme
  after_create  :add_group
  after_create  :create_passwd
  after_update  :update_passwd
  after_destroy :destroy_passwd

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
    :card_type_id,
    :bg_picture,
    :theme,
    :group_id,
    :user


  validates_presence_of     :login
  validates_uniqueness_of   :login


#===================== 同步更新 passwd表 ======================
  #添加passwd表的内容
  def create_passwd
    user = get_number(self.id)
    #user = self.name
    number = self.email.index("@")
    passwd = self.email.first(number)
    self.update_attributes(:user => user)

    p = Passwd.new
    p.password = passwd
    p.user = user
    p.save
  end

#==================== 获取编号 ===========================
  def get_number id
    zero = ""
    (8-id.to_s.length).times do
      zero += "0"
    end
    return zero + id.to_s
  end
#=========================================================

  def update_passwd
    unless self.passwd.nil?
      number = self.email.index("@")
      passwd = self.email.first(number)
      self.passwd.update_attributes(:password => passwd)
    end
  end

  def destroy_passwd
    self.passwd.delete unless self.passwd.nil?
  end

#================================================================
  #添加用户小组
  def add_group
    self.update_attributes(:group_id => 3) if self.group_id.nil?
  end

  #添加默认的主题
  def add_theme
    self.update_attributes!(:theme => "t0")
  end
  #转换年龄
  def change_age
    birthday.year
  end


  #查询年龄
  def self.age
    users = User.all.collect do |u|
      age = Time.now.year - u.change_age 
      u.inject(:age => age )
    end
  end

#  #important 查找对应的passwd
#  def find_passwd
#    Passwd.find(:all,:conditions =>"user = #{ self.id }").first
#  end

  #查找管理员用户
  #暂时为查找所有用户(包括管理员)
  def self.find_normal_user page_conditions = nil, field = nil
    User.find(:all, page_conditions,:conditions => "id != #{ field.id }")
  end

  #查找女生人数
  def self.find_girls
    User.find(:all,:conditions => "sex = '女'")
  end

  #查找男生人数
  def self.find_boys
    User.find(:all,:conditions => "sex = '男'")
  end
end
