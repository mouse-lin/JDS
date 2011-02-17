module ModelHelper
  module InstanceMethod
    def inject hash
      self.attributes.merge(hash) 
    end
  end
        
end

class ActiveRecord::Base
  include ModelHelper::InstanceMethod
end
