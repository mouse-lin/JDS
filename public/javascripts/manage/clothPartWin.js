Manage.ClothPartWin = Ext.extend(Ext.app.Module,  {
    id: 'clothPartWin',
    init: function() {
        this.launcher = {
            text: '用户小组新建',
            iconCls: 'bogus',
            handler: this.createWindow,
            scope: this
        }
    },

    createWindow: function() {
      _this = Manage.clothPartWin;
      var manage = _this.app.getDesktop();
      var win = manage.getWindow('clothPartWin');
      if(!win) {
            win = manage.createWindow({
                //id: 'orderWindow',
                title: '用户小组新建',
                width: 600,
                height: 450,
                iconCls: 'bogus',
                shim: false,
                animCollapse: false,
                constrainHeader: true,
                items:  _this.createForm()
            });
          }
        win.show();
    },

//待用
    createTabPanel: function(){ 
        return new Ext.TabPanel({ 
          frame: true,
          activeTab: 0,
          width: 600,
          height: 450,
          items: [
          new Ext.Panel({ 
            title: '小组新建',
            items: new Ext.Panel(_this.createForm())
          }), new Ext.Panel({ 
            title: '小组查看',
            items: new Ext.Panel(_this.createForm())
          })
        ]
      })
  },
    createForm: function(){ 
        // form 的形式
        return new Ext.form.FormPanel({ 
            frame: true,
            autoHeight: true,
            region: 'center',
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

    createPosition: function(){ 
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
                },
                failure: function(response, onpts) {
                    Ext.Msg.alert("提示", "保存失败！");
                } 
            });
           }
        }); 
    }
})

