Manage.UserSettingWin = Ext.extend(Ext.app.Module,  {
    id: 'userSettingWin',
    init: function() {
        this.launcher = {
            text: '设置',
            iconCls: 'settings',
            handler: this.createWindow,
            scope: this
        }
    },

    createWindow: function() {
      _this = Manage.userSettingWin;
      var manage = _this.app.getDesktop();
      var win = manage.getWindow('userSettingWin');
      if(!win) {
            win = manage.createWindow({
                id: 'userSettingWin',
                title: '设置',
                width: 850,
                height: 600,
                iconCls: 'bogus',
                shim: false,
                animCollapse: false,
                constrainHeader: true,
                layout: 'fit',
                items: this.createTabPanel()

            });
          }
        win.show();
    },

    createTabPanel: function(){ 
        return new Ext.TabPanel({ 
            frame: true,
            activeTab: 0,
            deferredRender: false, // tabpanel 显示切换渲染
            items: [
            { 
                id: 'userDetails',
                title: '个人资料',
                layout: 'anchor',
                html: '<iframe src="user_parts/choose_image" frameborder="0" width="100%" height="100%"></iframe>' 
            }, 
            ],
      })
    },

})

