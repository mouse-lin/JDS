Manage.ClothPartShow = Ext.extend(Ext.app.Module,  {
    id: 'clothPartShow',
   // this.form = createForm();
    init: function() {
        this.launcher = {
            text: '用户小组查看',
            iconCls: 'bogus',
            handler: this.createWindow,
            scope: this
        }
    },

    createWindow: function() {
      _this = Manage.clothPartShow;
      var manage = _this.app.getDesktop();
      var win = manage.getWindow('clothPartShow');
      if(!win) {
            win = manage.createWindow({
                //id: 'orderWindow',
                title: '用户小组查看',
                width: 600,
                height: 450,
                iconCls: 'bogus',
                shim: false,
                animCollapse: false,
                constrainHeader: true,
                items:  _this.createGrid()
            });
          }
        win.show();
    },


    createGrid: function(){ 
        var _this = Manage.clothPartShow;
        store = new Ext.data.JsonStore({ 
            fields: [
                'id',
                'name',
                'description',
            ],
            root: "content",
            url:'/groups.json',
            method: 'GET'
        });
        store.load()

        //var pageToolbar = Wando.createPagingToolbar(store);

        var addOperator = function(value, mataData, record, rowIndex, colIndex, store){ 
            //var link = String.format('<a href="#" onclick="editJob( {0}, \'edit\' )">查看修改</a>', record.data.id) + '&nbsp;';
            //link += String.format('<a href="#" onclick="deleteJob({0})">删除</a>', record.data.id) + '&nbsp;';
            var link = String.format('<a href="#" onclick="_this.deleteJob({0})">删除</a>', record.data.id) + '&nbsp;';
            return link;
        };

        var sm = new Ext.grid.CheckboxSelectionModel();
        var cm = new Ext.grid.ColumnModel([
            sm,
            { header: '序号'        , sortable: true, dataIndex: 'id', width:50},
            { header: '小组名称'    , sortable: true, dataIndex: 'name'},
            { header: '小组描述'    , sortable: true, dataIndex: 'description'},
            { header: '操作'        , dataIndex: '#', renderer: addOperator, width: 120 }
        ]);
//        tbar = [ 
//            { text: '添加小组', handler: function(){ createAddjob("add") }}, '-',
//        ];
//
        return new Ext.grid.EditorGridPanel({ 
            viewConfig: { forceFit: true },
            height:530,
            //title: "小组查看",
            stripeRows: true,
            region : 'center',
            id:'jobGrid',
            store: store,
            loadMask: {msg:"读取中..."},
           // tbar: tbar, 
            //bbar: pageToolbar,
            cm: cm,
            sm: sm,
//            listeners: { 
//                cellclick: function(grid, rowIndex, columnIndex) { 
//                    var store = Manage.positionManage.grid.getStore();
//                    var record = store.getAt(rowIndex);
//                    row_id = record.get("id");
//                }
//            }
        });
    },

      deleteJob: function(id) { 
           Ext.Msg.confirm("提示", "确认删除此小组？", function(btn) {
            if (btn == 'yes') {
                Ext.Ajax.request({ 
                    url:    '/groups/' + id,
                    method: 'DELETE',
                    success: function(response, opts) { 
                        //var scope = Manage.ClothPartShow;
                        //scope.createGrid().store.load();
                        //暂时用全局
                        store.load();
                        Ext.Msg.alert("提示", "删除成功");
                    },
                    failure: function(response, opts) { 
                        Ext.Msg.alert("提示", "删除失败");
                    } 
                });
            }
        });
    },
})
