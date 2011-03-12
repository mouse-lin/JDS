# encoding: utf-8
namespace :unit do
  desc '添加物料单位测试数据'
  task :create => :environment  do 
    puts "添加物料单位测试数据成功!!"
    Unit.delete_all
    Unit.create([{ 
        :name => "个",
    },{ 
        :name => "条",
    },{ 
        :name => "串",
    },{ 
        :name => "笼",
    },{ 
        :name => "包",
    },{ 
        :name => "杯",
    },{ 
        :name => "斤",
    }])
  end
end
