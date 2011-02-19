Manage.ManageWin = Ext.extend(Ext.app.Module,  {
    id: 'manageWin',
    init: function() {
        this.launcher = {
            text: '管理',
            iconCls: 'bogus',
            handler: this.createWindow,
            scope: this
        }
    },

    createWindow: function() {
      var _this = Manage.manageWin;
      var manage = _this.app.getDesktop();
      var win = manage.getWindow('manageWin');
      if(!win) {
            win = manage.createWindow({
                id: 'manageWin',
                title: '管理',
                width: 600,
                height: 450,
                iconCls: 'bogus',
                shim: false,
                animCollapse: false,
                constrainHeader: true,
                layout: 'anchor',
                items: _this.createManageGrid()
            });
          }
        win.show();
    },

  // 初始化用户小组grid界面
    createManageGrid: function(){ 
        var _this = Manage.manageWin;
        cardTypeStore = new Ext.data.JsonStore({ 
            fields: [
                'id',
                'name',
                'remark',
            ],
            root: "content",
            url:'/groups/show_user_groups.json',
            totalProperty:'total',
            method: 'GET'
        });
        cardTypeStore.load({ params:{ offset:0,limit:Page.pageSize }});     

        var pageToolbar = Page.createPagingToolbar(cardTypeStore);

        var addOperator = function(value, mataData, record, rowIndex, colIndex, store){ 
            //var link = String.format('<a href="#" onclick="editJob( {0}, \'edit\' )">查看修改</a>', record.data.id) + '&nbsp;';
            //link += String.format('<a href="#" onclick="deleteJob({0})">删除</a>', record.data.id) + '&nbsp;';
            var link = String.format('<a href="#" onclick="_this.deleteCardType({0})">删除</a>', record.data.id) + '&nbsp;';
            return link;
        };

        //var sm = new Ext.grid.CheckboxSelectionModel();
        var cm = new Ext.grid.ColumnModel([
         //   sm,
            { header: '序号'        , sortable: true, dataIndex: 'id', width:50,hidden: true},
            { header: '小组名称'    , sortable: true, dataIndex: 'name'},
            { header: '小组描述'    , sortable: true, dataIndex: 'description'},
            { header: '操作'        , dataIndex: '#', renderer: addOperator, width: 120 }
        ]);

        var tbar = [ 
            { iconCls: 'add', text: '新增', handler: function(){ _this.createCardTypeWin() }}, '-',
            { iconCls: 'drop', text: '全部删除', handler: function(){ _this.deleteAllCardType() }}, 
        ];

        return cardTypeGrid =  new Ext.grid.EditorGridPanel({ 
            anchor: '100%,100%',
            height: 420,
            viewConfig: { forceFit: true }, // 布局时候grid的表头适应win的大小
            store: cardTypeStore,
            loadMask: {msg:"读取中..."},
            tbar: tbar, 
            listeners:{  'render'　:　function()　{
　　　　　　　　　pageToolbar.render(cardTypeGrid.tbar);
　　　　　  }},
            cm: cm,
        });
    },

    //点击按钮弹出新曾权限小组的window
    createCardTypeWin: function(){ 
        var _this = Manage.manageWin;
        var win = new Ext.Window({
            title: '新建小组',
            id: 'createCardTypeWin',
            width: 640,
            height: 350,
            layout: 'fit',
            frame: true,
            items: _this.createCardTypeForm()
      });
      win.show();
  },

    //添加新的权限小组
    //TODO 还有权限类型需要添加进去
    createCardTypeForm: function(){ 
        // form 的形式
        var _this = Manage.manageWin;
        return  createCardTypePanel =  new Ext.form.FormPanel({ 
            frame: true,
            region: 'center',
            width:640,
            height: 300,
            buttons: [{ 
                text: '保存证件类型', handler: _this.saveCardtype}],
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
                        { fieldLabel: '*证件类型名', id: 'card_type_name' },
                        {
                          width: 300,
                          height: 70,
                          xtype: "textarea",
                          fieldLabel: '小组描述', id: 'card_type_remark' },
                    ]
                }]
          }]
      })
    },

    //保存权限小组
    saveCardtype: function(){ 
        var _this = this;
        Ext.Msg.confirm('提示', "是否保存?", function(button){ 
            if(button == 'no') { 
            } else {  
                var name = Ext.getCmp("card_type_name").getValue();
                if(name == ""){ 
                    Ext.Msg.alert("提示","证件类型名不能为空!");
                }else{  
                    var card_type = { 
                        name : Ext.getCmp("card_type_name").getValue(),
                        description : Ext.getCmp("card_type_remark").getValue()
                    };
                    Ext.Ajax.request({ 
                        url:  '/groups',
                        method: "POST",
                        jsonData: { card_type: card_type },
                        success: function(){
                            Ext.Msg.alert("提示", "保存成功!");
                            cardTypeStore.reload();

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
    deleteCardType: function(id) { 
        Ext.Msg.confirm("提示", "确认删除此小组？", function(btn) {
            if (btn == 'yes') {
                Ext.Ajax.request({ 
                    url:    '/groups/' + id,
                    method: 'DELETE',
                    success: function(response, opts) { 
                    //scope.createGrid().store.load();
                    //暂时用全局
                    cardTypeStore.load();
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
  deleteAllCardType: function(){ 
      Ext.Msg.confirm("提示", "确认删除所有证件类型？", function(btn) {
         if (btn == 'yes') {
             Ext.Ajax.request({ 
                 url:    '/groups/delete_all',
                 method: 'post',
                 success: function(response, opts) { 
                 cardTypeStore.load();
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


