# encoding: utf-8
namespace :material do
  desc '添加物料测试数据'
  task :create => :environment  do 
    puts "添加物料测试数据成功!!"
    Material.delete_all
    Material.create([{ 
        :name => "珍珠鸡",
        :unit_id => 1,
        :prices_params => [{ 
          :price => 3.5
        }]
    },{ 
        :name => "裹蒸粽",
        :unit_id => 1,
        :prices_params => [{ 
          :price => 3.5
        }]
    },{ 
        :name => "紫菜卷",
        :unit_id => 2, 
        :prices_params => [{ 
          :price => 2.5
        }]
    },{ 
        :name => "腐皮卷",
        :unit_id => 2,
        :prices_params => [{ 
          :price => 2.5
        }]
    },{ 
        :name => "猪肉干蒸",
        :unit_id => 3,
        :prices_params => [{ 
          :price => 3
        }]
    },{ 
        :name => "牛肉丸",
        :unit_id => 3,
        :prices_params => [{ 
          :price => 3
        }]
    },{ 
        :name => "猪肉丸",
        :unit_id => 3,
        :prices_params => [{ 
          :price => 3
        }]
    },{ 
        :name => "粉果",
        :unit_id => 1,
        :prices_params => [{ 
          :price => 1.5
        }]
    },{ 
        :name => "广东虾饺",
        :unit_id => 1,
        :prices_params => [{ 
          :price => 1.5
        }]
    },{ 
        :name => "玉米饼",
        :unit_id => 1,
        :prices_params => [{ 
          :price => 1.5
        }]
    },{ 
        :name => "玉米饺子",
        :unit_id => 4,
        :prices_params => [{ 
          :price => 45
        }]
    },{ 
        :name => "九王饺子",
        :unit_id => 4,
        :prices_params => [{ 
          :price => 45
        }]
    },{ 
        :name => "叉烧包",
        :unit_id => 5,
        :prices_params => [{ 
          :price => 10
        }]
    },{ 
        :name => "燕麦叉烧",
        :unit_id => 5,
        :prices_params => [{ 
          :price => 15
        }]
    },{ 
        :name => "生肉包",
        :unit_id => 5,
        :prices_params => [{ 
          :price => 10
        }]
    },{ 
        :name => "流沙包",
        :unit_id => 5,
        :prices_params => [{ 
          :price => 15
        }]
    },{ 
        :name => "奶黄包",
        :unit_id => 5,
        :prices_params => [{ 
          :price => 10
        }]
    },{ 
        :name => "豆沙包",
        :unit_id => 5,
        :prices_params => [{ 
          :price => 17
        }]
    },{ 
        :name => "紫薯包",
        :unit_id => 5,
        :prices_params => [{ 
          :price => 10
        }]
    },{ 
        :name => "香芋包",
        :unit_id => 5,
        :prices_params => [{ 
          :price => 17
        }]
    },{ 
        :name => "荷花卷",
        :unit_id => 5,
        :prices_params => [{ 
          :price => 10
        }]
    },{ 
        :name => "马拉糕",
        :unit_id => 1,
        :prices_params => [{ 
          :price => 6
        }]
    },{ 
        :name => "糯米卷",
        :unit_id => 5,
        :prices_params => [{ 
          :price => 12
        }]
    },{ 
        :name => "坚果刀切",
        :unit_id => 5,
        :prices_params => [{ 
          :price => 6
        }]
    },{ 
        :name => "媛姐大包",
        :unit_id => 1,
        :prices_params => [{ 
          :price => 4
        }]
    },{ 
        :name => "黑糯米糕",
        :unit_id => 5,
        :prices_params => [{ 
          :price => 9
        }]
    },{ 
        :name => "黄金糕",
        :unit_id => 5,
        :prices_params => [{ 
          :price => 18
        }]
    },{ 
        :name => "红枣糕",
        :unit_id => 5,
        :prices_params => [{ 
          :price => 27
        }]
    },{ 
        :name => "马蹄糕",
        :unit_id => 5,
        :prices_params => [{ 
          :price => 27
        }]
    },{ 
        :name => "南北馒头",
        :unit_id => 5,
        :prices_params => [{ 
          :price => 12
        }]
    },{ 
        :name => "麦香包",
        :unit_id => 5,
        :prices_params => [{ 
          :price => 5
        }]
    },{ 
        :name => "豆浆",
        :unit_id => 6,
        :prices_params => [{ 
          :price => 2
        }]
    },{ 
        :name => "QQ盏",
        :unit_id => 5,
        :prices_params => [{ 
          :price => 15
        }]
    },{ 
        :name => "皮",
        :unit_id => 7
    }])
  end
end
