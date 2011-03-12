class Price < ActiveRecord::Base
  belongs_to :material
  def self.create_price material,price
    Price.create(:price => price, :material_id => material.id)
  end
end
