class Unit < ActiveRecord::Base
  has_one :material
  validates_uniqueness_of   :name
end
