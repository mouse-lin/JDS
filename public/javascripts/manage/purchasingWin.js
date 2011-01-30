Manage.PurchasingWin = Ext.extend(Ext.app.Module,  {
    id: 'purchasing-win',
    init: function() {
        this.launcher = {
            text: '个人资料填写',
            iconCls: 'bogus',
            handler: this.createWindow,
            scope: this
        }
    },

    createWindow: function() {
      _this = Manage.purchasingWin;
      var manage = _this.app.getDesktop();
      var win = manage.getWindow('purchasing-win');
      if(!win) {
            win = manage.createWindow({
               // id: 'orderWindow',
                title: '个人资料填写',
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

