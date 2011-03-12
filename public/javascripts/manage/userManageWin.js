Manage.UserManageWin = Ext.extend(Ext.app.Module,  {
    id: 'userManageWin',
    init: function() {
        this.launcher = {
            text: '每日统计',
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
                   title: '每日统计',
                   width: 1000,
                   height: 650,
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
            activeTab: 1,
            deferredRender: false, // tabpanel 显示切换渲染
            items: [
            { 
                title: '输入出炉数量',
                layout: 'anchor',
                items: [{ anchor: '100%,10%',items:_this.createSearchForm()},{ anchor: '100%,90%',layout: 'anchor', items: _this.createUserManageGrid()}]
            }, { 
                title: '数量统计',
                items: [{ anchor: '100%,10%',items:_this.createMoneySearchForm()},{ anchor: '100%,90%',layout: 'anchor', items: _this.createMoneyStatistc()}]
            }, { 
                title: '金额统计',
                items: [{ anchor: '100%,10%',items:_this.createAccountForm()},{ anchor: '100%,100%', layout: 'anchor', items:_this.createRecordGrid()}]
            }]
      })
  },

  createMoneyStatistc: function(){ 
        var _this = Manage.userManageWin;
        PRcordsStatisticStore = new Ext.data.JsonStore({ 
            fields: [
                'id',
                'name',
                'remain_quantity',
                'price',
                'fail_quantity',
                'p_quantity',
                'all_money'
            ],
            pruneModifiedRecords: true, //每次都会刷新掉commit的信息
            //remoteSort:true,
            root: "content",
            totalProperty:'total',          //support pagetool
            url:'/materials/show_statistic_materials.json',
            method: 'GET'
        });
        PRcordsStatisticStore.load({ params:{ offset:0,limit:Page.pageSize }});     

        function lookAllMoney(value,metaData){ 
            metaData.attr = 'style="background-color:rgb(235,235,235)"';
            var money = 0.0
            Ext.each(PRcordsStatisticStore.getRange(),function(item){ money += item.data.all_money})
            return money
        };

        var pageToolbar = Page.createPagingToolbar(PRcordsStatisticStore);

        var tbar = [ 
            { iconCls: 'search', text: '查询', handler: function(){ _this.searchMaterialPRecords() }}, '-',
        ];

        var cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            { header: '物料'      ,sortable: true, dataIndex: 'name',renderer: Page.renderers.disable},
            { header: '单价'      ,sortable: true, dataIndex: 'price',renderer: Page.renderers.disable},
            { header: '今天总共出炉'  ,sortable: true, dataIndex: 'p_quantity',renderer: Page.renderers.disable},
            { header: '坏掉'  ,sortable: true, dataIndex: 'fail_quantity',renderer: Page.renderers.disable},
            { header: '剩余'  ,sortable: true, dataIndex: 'remain_quantity',renderer: Page.renderers.disable},
            { header: '单物料总价格(元)'   , dataIndex: 'all_money',renderer: Page.renderers.disable},
            { header: '所有物料总价格(元)'   , dataIndex: 'all_money',renderer: lookAllMoney}
        ]);

        return moneyStatisticGrid = new Ext.grid.EditorGridPanel({ 
            viewConfig: { forceFit: true },
            anchor: "100% 100%",
            height:505,
            stripeRows: true,
            region : 'center',
            store: PRcordsStatisticStore,
            loadMask: {msg:"读取中..."},
            cm: cm,
            tbar: tbar,
            listeners:{  'render'　:　function()　{
　　　　　　　　　pageToolbar.render(moneyStatisticGrid.tbar);
            }}
        })
    },

    //按照时间查询物料数量统计
    searchMaterialPRecords: function(){ 
        var date_time = Ext.getCmp("material_p_records_time").getValue().format('Y-m-d');
        Ext.Ajax.request({ 
            url: '/materials/show_statistic_materials.json',
            jsonData: { offset :0, limit: 45, date_time: date_time },
            success: function(response) { 
                questions = Ext.decode(response.responseText);
                PRcordsStatisticStore.loadData(questions);
            }, 
            failure: function() { 
                Ext.Msg.alert('提示', '搜索失败');
            }
       });
    },

    createUserManageGrid: function(){ 
        var _this = Manage.userManageWin;
        recordMaterialStore = new Ext.data.JsonStore({ 
            fields: [
                'id',
                'name',
            ],
            pruneModifiedRecords: true, //每次都会刷新掉commit的信息
            remoteSort:true,
            root: "content",
            totalProperty:'total',          //support pagetool
            url:'/materials/show_materials.json',
            method: 'GET'
        });
        recordMaterialStore.load({ params:{ offset:0,limit:Page.pageSize }});     


        var pageToolbar = Page.createPagingToolbar(recordMaterialStore);

        var tbar = [ 
            { iconCls: 'add', text: '保存', handler: function(){ _this.addPRecords() }}, '-',
        ];

        var cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            { header: '物料'      ,sortable: true, dataIndex: 'name',renderer: Page.renderers.disable},
            { header: '出炉数量'      ,sortable: true, dataIndex: 'quantity',editor:new Ext.form.NumberField()},
            { header: '坏掉'  ,sortable: true, dataIndex: 'fail_quantity',editor:new Ext.form.NumberField()},
            { header: '剩余'  ,sortable: true, dataIndex: 'remain_quantity',editor:new Ext.form.NumberField()},
            { header: '备注'   , dataIndex: 'remark',editor:new Ext.form.NumberField()}
        ]);

        return materialAddNewGrid = new Ext.grid.EditorGridPanel({ 
            viewConfig: { forceFit: true },
            anchor: "100% 100%",
            height:450,
            stripeRows: true,
            region : 'center',
            store: recordMaterialStore,
            loadMask: {msg:"读取中..."},
            cm: cm,
            tbar: tbar ,
            listeners:{  'render'　:　function()　{
　　　　　　　　　pageToolbar.render(materialAddNewGrid.tbar);
            }}
        })
    },

    addPRecords: function(){ 
        var _this = Manage.userManageWin;
        var m = recordMaterialStore.modified.slice(0);
        jsonArray = [];
        Ext.each(m,function(item){ 
          item.data.date_time = Ext.getCmp("p_record_time").getValue();
          jsonArray.push(item.data)
        });

        if(jsonArray == "")
        { Ext.Msg.alert('提示','没有被修改过的物料!') }
        else{  
            Ext.Msg.confirm('提示', "是否确定保存?", function(button){ 
                if(button == 'no') { 
                } else {  
                     Ext.Ajax.request({ 
                         url:  '/p_records',
                         method: "post",
                         jsonData: { p_records: jsonArray },
                         success: function(){
                             Ext.Msg.alert("提示", "保存成功!");
                             recordMaterialStore.reload();

                         },
                         failure: function(response, onpts) {
                             Ext.Msg.alert("提示", "保存失败！");
                         } 
                    });
                  }
            });
        } 
    },

    createRecordGrid: function(){ 
        var _this = Manage.userManageWin;
        AccountStore = new Ext.data.JsonStore({ 
            fields: [
                'id',
                'out',
                'in',
                'date_time',
                'all_money'
            ],
            remoteSort:true,
            root: "content",
            totalProperty:'total',          //support pagetool
            url:'/account/show_accounts.json',
            method: 'GET'
        });
        AccountStore.load({ params:{ offset:0,limit:Page.pageSize }});     

        var tbar = [ 
            { iconCls: 'search', text: '查询', handler: function(){ _this.searchAccount() }}, '-',
            { iconCls: 'add', text: '添加出入帐', handler: function(){ _this.createAccount() }}
        ];

        var factIn = function(value, mataData, record, rowIndex, colIndex, store){ 
            return record.data.in - record.data.out
        };


        var spreadAccount = function(value, mataData, record, rowIndex, colIndex, store){ 
          spreadVaule = record.data.in - record.data.out - record.data.all_money;
          return  spreadVaule < 0? '<div style = "color:red">' +  spreadVaule + '</div>' : spreadVaule
        };

        var pageToolbar = Page.createPagingToolbar(AccountStore);


        var cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            { header: '出帐'      ,sortable: true, dataIndex: 'out',width:150},
            { header: '入账'  ,sortable: true, dataIndex: 'in',width:150},
            { header: '实际收入'      ,sortable: true,dataIndex:'#', renderer:factIn, width:150},
            { header: '理论收入'  ,sortable: true, dataIndex: 'all_money',width:150},
            { header: '差额'  ,sortable: true, dataIndex: '#',width:150, renderer: spreadAccount},
            { header: '时间'  ,sortable: true, dataIndex: 'date_time',width:150},
        ]);

        return recordGrid = new Ext.grid.EditorGridPanel({ 
            viewConfig: { forceFit: true },
            anchor: "100% 100%",
            height: 480,
            stripeRows: true,
            //region : 'center',
            store: AccountStore,
            loadMask: {msg:"读取中..."},
            cm: cm,
            tbar: tbar, 
            listeners:{  'render'　:　function()　{
　　　　　　　　　pageToolbar.render(recordGrid.tbar);
            }}

        })
    },

    searchAccount: function(){ 
        var date_time = Ext.getCmp("account_date_time").getValue().format('Y-m-d');
        Ext.Ajax.request({ 
            url: '/account/show_accounts.json',
            jsonData: { offset :0, limit: 45, date_time: date_time },
            success: function(response) { 
                questions = Ext.decode(response.responseText);
                AccountStore.loadData(questions);
            }, 
            failure: function() { 
                Ext.Msg.alert('提示', '搜索失败');
            }
       });
    },

    createAccount: function(){ 
        if(!Ext.getCmp('createAccount')){  
            var _this = Manage.userManageWin;
            var win = new Ext.Window({
                title: '新建出入帐记录',
                id: 'createAccount',
                width: 400,
                height: 350,
                layout: 'fit',
                frame: true,
                items: _this.createNewAccountForm()
            });
            win.show();
        }
    },

    createNewAccountForm: function(){ 
        var _this = Manage.userManageWin;
        return   new Ext.form.FormPanel({ 
            frame: true,
            region: 'center',
            width:400,
            height: 300,
            buttons: [{ 
                text: '保存', handler: _this.saveAccount}],
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
                        { fieldLabel: '*出帐', id: 'out',xtype: 'numberfield',allowBlank: false },
                        { fieldLabel: '*入账', id: 'in',xtype: 'numberfield',allowBlank: false },
                        { fieldLabel: '日期', id: 'date_time',xtype: 'datefield',width: 150,format: 'Y-m-d',value:new Date},
                    ]
                }]
          }]
      })
    },

    saveAccount: function(){ 
        var _this = Manage.userManageWin;
        Ext.Msg.confirm('提示', "是否保存?", function(button){ 
            if(button == 'no') { 
            } else {  
                var out = Ext.getCmp("out").getValue();
                var in_in = Ext.getCmp("in").getValue();
                var date_time = Ext.getCmp("date_time").getValue();
                var accounts = { 
                        out : out,
                        in : in_in,
                        date_time: date_time
                    };
                    Ext.Ajax.request({ 
                        url:  '/account',
                        method: "POST",
                        jsonData: { accounts: accounts },
                        success: function(){
                            Ext.Msg.alert("提示", "保存成功!");
                            AccountStore.reload();

                        },
                        failure: function(response, onpts) {
                            Ext.Msg.alert("提示", "保存失败！");
                    } 
                });
              }
        }); 
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
                     recordMaterialStore.reload();
                     AccountStore.reload();
                     Ext.Msg.alert("提示", "删除成功")
                 },
                 failure: function(response, opts) { 
                     Ext.Msg.alert("提示", "删除失败");
                 } 
             });
         }
       })
    },

   createAccountForm: function(){ 
        return createManageSearchFormPanel = new Ext.form.FormPanel({ 
            frame: true,
            layout: 'form',
            items: [{ 
                layout: 'column',
                xtype: 'fieldset',
                title: '金额统计信息选择',
                style: 'margin-left:5px;',
                height:48,
                columnWidth: .3,
                items:[{ 
                    layout:'form',
                    defaultType:'textfield',
                    columnWidth: .3,
                    items:[
                        {  xtype: 'datefield', fieldLabel: '时间选择', id: "account_date_time",format: "Y-m-d",value: new Date },
                        {anchor: '100%', fieldLabel: '姓名', id: 'hello' }
                    ]}]
          }],
          keys:[{ 
                key: 13,  
                fn: Manage.userManageWin.searchUserPartsData,
                scope:this 
            }]
      })
  },


    createMoneySearchForm: function(){ 
        return createManageSearchFormPanel = new Ext.form.FormPanel({ 
            frame: true,
            layout: 'form',
            items: [{ 
                layout: 'column',
                xtype: 'fieldset',
                title: '数量统计信息选择',
                style: 'margin-left:5px;',
                height:60,
                items:[{ 
                    layout:'form',
                    defaultType:'textfield',
                    columnWidth: .3,
                    items:[
                        {  xtype: 'datefield', fieldLabel: '时间选择', id: "material_p_records_time",format: "Y-m-d",value: new Date },
                        {anchor: '100%', fieldLabel: '姓名', id: 'cod' }
                    ]}
              ]
          }],
          keys:[{ 
                key: 13,  
                fn: Manage.userManageWin.searchUserPartsData,
                scope:this 
            }]
      })
  },


    createSearchForm: function(){ 
        return createManageSearchFormPanel = new Ext.form.FormPanel({ 
            frame: true,
            layout: 'form',
            items: [{ 
                layout: 'column',
                xtype: 'fieldset',
                title: '输入统计信息选择',
                style: 'margin-left:5px;',
                height:48,
                items:[{ 
                    layout:'form',
                    defaultType:'textfield',
                    columnWidth: .3,
                    items:[
                        {  xtype: 'datefield', fieldLabel: '录入时间', id: "p_record_time",format: "Y-m-d",value: new Date },
                        {anchor: '100%', fieldLabel: '姓名', id: 'user_manage_name' }
                    ]}
              ]
          }],
          keys:[{ 
                key: 13,  
                fn: Manage.userManageWin.searchUserPartsData,
                scope:this 
            }]
      })
  },

  //reset the textfield values
  resetData: function(){ 
      Ext.getCmp('user_manage_id').setValue('');
      Ext.getCmp('user_manage_identity_card').setValue('');
      Ext.getCmp('user_manage_name').setValue('');
      Ext.getCmp('user_manage_birthday').setValue('')
  },

  //search for user_parts data
  searchUserPartsData: function(){ 
      var id = Ext.getCmp('user_manage_id').getValue();
      var identity_card = Ext.getCmp('user_manage_identity_card').getValue();
      var name = Ext.getCmp('user_manage_name').getValue();
      var birthday = Ext.getCmp('user_manage_birthday').getValue();
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
                 recordMaterialStore.loadData(questions);

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

  searchLogAccess: function(id){ 
      var user_id = id;
      var _this = Manage.userManageWin;
      var url = 'reports/edit_user_win?id=' + user_id ;
      var win = new Ext.Window({
          title: '访问量查看',
          id: 'searchLogAccess',
          width: 700,
          height: 500,
          layout: 'fit',
          frame: true,
          items: _this.createReportGrid(id)
      });
      win.show();
  },

   createReportGrid: function(id){ 
        var _this = Manage.userRegisterWin;
        LogReportstore = new Ext.data.JsonStore({ 
            fields: [
                'id',
                'host_id',
                'user_id',
                'ip_id',
                'date_time',
            ],
            remoteSort:true,
            root: "content",
            totalProperty:'total',          //support pagetool
            url:'/reports/log_access_date_for_user?id=' + id,
            method: 'GET'
        });

        LogReportstore.load({ params:{ offset:0,limit:Page.pageSize }});     

        var pageToolbar = Page.createPagingToolbar(LogReportstore);

        var cm = new Ext.grid.ColumnModel([
            { header: '编号'      ,sortable: true, dataIndex: 'id', width:50},
            { header: '用户编号'      ,sortable: true, dataIndex: 'user_id'},
            { header: 'ip的编号'  ,sortable: true, dataIndex: 'ip_id'},
            { header: 'host编号'      ,sortable: true, dataIndex: 'host_id'},
            { header: '时间'  ,sortable: true, dataIndex: 'date_time'},
        ]);

        return ReportGrid = new Ext.grid.EditorGridPanel({ 
            viewConfig: { forceFit: true },
            anchor: "100% 100%",
            height:600,
            stripeRows: true,
            region : 'center',
            store: LogReportstore,
            loadMask: {msg:"读取中..."},
            cm: cm,
            tbar: pageToolbar ,
        });
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

        var tbar = [ 
            //{ iconCls: 'add', text: '添加出入帐记录', handler: function(){ _this.addPRecords() }}, '-',
            //{ iconCls: 'search', text: '查询', handler: function(){ _this.addPRecords() }}, '-',
        ];


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
            cm: cm,
            tbar: tbar, 
            listeners:{  'render'　:　function()　{
　　　　　　　　　pageToolbar.render(Info_grid.tbar);
            }}
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
