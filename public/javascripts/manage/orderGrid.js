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
                   width: 700,
                   height: 630,
                   iconCls: 'bogus',
                   constrainHeader: true,
                   //shim: false,
                   //animCollapse: false,
                   //constrainHeader: true,
                   //html: '<iframe src="user_parts/edit_user_part_index" frameborder="0" width="100%" height="100%"></iframe>' 
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
            //width: 700,
            //height: 600,
           // defaults:{autoScroll: true},
           // autoWidth:true,
           // style:{ padding:"5px"},
            //autoHeight: true,
            items: [
            { 
                id: 'readPaper',
                title: '用户查看',
                //html: '<iframe src="user_parts/edit_user_part_index" frameborder="0" width="100%" height="100%"></iframe>'
                layout: 'border',
                 items: [_this.createForm_old()]
            }, { 
                id: 'oldPaper',
                title: '用户添加',
                layout: 'anchor',
                //html: '<iframe src="user_parts/edit_user_part_index" frameborder="0" width="100%" height="100%"></iframe>'
                items: [_this.createForm()]
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
})
