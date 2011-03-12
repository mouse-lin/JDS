# Provider
# access attribution and association easily
#
# Demo:
#   #provide attribution
#   SampleOrder.first.provide("number")
#   #=> { "number" => "LSP11-0001" }
#
#   #provide association:
#   SampleOrder.last.provide(["number", "customer/number"])
#   #=> { "number" => "LSP11-0002", "customer/number" => "LuluLemon" }
#
# Note:
#   only "provide!" will raise exception when the attribution or association can't be provided.
#   for example:
#   SampleOrder.first.provide("abcdefghijk")  #=> { "abcdefghijk" => nil }
#   SampleOrder.first.provide!("abcdefghijk") #=> this case will raise exception!
#

module Provider
  def provide(params)
    provide_action(params, false)
  end

  def provide!(params)
    provide_action(params, true)
  end

  def provide_action(params, raise_exception)
    attrs = (params.is_a? Array) ? params : params.lines.to_a
    r = { }
    attrs.each do |attr|
      begin
        r.update(attr => eval("self.#{ attr.gsub('/', '.') }"))
      rescue NoMethodError
        error_msg = "\033[31m [can't provide] #{self.class.name}#ID='#{id}' can't provide '#{attr}' \033[0m"
        raise_exception ? raise(error_msg) : r.update(attr => nil)
      end
    end
    r
  end
end
