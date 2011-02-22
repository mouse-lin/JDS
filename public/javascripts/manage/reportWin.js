Manage.ReportWin = Ext.extend(Ext.app.Module,  {
    id: 'reportWin',
    init: function() {
        this.launcher = {
            text: '报表统计',
            iconCls: 'bogus',
            handler: this.createWindow,
            scope: this
        }
    },

    createWindow: function() {
         _this = Manage.reportWin;
         var manage = _this.app.getDesktop();
         var win = manage.getWindow('reportWin');
         if(!win) {
               win = manage.createWindow({
                   id: 'reportWin',
                   title: '报表统计',
                   width: 800,
                   height: 600,
                   iconCls: 'bogus',
                   shim: false,
                   animCollapse: false,
                   constrainHeader: true,
                   layout: 'fit',
                   items: _this.createTabPanel()
               });
             }
           win.show();
  },

     createTabPanel: function(){ 
     return new Ext.TabPanel({ 
       frame: true,
       //deferredRender: false,
       activeTab: 0,
       width: 800,
       height: 600,
       items: [
       { 
          title: '会员总数统计',
          html: '<iframe src="reports/sex_statis" frameborder="0" width="100%" height="100%"></iframe>' 
     }, 
     { 
         title: '年龄比例统计',
         html: '<iframe src="reports/age_statis" frameborder="0" width="100%" height="100%"></iframe>' 
     }, { 
         title: '证件类型统计',
         html: '<iframe src="reports/card_type_statis" frameborder="0" width="100%" height="100%"></iframe>' 
     }, { 
         title: '访问总量统计',
         //html: '<iframe src="reports/card_type_statis" frameborder="0" width="100%" height="100%"></iframe>' 
     }
     ]
   })
  }
})
