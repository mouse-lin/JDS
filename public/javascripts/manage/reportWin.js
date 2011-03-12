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
 //      { 
 //         title: '会员总数统计',
 //         html: '<iframe src="reports/sex_statis" frameborder="0" width="100%" height="100%"></iframe>' 
 //    }, 
 //    { 
 //        title: '年龄比例统计',
 //        html: '<iframe src="reports/age_statis" frameborder="0" width="100%" height="100%"></iframe>' 
 //    },
    { 
         title: '最畅销物料统计',
         html: '<iframe src="reports/card_type_statis" frameborder="0" width="100%" height="100%"></iframe>' 
     },
  //   { 
  //       title: '访问总量统计',
  //       html: '<iframe src="reports/web_statis_f" frameborder="0" width="100%" height="100%"></iframe>' 
  //   },{ 
  //       title: '当天访问总量统计',
  //       html: '<iframe src="reports/web_statis_s" frameborder="0" width="100%" height="100%"></iframe>' 
  //   },
    { 
          title: '库存修改记录查看',
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
                'user_name',
                'quantity',
                'date_time',
                'material_name'
            ],
            remoteSort:true,
            root: "content",
            totalProperty:'total',          //support pagetool
            url:'/records/show_records.json',
            method: 'GET'
        });
        LogReportstore.load({ params:{ offset:0,limit:Page.pageSize }});     

        var pageToolbar = Page.createPagingToolbar(LogReportstore);

        var cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            { header: '用户名'      ,sortable: true, dataIndex: 'user_name',renderer: Page.renderers.disable},
            { header: '物料名'      ,sortable: true, dataIndex: 'material_name',renderer: Page.renderers.disable},
            { header: '修改数量'      ,sortable: true, dataIndex: 'quantity',renderer: Page.renderers.disable},
            { header: '时间'  ,sortable: true, dataIndex: 'date_time',renderer: Page.renderers.disable}
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
