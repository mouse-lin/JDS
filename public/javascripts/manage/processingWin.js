Manage.ProcessingWin = Ext.extend(Ext.app.Module,  {
    id: 'processing-win',
    init: function() {
        this.launcher = {
            text: '报表查看',
            iconCls: 'bogus',
            handler: this.createWindow,
            scope: this
        }
    },

    createWindow: function() {
      _this = Manage.processingWin;
      var manage = _this.app.getDesktop();
      var win = manage.getWindow('processing-win');
      if(!win) {
            win = manage.createWindow({
                id: 'orderWindow',
                title: '报表查看',
                width: 500,
                height: 300,
                iconCls: 'bogus',
                shim: false,
                animCollapse: false,
                constrainHeader: true,
                items: _this.createTabPanel()
            });
          }
        win.show();
    },
     createTabPanel: function(){ 
     return new Ext.TabPanel({ 
       frame: true,
       activeTab: 0,
       width: 500,
       height: 300,
       items: [
       new Ext.Panel(
       { 
          title: '会员总数',
          html: '<iframe src="http://chart.apis.google.com/chart?cht=p3&chd=t:20,80&chs=250x100&chl=男|女" frameborder="0" width="100%" height="100%"></iframe>' 
     }), new Ext.Panel({ 
         title: '年龄比例',
         html: '<iframe src="http://chart.apis.google.com/chart?cht=p3&chd=t:50,40,10&chs=250x100&chl=1-19岁|20-39岁|40-59岁" frameborder="0" width="100%" height="100%"></iframe>' 
     }), new Ext.Panel({ 
         title: '其他成份',
         html: '<iframe src="http://chart.apis.google.com/chart?cht=p3&chd=t:60,20,20&chs=250x100&chl=学生证|社会|工作" frameborder="0" width="100%" height="100%"></iframe>' 
     })
     ]
   })
  }
})


