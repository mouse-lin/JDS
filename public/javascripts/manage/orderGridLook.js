Manage.OrderWindowLook = Ext.extend(Ext.app.Module,  {
    id: 'orderWindowLook',
    init: function() {
        this.launcher = {
            text: '用户资料查看',
            iconCls: 'bogus',
            handler: this.createWindowLook,
            scope: this
        }
    },

    createWindow: function() {
      _this = Manage.orderWindowLook;
      var manage = _this.app.getDesktop();
      var win = manage.getWindow('orderWindowLook');
      if(!win) {
            win = manage.createWindow({
                //id: 'orderWindowLook',
                title: '用户资料查看',
                width: 700,
                height: 500,
                iconCls: 'bogus',
                shim: false,
                animCollapse: false,
                constrainHeader: true,
                //html: '<iframe src="user_parts/edit_user_part_index" frameborder="0" width="100%" height="100%"></iframe>' 
                items: _this.createGrid()
                
            });
          }
        win.show();
    },
    
    createGrid: function(){ 
        var _this = Manage.clothPartShow;
        store = new Ext.data.JsonStore({ 
            fields: [
                'id',
                'name',
                'sex',
                'identity_card',
                'paperwork',
                'address',
                'birthday'
            ],
            root: "content",
            url:'/user_parts.json',
            method: 'GET'
        });
        store.load()
        //var pageToolbar = Wando.createPagingToolbar(store);
        var addOperator = function(value, mataData, record, rowIndex, colIndex, store){ 
            var link = String.format('<a href="#" onclick="_this.makeSure( {0} )">确定入馆</a>', record.data.id) + '&nbsp;';
           // link += String.format('<a href="#" onclick="_this.searchDetail({0})">查看入馆信息</a>', record.data.id) + '&nbsp;';
            return link;
        };

        //var sm = new Ext.grid.CheckboxSelectionModel();
        var cm = new Ext.grid.ColumnModel([
            //sm,
            { header: '编号'      ,sortable: true, dataIndex: 'id', width:50},
            { header: '姓名'      ,sortable: true, dataIndex: 'name'},
            { header: '身份证号'  ,sortable: true, dataIndex: 'identity_card'},
            { header: '性别'      ,sortable: true, dataIndex: 'sex'},
            { header: '出生年月'  ,sortable: true, dataIndex: 'birthday'},
            { header: '地址'      ,sortable: true, dataIndex: 'address'},
            { header: '操作'        , dataIndex: '#', renderer: addOperator, width: 200 }
        ]);
//        tbar = [ 
//            { text: '添加小组', handler: function(){ createAddjob("add") }}, '-',
//        ];
//
        return new Ext.grid.EditorGridPanel({ 
            viewConfig: { forceFit: true },
            height:530,
            //title: "小组查看",
            stripeRows: true,
            region : 'center',
            id:'jobGrid',
            store: store,
            loadMask: {msg:"读取中..."},
           // tbar: tbar, 
            //bbar: pageToolbar,
            cm: cm,
            //sm: sm,
//            listeners: { 
//                cellclick: function(grid, rowIndex, columnIndex) { 
//                    var store = Manage.positionManage.grid.getStore();
//                    var record = store.getAt(rowIndex);
//                    row_id = record.get("id");
//                }
//            }
            tbar: [
            { 
                xtype: 'textfield', 
                id: 'id'  
            },{ 
                text: '查找',  
                handler: function() { 
                    var value = Ext.getCmp('id').getValue();
                    Ext.Ajax.request({ 
                        url: '/user_parts/search_by_id.json',
                        jsonData: { id: value },
                        success: function(response) { 
                            questions = Ext.decode(response.responseText);
                            //更新修改后台的搜索功能为加上root开头的
                            //{ "content": Ext.decode(response.responseText)};
                            store.loadData(questions);
                        }, 
                        failure: function() { 
                            Ext.Msg.alert('提示', '搜索失败');
                        }
                    });
                }
            }]
        });
    },
    makeSure: function(id) { 
     Ext.Msg.confirm("提示", "确认记录入馆时间？", function(btn) {
      if (btn == 'yes') {
          var user_part_id = { user_part_id : id}
          Ext.Ajax.request({ 
              url:    '/log_users' ,
              method: 'POST',
              jsonData: { log_user: user_part_id },
              success: function(response, opts) { 
                  Ext.Msg.alert("提示", "保存成功");
              },
              failure: function(response, opts) { 
                  Ext.Msg.alert("提示", "保存失败");
              } 
          });
      }
    });
  },

  //查看详细信息
  searchDetail: function(id) { 
      var win = getJobWin();
   //     Ext.Ajax.request({ 
   //         url: String.format('/jobs/{0}/get_job.json', id),
   //         method: 'GET',
   //         success: function(response, option){ 
   //             var content = Ext.util.JSON.decode(response.responseText).content;
   //             Manage.positionManage.form.getForm().setValues(content);
   //         }
   //     });
      win.show();
  },

   getJobWin: function() { 
     var win = new Ext.Window({
          title: '查看出入馆时间记录',
          id: 'Win',
          closeAction: 'hide',
          width: 640,
          height: 350,
          layout: 'fit',
          frame: true,
          //items: this.grid
      });
      return win;
    },

})

