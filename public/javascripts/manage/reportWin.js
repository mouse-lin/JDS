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
     },{ 
         title: '证件类型统计',
         html: '<iframe src="reports/card_type_statis" frameborder="0" width="100%" height="100%"></iframe>' 
     },{ 
         title: '访问总量统计',
         html: '<iframe src="reports/web_statis_f" frameborder="0" width="100%" height="100%"></iframe>' 
     },{ 
         title: '当天访问总量统计',
         html: '<iframe src="reports/web_statis_s" frameborder="0" width="100%" height="100%"></iframe>' 
     },{ 
          title: '访问量统计',
          layout: 'anchor',
          items: [{ anchor: '100%,90%',layout: 'anchor', items: _this.createReportGrid()}]
     }]
      })
    },

 createReportGrid: function(){ 
        var _this = Manage.userRegisterWin;
        LogReportstore = new Ext.data.JsonStore({ 
            fields: [
                'id',
                'host_id',
                'user_id',
                'ip_id',
                'date_time',
            ],
            remoteSort:true,
            root: "content",
            totalProperty:'total',          //support pagetool
            url:'/reports/log_access_date.json',
            method: 'GET'
        });
        LogReportstore.load({ params:{ offset:0,limit:Page.pageSize }});     

        var pageToolbar = Page.createPagingToolbar(LogReportstore);

        var cm = new Ext.grid.ColumnModel([
            { header: '编号'      ,sortable: true, dataIndex: 'id', width:50},
            { header: '用户编号'      ,sortable: true, dataIndex: 'user_id'},
            { header: 'ip的编号'  ,sortable: true, dataIndex: 'ip_id'},
            { header: 'host编号'      ,sortable: true, dataIndex: 'host_id'},
            { header: '时间'  ,sortable: true, dataIndex: 'date_time'},
        ]);

        return userRegisterGrid = new Ext.grid.EditorGridPanel({ 
            viewConfig: { forceFit: true },
            anchor: "100% 100%",
            height:600,
            stripeRows: true,
            region : 'center',
            store: LogReportstore,
            loadMask: {msg:"读取中..."},
            cm: cm,
            tbar: pageToolbar ,
        });
    }

})
