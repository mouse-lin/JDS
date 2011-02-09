Manage.OrderWindow = Ext.extend(Ext.app.Module,  {
    id: 'orderWindow',
    init: function() {
        this.launcher = {
            text: '用户管理',
            iconCls: 'bogus',
            handler: this.createWindow,
            scope: this
        }
    },

    createWindow: function() {
         _this = Manage.orderWindow;
         var manage = _this.app.getDesktop();
         var win = manage.getWindow('orderWindow');
         if(!win) {
               win = manage.createWindow({
                   id: 'orderWindow',
                   title: '用户管理',
                   width: 750,
                   height: 530,
                   iconCls: 'bogus',
                   shim: false,
                   animCollapse: false,
                   constrainHeader: true,
                   layout: 'fit',
                   items:this.createTabpanel()
               });
             }
           win.show();
    },

    createTabpanel: function(){ 
        _this = Manage.orderWindow;
        return new Ext.TabPanel({ 
            frame: true,
            activeTab: 0,
            deferredRender: false, // tabpanel 显示切换渲染
            items: [
            { 
                id: 'readPaper',
                title: '用户登记',
                layout: 'anchor',
                items: [{ anchor: '100%,10%',items:_this.createSearchForm()},{ anchor: '100%,90%',layout: 'anchor', items: _this.createGrid()}]
            }, { 
                id: 'oldPaper',
                title: '用户添加',
                //layout: 'anchor',
                html: '<iframe src="user_parts/edit_user_part_index" frameborder="0" width="100%" height="100%"></iframe>'
                //items: [_this.createForm()]
            },
            /*{ 
                id: 'newPaper',
                title: '设置',
                html: '<iframe src="user_parts/edit_user_part_index" frameborder="0" width="100%" height="100%"></iframe>'
            }*/
            ],
      })
  },

  createForm: function(){ 
        // form 的形式
        return new Ext.form.FormPanel({ 
            frame: true,
            anchor: '100%, 100%',
            viewConfig: { forceFit: true },
            closeAction:'hide',
            buttons: [{ 
                text: '保存小组', handler: _this.createPosition}],
            items: [{ 
                anchor: '100%, 100%',
                layout: 'column',
                xtype: 'fieldset',
                title: '带*号为必填信息',
                items: [{ 
                    layout: 'form',
                    items:[{ 
                         xtype: 'textfield', fieldLabel: '一行一列', id:'abc' 
                    }]
                }]
          }]
      })
    },

  createForm_old: function(){ 
    // form 的形式
    return new Ext.form.FormPanel({ 
        frame: true,
        autoHeight: true,
        region: 'center',
        layout: 'form',
        width:600,
        height: 450,
        closeAction:'hide',
        buttons: [{ 
            text: '保存小组', handler: _this.createPosition}],
        items: [{ 
            layout: 'column',
            xtype: 'fieldset',
            title: '带*号为必填信息',
            //autoHeight: true,
            style: 'margin-left:5px;',
            width:1000,
            height:280,
            items:[{ 
                layout:'form',
                defaultType:'textfield',
                items:[
                    { fieldLabel: '*小组名称', id: 'name' },
                    {
                      width: 300,
                      height: 70,
                      xtype: "textarea",
                      fieldLabel: '小组描述', id: 'remark' },
                ]
            }]
      }]
  })
  },

  //Comment: Mouse
  //user detail view 
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
            remoteSort:true,
            root: "content",
            totalProperty:'total',          //support pagetool
            url:'/user_parts.json',
            method: 'GET'
        });
        //store.load()
        store.load({ params:{ offset:0,limit:Page.pageSize } });     

        var addOperator = function(value, mataData, record, rowIndex, colIndex, store){ 
            var link = String.format('<a href="#" onclick="_this.makeSure( {0} )">确定入馆</a>', record.data.id) + '&nbsp;';
                link += String.format('<a href="#" onclick="_this.searchDetail({0})">查看入馆信息</a>', record.data.id) + '&nbsp;';
            return link;
        };

        var pageToolbar = Page.createPagingToolbar(store);

        var cm = new Ext.grid.ColumnModel([
            { header: '编号'      ,sortable: true, dataIndex: 'id', width:50},
            { header: '姓名'      ,sortable: true, dataIndex: 'name'},
            { header: '身份证号'  ,sortable: true, dataIndex: 'identity_card'},
            { header: '性别'      ,sortable: true, dataIndex: 'sex'},
            { header: '出生年月'  ,sortable: true, dataIndex: 'birthday'},
            { header: '地址'      ,sortable: true, dataIndex: 'address'},
            { header: '操作'        , dataIndex: '#', renderer: addOperator, width: 200 }
        ]);
        return new Ext.grid.EditorGridPanel({ 
            viewConfig: { forceFit: true },
            anchor: "100%, 100%",
            height:400,
            stripeRows: true,
            region : 'center',
            id:'jobGrid',
            store: store,
            loadMask: {msg:"读取中..."},
            cm: cm,
            tbar: pageToolbar,
/*
           listeners: { 
               cellclick: function(grid, rowIndex, columnIndex) { 
                   var store = Manage.positionManage.grid.getStore();
                   var record = store.getAt(rowIndex);
                   row_id = record.get("id");
               }
           }

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
                            //Comment: Mouse
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
*/
        });
    },

    //用来响应确认按钮
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

    createSearchForm: function(){ 
        return new Ext.form.FormPanel({ 
            frame: true,
            layout: 'form',
            buttons: [{ 
                text: '查询', handler: _this.searchUserPartsData
            },{ text: '重置', handler: _this.resetData }],
            items: [{ 
                layout: 'column',
                xtype: 'fieldset',
                title: '查询信息',
                style: 'margin-left:5px;',
                height:100,
                items:[{ 
                    layout:'form',
                    defaultType:'textfield',
                    columnWidth: .3,
                    items:[
                        { anchor: '100%', fieldLabel: '编号', id: "id" },
                        { anchor: '100%', fieldLabel: '身份证号', id: "identity_card" },
                    ]},{ 
                    layout:'form',
                    defaultType:'textfield',
                    columnWidth: .3,
                    items:[
                        {anchor: '100%', fieldLabel: '姓名', id: 'name' },
                        { anchor: '100%', xtype: 'datefield', fieldLabel: '出生年月', id: "birthday",format: "Y-m-d" }
                    ]}
              ]
          }]
      })
  },

  //reset the textfield values
  resetData: function(){ 
      Ext.getCmp('number').setValue('');
      Ext.getCmp('identity_card').setValue('');
      Ext.getCmp('name').setValue('');
      Ext.getCmp('birthday').setValue('');
  },

  //search for user_parts data
  searchUserPartsData: function(){ 
      var id = Ext.getCmp('id').getValue();
      var identity_card = Ext.getCmp('identity_card').getValue();
      var name = Ext.getCmp('name').getValue();
      var birthday = Ext.getCmp('birthday').getValue();

     // var condition = ""
     // //var condition =  {  id_like: id, identity_card_like: identity_card, name_like: name, birthday_like: birthday };
     // condition += "identity_card_like =>" +identity_card
     // var url =  '/user_parts/search_user_parts.json?search='+condition ;
     //         store.removeAll();
     //         store.proxy = new Ext.data.HttpProxy({url:url});
     //         store.load({ params:{ offset:0,limit:Page.pageSize } });


      Ext.Ajax.request({ 
          url: '/user_parts/search_user_parts.json',
          jsonData: { search : { id_like: id, identity_card_like: identity_card, name_like: name, birthday_like: birthday} },
          success: function(response) { 
              questions = Ext.decode(response.responseText);
              //Comment: Mouse
              //更新修改后台的搜索功能为加上root开头的
              //{ "content": Ext.decode(response.responseText)};
              store.loadData(questions);

              //store.proxy=new Ext.data.HttpProxy({url:url});
              //store.reload({ params:{ offset:0,limit:Page.pageSize } });
          }, 
          failure: function() { 
              Ext.Msg.alert('提示', '搜索失败');
          }
      });
  }
})
