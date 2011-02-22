Manage.UserManageWin = Ext.extend(Ext.app.Module,  {
    id: 'userManageWin',
    init: function() {
        this.launcher = {
            text: '用户管理',
            iconCls: 'bogus',
            handler: this.createWindow,
            scope: this
        }
    },

    createWindow: function() {
         var _this = Manage.userManageWin;
         var manage = _this.app.getDesktop();
         var win = manage.getWindow('userManageWin');
         if(!win) {
               win = manage.createWindow({
                   id: 'userManageWin',
                   title: '用户管理',
                   width: 900,
                   height: 560,
                   iconCls: 'bogus',
                   shim: false,
                   animCollapse: false,
                   constrainHeader: true,
                   layout: 'fit',
                   items:this.createUserManageTabpanel()
               });
             }
           win.show()
    },

    createUserManageTabpanel: function(){ 
        var _this = Manage.userManageWin;
        return new Ext.TabPanel({ 
            frame: true,
            activeTab: 0,
            deferredRender: false, // tabpanel 显示切换渲染
            items: [
            { 
                title: '资料修改',
                layout: 'anchor',
                items: [{ anchor: '100%,10%',items:_this.createSearchForm()},{ anchor: '100%,90%',layout: 'anchor', items: _this.createUserManageGrid()}]
            }, { 
                title: '用户添加',
                html: '<iframe src="user_parts/edit_user_part_index" frameborder="0" width="100%" height="100%"></iframe>'
            }, { 
                title: '记录查看',
                items: { anchor: '100%,100%', layout: 'anchor', items:_this.createRecordGrid()}
            }]
      })
  },


  //Comment: Mouse
  //user detail view 
      createUserManageGrid: function(){ 
        var _this = Manage.userManageWin;
        userManagestore = new Ext.data.JsonStore({ 
            fields: [
                'id',
                'name',
                'sex',
                'identity_card',
                'paperwork',
                'address',
                'birthday',
                'card_type_name'
            ],
            remoteSort:true,
            root: "content",
            totalProperty:'total',          //support pagetool
            url:'/user_parts.json',
            method: 'GET'
        });
        userManagestore.load({ params:{ offset:0,limit:Page.pageSize }});     

        var addOperator = function(value, mataData, record, rowIndex, colIndex, store){ 
            var link = String.format('<a href="#" onclick="Manage.userManageWin.editUser( {0} )">更新</a>', record.data.id) + '&nbsp;';
                link += String.format('<a href="#" onclick="Manage.userManageWin.deleteuser({0})">删除</a>', record.data.id) + '&nbsp;';
            return link;
        };

        var pageToolbar = Page.createPagingToolbar(userManagestore);
        var tbar = [ 
            { iconCls: 'search', text: '查询', handler: function(){ _this.searchUserPartsData() }}, '-',
            { iconCls: 'drop', text: '重置', handler: function(){ _this.resetData() }}, 
        ];

        var cm = new Ext.grid.ColumnModel([
            { header: '编号'      ,sortable: true, dataIndex: 'id', width:50},
            { header: '姓名'      ,sortable: true, dataIndex: 'name'},
            { header: '身份证号'  ,sortable: true, dataIndex: 'identity_card',width:150},
            { header: '性别'      ,sortable: true, dataIndex: 'sex'},
            { header: '出生年月'  ,sortable: true, dataIndex: 'birthday'},
            { header: '证件类型'  ,sortable: true, dataIndex: 'card_type_name'},
            { header: '地址'      ,sortable: true, dataIndex: 'address'},
            { header: '操作'        , dataIndex: '#', renderer: addOperator, width: 200 }
        ]);

        return userRegisterGrid = new Ext.grid.EditorGridPanel({ 
            viewConfig: { forceFit: true },
            anchor: "100% 100%",
            height:380,
            stripeRows: true,
            region : 'center',
            store: userManagestore,
            loadMask: {msg:"读取中..."},
            cm: cm,
            tbar: tbar ,
            listeners:{  'render'　:　function()　{
　　　　　　　　　pageToolbar.render(userRegisterGrid.tbar);
            }}
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
        })
    },

    createRecordGrid: function(){ 
        var _this = Manage.userManageWin;
        recordStore = new Ext.data.JsonStore({ 
            fields: [
                'id',
                'user_name',
                'ip',
                'user_operte_id',
                'user_operate_name',
                'user_operate_id_card',
                'operation',
                'created_at',
            ],
            remoteSort:true,
            root: "content",
            totalProperty:'total',          //support pagetool
            url:'/log_options/show_log_options.json',
            method: 'GET'
        });
        recordStore.load({ params:{ offset:0,limit:Page.pageSize }});     

        var pageToolbar = Page.createPagingToolbar(recordStore);

        var cm = new Ext.grid.ColumnModel([
            //{ header: '编号'      ,sortable: true, dataIndex: 'id', width:50},
            { header: '姓名'      ,sortable: true, dataIndex: 'user_name',width:150},
            { header: 'ip'  ,sortable: true, dataIndex: 'ip',width:150},
            { header: '被操作用户'      ,sortable: true, dataIndex: 'user_operate_name',width:150},
            { header: '操作方式'  ,sortable: true, dataIndex: 'operation',width:150},
            { header: '操作时间'  ,sortable: true, dataIndex: 'created_at',width:150},
           // { header: '操作'        , dataIndex: '#', renderer: addOperator, width: 200 }
        ]);

        return recordGrid = new Ext.grid.EditorGridPanel({ 
            viewConfig: { forceFit: true },
            anchor: "100% 100%",
            height: 480,
            stripeRows: true,
            //region : 'center',
            store: recordStore,
            loadMask: {msg:"读取中..."},
            cm: cm,
            tbar: pageToolbar ,
        })
    },


    //用来响应确认按钮
    deleteuser: function(id) { 
        Ext.Msg.confirm("提示", "是否确认删除用户？", function(btn) {
         if (btn == 'yes') {
             var user_id =  id
             Ext.Ajax.request({ 
                 url:    '/user_parts/delete_user.json' ,
                 method: 'post',
                 jsonData: { user_id: user_id },
                 success: function(response, opts) { 
                     userManagestore.reload();
                     recordStore.reload();
                     Ext.Msg.alert("提示", "删除成功")
                 },
                 failure: function(response, opts) { 
                     Ext.Msg.alert("提示", "删除失败");
                 } 
             });
         }
       })
    },

    createSearchForm: function(){ 
        return createSearchFormPanel = new Ext.form.FormPanel({ 
            frame: true,
            layout: 'form',
            //keys:[  {  key: [10,13],  fn:Manage.userManageWin.searchUserPartsData() }],
            //此处button 的两个功能移到下面 grid 的 tabr
            // buttons: [{ 
            //     text: '查询', handler: _this.searchUserPartsData
            // },{ text: '重置', handler: _this.resetData }],
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
                        { anchor: '100%', fieldLabel: '编号', id: "user_id" },
                        { anchor: '100%', fieldLabel: '身份证号', id: "user_identity_card" },
                    ]},{ 
                    layout:'form',
                    defaultType:'textfield',
                    columnWidth: .3,
                    items:[
                        {anchor: '100%', fieldLabel: '姓名', id: 'user_name' },
                        { anchor: '100%', xtype: 'datefield', fieldLabel: '出生年月', id: "user_birthday",format: "Y-m-d" }
                    ]}
              ]
          }]
      })
  },

  //reset the textfield values
  resetData: function(){ 
      Ext.getCmp('user_id').setValue('');
      Ext.getCmp('user_identity_card').setValue('');
      Ext.getCmp('user_name').setValue('');
      Ext.getCmp('user_birthday').setValue('')
  },

  //search for user_parts data
  searchUserPartsData: function(){ 
      var id = Ext.getCmp('user_id').getValue();
      var identity_card = Ext.getCmp('user_identity_card').getValue();
      var name = Ext.getCmp('user_name').getValue();
      var birthday = Ext.getCmp('user_birthday').getValue();
      if(birthday != "" )
        birthday = birthday.format('Y-m-d');
      if(id == "" && identity_card ==  "" && name == "" && birthday == ""){ 
          Ext.Msg.alert("提示","查询信息不能都为空!")
      } 
      else{ 

     // var condition = ""
     // //var condition =  {  id_like: id, identity_card_like: identity_card, name_like: name, birthday_like: birthday };
     // condition += "identity_card_like =>" +identity_card
     // var url =  '/user_parts/search_user_parts.json?search='+condition ;
     //         store.removeAll();
     //         store.proxy = new Ext.data.HttpProxy({url:url});
     //         store.load({ params:{ offset:0,limit:Page.pageSize } });

         Ext.Ajax.request({ 
             url: '/user_parts/search_user.json',
             jsonData: { search : { id_like: id, identity_card_like: identity_card, name_like: name, birthday_like: birthday} },
             success: function(response) { 
                 questions = Ext.decode(response.responseText);
                 //Comment: Mouse
                 //更新修改后台的搜索功能为加上root开头的
                 //{ "content": Ext.decode(response.responseText)};
                 userManagestore.loadData(questions);

                 //store.proxy=new Ext.data.HttpProxy({url:url});
                 //store.reload({ params:{ offset:0,limit:Page.pageSize } });
             }, 
             failure: function() { 
                 Ext.Msg.alert('提示', '搜索失败');
             }
         })
      }
  },

  //入馆记录窗口
  editUser: function(id){ 
      var user_id = id;
      var _this = Manage.userManageWin;
      var url = 'user_parts/edit_user_win?id=' + user_id ;
      var win = new Ext.Window({
          title: '更新用户',
          id: 'editUser',
          width: 700,
          height: 500,
          layout: 'fit',
          frame: true,
          items: { html:'<iframe src='+ url + "frameborder='0' frameborder='0'  width='100%' height='100%'></iframe>"}
      });
      win.show();
  },

 createUserInfoDetailGrid: function(user_id){
        var _this = Manage.userManageWin;
        Info_store = new Ext.data.JsonStore({ 
            fields: [
                'id',
                'date_time',
            ],
            root: "content",
            url:'/log_users.json?id=' + user_id ,
            totalProperty:'total',
            method: 'GET'
        });
        Info_store.load({ params:{ offset:0,limit:Page.pageSize } });     

        var pageToolbar = Page.createPagingToolbar(Info_store);

        var cm = new Ext.grid.ColumnModel([
            { header: '序号'        , sortable: true, dataIndex: 'id', width:50},
            { header: '入馆时间'    , sortable: true, dataIndex: 'date_time'},
        ]);

        return Info_grid =  new Ext.grid.EditorGridPanel({ 
            anchor: '100%,100%',
            height: 420,
            viewConfig: { forceFit: true }, // 布局时候grid的表头适应win的大小
            id:'Info_grid',
            store: Info_store,
            loadMask: {msg:"读取中..."},
            tbar: pageToolbar, 
            cm: cm,
        });
 },

  personalityDetail: function(id){ 
      var user_id = id;
      var _this = Manage.userManageWin;
      var url = 'user_parts/personality_detail?id=' + user_id ;
      var win = new Ext.Window({
          title: '详细资料',
          id: 'personalityDetail',
          width: 700,
          height: 400,
          layout: 'fit',
          frame: true,
          //items: _this.createUserInfoDetailGrid(user_id)
          items: { html:'<iframe src='+ url + "frameborder='0' frameborder='0'  width='100%' height='100%'></iframe>"}
      });
      win.show();
  },
})
