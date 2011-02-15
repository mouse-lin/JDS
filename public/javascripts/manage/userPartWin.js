Manage.UserPartWin = Ext.extend(Ext.app.Module,  {
    id: 'userPartWin',
    init: function() {
        this.launcher = {
            text: '个人资料',
            iconCls: 'bogus',
            handler: this.createWindow,
            scope: this
        }
    },

    createWindow: function() {
      _this = Manage.userPartWin;
      var manage = _this.app.getDesktop();
      var win = manage.getWindow('userPartWin');
      if(!win) {
            win = manage.createWindow({
               // id: 'orderWindow',
                title: '个人资料',
                width: 700,
                height: 600,
                iconCls: 'bogus',
                shim: false,
                animCollapse: false,
                constrainHeader: true,
                html: '<iframe src="user_parts/choose_image" frameborder="0" width="100%" height="100%"></iframe>' 

            });
          }
        win.show();
    },
})

