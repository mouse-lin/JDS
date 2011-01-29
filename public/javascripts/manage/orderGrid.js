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
                height: 600,
                iconCls: 'bogus',
                shim: false,
                animCollapse: false,
                constrainHeader: true,
                html: '<iframe src="user_parts/edit_user_part_index" frameborder="0" width="100%" height="100%"></iframe>' 
                
            });
          }
        win.show();
    },
})
