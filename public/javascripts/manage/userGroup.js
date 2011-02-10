Manage.UserGroupWin = Ext.extend(Ext.app.Module,  {
    id: 'userGroupWin',
    init: function() {
        this.launcher = {
            text: '用户小组',
            iconCls: 'bogus',
            handler: this.createWindow,
            scope: this
        }
    },

    createWindow: function() {
      _this = Manage.userGroupWin;
      var manage = _this.app.getDesktop();
      var win = manage.getWindow('userGroupWin');
      if(!win) {
            win = manage.createWindow({
                id: 'UserGroupWin',
                title: '用户小组',
                width: 600,
                height: 450,
                iconCls: 'bogus',
                shim: false,
                animCollapse: false,
                constrainHeader: true,
                layout: 'anchor',
                items: _this.createGrid()
            });
          }
        win.show();
    },

  // 初始化用户小组grid界面
    createGrid: function(){ 
        var _this = Manage.userGroupWin;
        store = new Ext.data.JsonStore({ 
            fields: [
                'id',
                'name',
                'description',
            ],
            root: "content",
            url:'/groups.json',
            method: 'GET'
        });
        store.load()

        var pageToolbar = Page.createPagingToolbar(store);

        var addOperator = function(value, mataData, record, rowIndex, colIndex, store){ 
            //var link = String.format('<a href="#" onclick="editJob( {0}, \'edit\' )">查看修改</a>', record.data.id) + '&nbsp;';
            //link += String.format('<a href="#" onclick="deleteJob({0})">删除</a>', record.data.id) + '&nbsp;';
            var link = String.format('<a href="#" onclick="_this.deleteUserGroup({0})">删除</a>', record.data.id) + '&nbsp;';
            return link;
        };

        var sm = new Ext.grid.CheckboxSelectionModel();
        var cm = new Ext.grid.ColumnModel([
            sm,
            { header: '序号'        , sortable: true, dataIndex: 'id', width:50,hidden: true},
            { header: '小组名称'    , sortable: true, dataIndex: 'name'},
            { header: '小组描述'    , sortable: true, dataIndex: 'description'},
            { header: '操作'        , dataIndex: '#', renderer: addOperator, width: 120 }
        ]);

        tbar = [ 
            { iconCls: 'add', text: '新增', handler: function(){ _this.createUserGroupWin() }}, '-',
            { iconCls: 'drop', text: '全部删除', handler: function(){ _this.deleteAllUserGroup() }}, 
        ];

        return grid =  new Ext.grid.EditorGridPanel({ 
            anchor: '100%,100%',
            height: 420,
            viewConfig: { forceFit: true }, // 布局时候grid的表头适应win的大小
            id:'userGroup',
            store: store,
            loadMask: {msg:"读取中..."},
            tbar: tbar, 
            listeners:{  'render'　:　function()　{
　　　　　　　　　pageToolbar.render(grid.tbar);
　　　　　  }},
            //bbar: pageToolbar,  //  分页tool统一显示在上方
            cm: cm,
            sm: sm,
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
            items: _this.createForm()
      });
      win.show();
  },

    //添加新的权限小组
    //TODO 还有权限类型需要添加进去
    createForm: function(){ 
        // form 的形式
        return new Ext.form.FormPanel({ 
            frame: true,
            region: 'center',
            width:640,
            height: 300,
            closeAction:'hide',
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

    saveUserGroup: function(){ 
        var _this = this;
        Ext.Msg.confirm('提示', "是否保存?", function(button){ 
            if(button == 'no') { 
            } else {  
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
                    store.reload();

                },
                failure: function(response, onpts) {
                    Ext.Msg.alert("提示", "保存失败！");
                } 
            });
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
                    store.load();
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
                 store.load();
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

