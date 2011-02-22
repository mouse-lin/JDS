Manage.UserGroupWin = Ext.extend(Ext.app.Module,  {
    id: 'userGroupWin',
    init: function() {
        this.launcher = {
            text: '权限管理',
            iconCls: 'bogus',
            handler: this.createWindow,
            scope: this
        }
    },

    createWindow: function() {
      var _this = Manage.userGroupWin;
      var manage = _this.app.getDesktop();
      var win = manage.getWindow('userGroupWin');
      if(!win) {
            win = manage.createWindow({
                id: 'userGroupWin',
                title: '权限管理',
                width: 900,
                height: 560,
                iconCls: 'bogus',
                shim: false,
                animCollapse: false,
                constrainHeader: true,
                layout: 'fit',
                items: _this.createGroupTabpanel()
            });
          }
        win.show();
    },

 createGroupTabpanel: function(){ 
        var _this = Manage.userGroupWin;
        return new Ext.TabPanel({ 
            frame: true,
            activeTab: 0,
            deferredRender: false, // tabpanel 显示切换渲染
            items: [
            { 
                title: '用户查看',
                layout: 'anchor',
                items: [{ anchor: '100%,10%',items:_this.createSearchForm()},{ anchor: '100%,90%',layout: 'anchor', items: _this.createUserManageGrid()}]
            },  
            { 
                title: '小组查看',
                layout: 'anchor',
                items: _this.createUserGroupGrid()
            }
            /*{ 
                id: 'newPaper',
                title: '设置',
                html: '<iframe src="user_parts/edit_user_part_index" frameborder="0" width="100%" height="100%"></iframe>'
            }*/
            ],
      })
  },

  createUserManageGrid: function(){ 
        var _this = Manage.userGroupWin;
        userGroupstore = new Ext.data.JsonStore({ 
            fields: [
                'id',
                'name',
                'sex',
                'identity_card',
                'paperwork',
                'address',
                'birthday',
                'card_type_name',
                'group_name'
            ],
            remoteSort:true,
            root: "content",
            totalProperty:'total',          //support pagetool
            url:'/user_parts.json',
            method: 'GET'
        });
        userGroupstore.load({ params:{ offset:0,limit:Page.pageSize }});     

        var addOperator = function(value, mataData, record, rowIndex, colIndex, store){ 
            var link = String.format('<a href="#" onclick="Manage.userGroupWin.updateForUser( {0} )">普通用户</a>', record.data.id) + '&nbsp;';
                link += String.format('<a href="#" onclick="Manage.userGroupWin.updateForAdmin( {0} )">普通管理员</a>', record.data.id) + '&nbsp;';
                link += String.format('<a href="#" onclick="Manage.userGroupWin.updateForSystem( {0} )">超级管理员</a>', record.data.id) + '&nbsp;';
            return link;
        };

        var pageToolbar = Page.createPagingToolbar(userGroupstore);
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
            { header: '权限小组'  ,sortable: true, dataIndex: 'group_name'},
            { header: '地址'      ,sortable: true, dataIndex: 'address'},
            { header: '操作小组'        , dataIndex: '#', renderer: addOperator, width: 200 }
        ]);

        return userRegisterGrid = new Ext.grid.EditorGridPanel({ 
            viewConfig: { forceFit: true },
            anchor: "100% 100%",
            height:380,
            stripeRows: true,
            region : 'center',
            store: userGroupstore,
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


//=========================  更新用户权限 ===================================
  updateForUser: function(id,group){ 
      Ext.Msg.confirm("提示", "是否确认更新用户权限？", function(btn) {
         if (btn == 'yes') {
             var user_id =  id
             Ext.Ajax.request({ 
                 url:    '/user_parts/update_for_user.json' ,
                 method: 'post',
                 jsonData: { user_id: user_id },
                 success: function(response, opts) { 
                     userGroupstore.reload();
                     Ext.Msg.alert("提示", "更新成功")
                 },
                 failure: function(response, opts) { 
                     Ext.Msg.alert("提示", "更新失败");
                 } 
             });
         }
       })
  },

  updateForAdmin: function(id,group){ 
      Ext.Msg.confirm("提示", "是否确认更新用户权限？", function(btn) {
         if (btn == 'yes') {
             var user_id =  id
             Ext.Ajax.request({ 
                 url:    '/user_parts/update_for_admin.json' ,
                 method: 'post',
                 jsonData: { user_id: user_id },
                 success: function(response, opts) { 
                     userGroupstore.reload();
                     Ext.Msg.alert("提示", "更新成功")
                 },
                 failure: function(response, opts) { 
                     Ext.Msg.alert("提示", "更新失败");
                 } 
             });
         }
       })
  },

  updateForSystem: function(id,group){ 
      Ext.Msg.confirm("提示", "是否确认更新用户权限？", function(btn) {
         if (btn == 'yes') {
             var user_id =  id
             Ext.Ajax.request({ 
                 url:    '/user_parts/update_for_system.json' ,
                 method: 'post',
                 jsonData: { user_id: user_id },
                 success: function(response, opts) { 
                     userGroupstore.reload();
                     Ext.Msg.alert("提示", "更新成功")
                 },
                 failure: function(response, opts) { 
                     Ext.Msg.alert("提示", "更新失败");
                 } 
             });
         }
       })
  },
//=========================================================================
  //创建搜索窗口
  createSearchForm: function(){ 
        return  createGroupSearchFormPanel = new Ext.form.FormPanel({ 
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
                        { anchor: '100%', fieldLabel: '编号', id: "user_group_id" },
                        { anchor: '100%', fieldLabel: '身份证号', id: "user_group_identity_card" },
                    ]},{ 
                    layout:'form',
                    defaultType:'textfield',
                    columnWidth: .3,
                    items:[
                        {anchor: '100%', fieldLabel: '姓名', id: 'user_group_name' },
                        { anchor: '100%', xtype: 'datefield', fieldLabel: '出生年月', id: "user_group_birthday",format: "Y-m-d" }
                    ]}
              ]
          }], 
          keys:[{ 
                key: 13,  
                fn: Manage.userGroupWin.searchUserPartsData,
                scope:this 
            }]
      })
  },

  //reset the textfield values
  resetData: function(){ 
      Ext.getCmp('user_group_id').setValue('');
      Ext.getCmp('user_group_identity_card').setValue('');
      Ext.getCmp('user_group_name').setValue('');
      Ext.getCmp('user_group_birthday').setValue('')
  },

  //查询
  searchUserPartsData: function(){ 
      var id = Ext.getCmp('user_group_id').getValue();
      var identity_card = Ext.getCmp('user_group_identity_card').getValue();
      var name = Ext.getCmp('user_group_name').getValue();
      var birthday = Ext.getCmp('user_group_birthday').getValue();
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
                 userGroupstore.loadData(questions);

                 //store.proxy=new Ext.data.HttpProxy({url:url});
                 //store.reload({ params:{ offset:0,limit:Page.pageSize } });
             }, 
             failure: function() { 
                 Ext.Msg.alert('提示', '搜索失败');
             }
         })
      }
  },





  // 初始化用户小组grid界面
    createUserGroupGrid: function(){ 
        var _this = Manage.userGroupWin;
        UserGroupStore = new Ext.data.JsonStore({ 
            fields: [
                'id',
                'name',
                'description',
            ],
            root: "content",
            url:'/groups/show_user_groups.json',
            totalProperty:'total',
            method: 'GET'
        });
        UserGroupStore.load({ params:{ offset:0,limit:Page.pageSize }});     

        var pageToolbar = Page.createPagingToolbar(UserGroupStore);

        var addOperator = function(value, mataData, record, rowIndex, colIndex, store){ 
            //var link = String.format('<a href="#" onclick="editJob( {0}, \'edit\' )">查看修改</a>', record.data.id) + '&nbsp;';
            //link += String.format('<a href="#" onclick="deleteJob({0})">删除</a>', record.data.id) + '&nbsp;';
            var link = String.format('<a href="#" onclick="_this.deleteUserGroup({0})">删除</a>', record.data.id) + '&nbsp;';
            return link;
        };

        //var sm = new Ext.grid.CheckboxSelectionModel();
        var cm = new Ext.grid.ColumnModel([
         //   sm,
            { header: '序号'        , sortable: true, dataIndex: 'id', width:50,hidden: true},
            { header: '小组名称'    , sortable: true, dataIndex: 'name'},
            { header: '小组描述'    , sortable: true, dataIndex: 'description'},
            //{ header: '操作'        , dataIndex: '#', renderer: addOperator, width: 120 }
        ]);

        var tbar = [ 
            { iconCls: 'add', text: '新增', handler: function(){ _this.createUserGroupWin() }}, '-',
            { iconCls: 'drop', text: '全部删除', handler: function(){ _this.deleteAllUserGroup() }}, 
        ];

        return UserGroupGrid =  new Ext.grid.EditorGridPanel({ 
            anchor: '100% 100%',
            height: 420,
            viewConfig: { forceFit: true }, // 布局时候grid的表头适应win的大小
            id:'userGroup',
            store: UserGroupStore,
            loadMask: {msg:"读取中..."},
            tbar: pageToolbar,
            //tbar: tbar, 
           // listeners:{  'render'　:　function()　{
　　　　　 // 　　　pageToolbar.render(UserGroupGrid.tbar);
　　　　　 // }},
            //bbar: pageToolbar,  //  分页tool统一显示在上方
            cm: cm,
            //sm: sm,
        });
    },

    //点击按钮弹出新曾权限小组的window
    createUserGroupWin: function(){ 
        var _this = Manage.userGroupWin;
        var win = new Ext.Window({
            title: '新建小组',
            id: 'createUserGroupWin',
            width: 640,
            height: 350,
            layout: 'fit',
            frame: true,
            items: _this.createGroupForm()
      });
      win.show();
  },

    //添加新的权限小组
    //TODO 还有权限类型需要添加进去
    createGroupForm: function(){ 
        // form 的形式
        var _this = Manage.userGroupWin;
        return  createGroupFormPanel =  new Ext.form.FormPanel({ 
            frame: true,
            region: 'center',
            width:640,
            height: 300,
            buttons: [{ 
                text: '保存小组', handler: _this.saveUserGroup}],
            items: [{ 
                layout: 'column',
                xtype: 'fieldset',
                title: '带*号为必填信息',
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



   //保存权限小组
    saveUserGroup: function(){ 
        var _this = this;
        Ext.Msg.confirm('提示', "是否保存?", function(button){ 
            if(button == 'no') { 
            } else {  
                var name = Ext.getCmp("name").getValue();
                if(name == ""){ 
                    Ext.Msg.alert("提示","小组名不能为空!");
                }else{  
                    var group = { 
                        name : Ext.getCmp("name").getValue(),
                        description : Ext.getCmp("remark").getValue()
                    };
                    Ext.Ajax.request({ 
                        url:  '/groups',
                        method: "POST",
                        jsonData: { group: group },
                        success: function(){
                            Ext.Msg.alert("提示", "保存成功!");
                            UserGroupStore.reload();

                        },
                        failure: function(response, onpts) {
                            Ext.Msg.alert("提示", "保存失败！");
                    } 
                });
              }
           }
        }); 
    },

    //删除权限小组
    deleteUserGroup: function(id) { 
        Ext.Msg.confirm("提示", "确认删除此小组？", function(btn) {
            if (btn == 'yes') {
                Ext.Ajax.request({ 
                    url:    '/groups/' + id,
                    method: 'DELETE',
                    success: function(response, opts) { 
                    //scope.createGrid().store.load();
                    //暂时用全局
                    UserGroupStore.load();
                    Ext.Msg.alert("提示", "删除成功");
                    },
                    failure: function(response, opts) { 
                    Ext.Msg.alert("提示", "删除失败");
                    } 
              });
          }
      });
    },

  //删除所有的权限小组
  deleteAllUserGroup: function(){ 
      Ext.Msg.confirm("提示", "确认删除所有小组？", function(btn) {
         if (btn == 'yes') {
             Ext.Ajax.request({ 
                 url:    '/groups/delete_all',
                 method: 'post',
                 success: function(response, opts) { 
                 UserGroupStore.load();
                 Ext.Msg.alert("提示", "删除成功");
                 },
                 failure: function(response, opts) { 
                 Ext.Msg.alert("提示", "删除失败");
                 } 
           });
        }
      });
  },

})

