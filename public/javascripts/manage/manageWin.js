Manage.ManageWin = Ext.extend(Ext.app.Module,  {
    id: 'manageWin',
    init: function() {
        this.launcher = {
            text: '库存查看',
            iconCls: 'bogus',
            handler: this.createWindow,
            scope: this
        }
    },

    createWindow: function() {
      var _this = Manage.manageWin;
      var manage = _this.app.getDesktop();
      var win = manage.getWindow('manageWin');
      if(!win) {
            win = manage.createWindow({
                id: 'manageWin',
                title: '库存查看',
                width: 1000,
                height: 650,
                iconCls: 'bogus',
                shim: false,
                animCollapse: false,
                constrainHeader: true,
                layout: 'fit',
                items: this.createManageWinTabpanel()
            });
          }
        win.show();
    },

    createManageWinTabpanel: function(){ 
        var _this = Manage.manageWin;
        return new Ext.TabPanel({ 
            frame: true,
            activeTab: 0,
            deferredRender: false, // tabpanel 显示切换渲染
            items: [
            { 
                title: '物料信息',
                layout: 'anchor',
                //items:[{ anchor: '100%,10%',items:_this.createSearchForm()},{anchor: '100%,90%',layout: 'anchor', items:_this.createManageGrid()}]
                items:{ anchor: '100%,90%',layout: 'anchor', items:_this.createManageGrid() }
            },{ 
                title: '单位信息',
                items:[{ anchor: '100%,10%',items:_this.createUnitSearchForm()},{anchor: '100%,90%',layout: 'anchor', items:_this.createUnitGrid()}]
            }]
      })
  },

  createSearchForm: function(){ 
        return createSearchFormPanel = new Ext.form.FormPanel({ 
            frame: true,
            layout: 'form',
            //此处button 的两个功能移到下面 grid 的 tabr
            // buttons: [{ 
            //     text: '查询', handler: _this.searchUserPartsData
            // },{ text: '重置', handler: _this.resetData }],
            items: [{ 
                layout: 'column',
                xtype: 'fieldset',
                title: '查询信息',
                style: 'margin-left:5px;',
                height:100,
                items:[{ 
                    layout:'form',
                    defaultType:'textfield',
                    columnWidth: .3,
                    items:[
                        { anchor: '100%', fieldLabel: '编号', id: "user_id" },
                        { anchor: '100%', fieldLabel: '身份证号', id: "user_identity_card" },
                    ]},{ 
                    layout:'form',
                    defaultType:'textfield',
                    columnWidth: .3,
                    items:[
                        {anchor: '100%', fieldLabel: '姓名', id: 'user_name' },
                        { anchor: '100%', xtype: 'datefield', fieldLabel: '出生年月', id: "user_birthday",format: "Y-m-d" }
                    ]}
              ]
          }],
          keys:[{ 
                key: 13,  
                fn: Manage.userRegisterWin.searchUserPartsData,
                scope:this 
            }]
      })
  },

  // 初始化库存grid界面
  createManageGrid: function(){ 
        var _this = Manage.manageWin;
        MaterialStore = new Ext.data.JsonStore({ 
            fields: [
                'id',
                'name',
                'quantity',
                'remark',
                'price',
                'unit',
                'add_quantity',
                'add_quantity_show',
                'predict_quantity'
            ],
            pruneModifiedRecords: true, //每次都会刷新掉commit的信息
            root: "content",
            url:'/materials/show_materials.json',
            totalProperty:'total',
            method: 'GET',
            id: "material_store"
        });
        MaterialStore.load({ params:{ offset:0,limit:Page.pageSize }});     

        var pageToolbar = Page.createPagingToolbar(MaterialStore);

        var addOperator = function(value, mataData, record, rowIndex, colIndex, store){ 
            var link = String.format('<a href="#" onclick="Manage.manageWin.createMaterials({0})">更新物料资料</a>', record.data.id) + '&nbsp;';
            return link;
        };

        var showTime = function(value, mataData, record, rowIndex, colIndex, store){ 
            mataData.attr = 'style="background-color:rgb(235,235,235)"';
            if(record.data.predict_quantity == null) 
                return '<div style = "color:blue">' + "没有预估的卖量!" + '</div>'
            else{  
                time = record.data.quantity/record.data.predict_quantity
                return time < 1.5? '<div style = "color:red">' + time + '</div>' : time
            }
        };

        unit_store =  new Ext.data.JsonStore({ 
            fields: [
                'name',
                'id',
            ],
            root: "content",
            url:'/units/show_units.json',
            totalProperty:'total',
            method: 'GET'
        });

        var cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            { header: '物料'    , sortable: true, dataIndex: 'name',editor:new Ext.form.TextField()},
            { header: '库存'    , sortable: true, dataIndex: 'quantity',renderer: Page.renderers.disable},
            { header: '单价'    , sortable: true, dataIndex: 'price',editor:new Ext.form.NumberField()},
            { header: '单位'    , sortable: true, dataIndex: 'unit',editor:new Ext.grid.GridEditor(new Ext.form.ComboBox({ 
                store: unit_store,
                id: "unit_combox",
                triggerAction: 'all',
                valueField: 'id',
                displayField: 'name',
                readOnly: true
            })),renderer: function(name,cellmeta,record){
                  return name;
            }},
            { header: '备注', sortable: true, dataIndex: 'remark',editor:new Ext.form.TextField()},
            { header: '添加库存' , sortable: true, dataIndex: 'add_quantity_show',editor:new Ext.form.NumberField()},
            { header: '平均卖出数量(默认)' , sortable: true, dataIndex: 'predict_quantity',editor:new Ext.form.NumberField()},
            { header: '库存预计还能卖的天数' , sortable: true, dataIndex: '#',renderer: showTime},
        ]);

        var tbar = [ 
            { iconCls: 'add', text: '物料库存全部更新', handler: function(){ _this.addMaterialsQuantity() }}, '-',
            { iconCls: 'add', text: '物料新增', handler: function(){ _this.createMaterials() }}, '-',
        ];

        return materialsGrid =  new Ext.grid.EditorGridPanel({ 
            anchor: '100%,100%',
            height: 590,
            viewConfig: { forceFit: true }, // 布局时候grid的表头适应win的大小
            store: MaterialStore,
            loadMask: {msg:"读取中..."},
            tbar: tbar, 
            listeners:{  'render'　:　function()　{
　　　　　　　　　pageToolbar.render(materialsGrid.tbar);
　　　　　  }},
            cm: cm,
        });
    },

  //添加新的物料库存
    addMaterialsQuantity: function(){ 
        var _this = Manage.manageWin;
        var m = MaterialStore.modified.slice(0);
        jsonArray = [];
        Ext.each(m,function(item){ 
          jsonArray.push(item.data)
        });

        if(jsonArray == "")
        { Ext.Msg.alert('提示','没有被修改过的物料!') }
        else{  
            Ext.Msg.confirm('提示', "是否确定保存?", function(button){ 
                if(button == 'no') { 
                } else {  
                     Ext.Ajax.request({ 
                         url:  '/materials/update_materials_quantity',
                         method: "post",
                         jsonData: { materials: jsonArray },
                         success: function(){
                             Ext.Msg.alert("提示", "保存成功!");
                             MaterialStore.reload();

                         },
                         failure: function(response, onpts) {
                             Ext.Msg.alert("提示", "保存失败！");
                         } 
                    });
                  }
            });
        } 
    },

    createUnitSearchForm: function(){ 
        return createUnitSearchFormPanel = new Ext.form.FormPanel({ 
            frame: true,
            layout: 'form',
            //此处button 的两个功能移到下面 grid 的 tabr
             buttons: [{ 
                 text: '查询',  
             },{ text: '重置',  }],
            items: [{ 
                layout: 'column',
                xtype: 'fieldset',
                title: '查询信息',
                height:70,
                items:[{ 
                    layout:'form',
                    defaultType:'textfield',
                    columnWidth: .3,
                    items:[
                        { anchor: '100%', fieldLabel: '单位名称', id: "unit_name" },
                        {anchor: '100%', fieldLabel: '创建时间', id: 'unit_date',xtype:'datefield',width:125 },
                    ]}
              ]
          }]
      })
  },

  // 初始化库存grid界面
    createUnitGrid: function(){ 
        var _this = Manage.manageWin;
        UnitStore = new Ext.data.JsonStore({ 
            fields: [
                'id',
                'name',
                'remark',
            ],
            root: "content",
            url:'/units/show_units.json',
            totalProperty:'total',
            method: 'GET'
        });
        UnitStore.load({ params:{ offset:0,limit:Page.pageSize }});     

        var pageToolbar = Page.createPagingToolbar(UnitStore);

        var addOperator = function(value, mataData, record, rowIndex, colIndex, store){ 
            //var link = String.format('<a href="#" onclick="editJob( {0}, \'edit\' )">查看修改</a>', record.data.id) + '&nbsp;';
            //link += String.format('<a href="#" onclick="deleteJob({0})">删除</a>', record.data.id) + '&nbsp;';
            var link = String.format('<a href="#" onclick="_this.deleteCardType({0})">删除</a>', record.data.id) + '&nbsp;';
            return link;
        };

        var cm = new Ext.grid.ColumnModel([
            { header: '单位名称'    , sortable: true, dataIndex: 'name'},
            { header: '备注'    , sortable: true, dataIndex: 'remark'},
            { header: '操作'        , dataIndex: '#', renderer: addOperator, width: 120 }
        ]);

        var tbar = [ 
            { iconCls: 'add', text: '单位新增', handler: function(){ _this.createUnits() }}, '-',
            //{ iconCls: 'drop', text: '全部删除', handler: function(){ _this.deleteAllCardType() }}, 
        ];

        return unitGridPanel =  new Ext.grid.EditorGridPanel({ 
            anchor: '100%,100%',
            height: 450,
            viewConfig: { forceFit: true }, // 布局时候grid的表头适应win的大小
            store: UnitStore,
            loadMask: {msg:"读取中..."},
            tbar: tbar, 
            listeners:{  'render'　:　function()　{
　　　　　　　　　pageToolbar.render(unitGridPanel.tbar);
　　　　　  }},
            cm: cm,
        });
    },

    //单位添加窗口
    createUnits: function(){ 
      if(!Ext.getCmp('createUnits')){  
          var _this = Manage.manageWin;
          var win = new Ext.Window({
              title: '新建单位',
              id: 'createUnits',
              width: 400,
              height: 350,
              layout: 'fit',
              frame: true,
              items: _this.createUnitsForm()
          });
          win.show();
      }
    },

    createUnitsForm: function(){ 
        var _this = Manage.manageWin;
        return  createUnitPanel =  new Ext.form.FormPanel({ 
            frame: true,
            region: 'center',
            width:400,
            height: 300,
            buttons: [{ 
                text: '保存单位', handler: _this.saveUints}],
            items: [{ 
                layout: 'column',
                xtype: 'fieldset',
                title: '带*号为必填信息',
                style: 'margin-left:5px;',
                width:1000,
                height:280,
                items:[{ 
                    layout:'form',
                    defaultType:'textfield',
                    items:[
                        { fieldLabel: '*单位名称', id: 'create_unit_name' },
                        { fieldLabel: '备注', id: 'unit_remark'},
                    ]
                }]
          }]
      })
    },

    saveUints: function(){ 
        var _this = Manage.manageWin;
        Ext.Msg.confirm('提示', "是否保存?", function(button){ 
            if(button == 'no') { 
            } else {  
                var name = Ext.getCmp("create_unit_name").getValue();
                if(name == ""){ 
                    Ext.Msg.alert("提示","单位名称不能为空!");
                }else{  
                     var units = { 
                        name : Ext.getCmp("create_unit_name").getValue(),
                        remark : Ext.getCmp("unit_remark").getValue(),
                    };
                    Ext.Ajax.request({ 
                        url:  '/units',
                        method: "POST",
                        jsonData: { units: units },
                        success: function(){
                            Ext.Msg.alert("提示", "保存成功!");
                            UnitStore.reload();

                        },
                        failure: function(response, onpts) {
                            Ext.Msg.alert("提示", "保存失败！");
                    } 
                });
              }
           }
        }); 
    },

    createMaterials: function(){ 
      if(!Ext.getCmp('createMaterials')){
           var _this = Manage.manageWin;
           var win = new Ext.Window({
               title: '新建/修改物料',
               id: 'createMaterials',
               width: 400,
               height: 350,
               layout: 'fit',
               frame: true,
               items: _this.createMaterialsForm()
           });
          win.show();
     }
  },

    //添加|编辑物料
    createMaterialsForm: function(){ 
        var _this = Manage.manageWin;
        var unit_store =  new Ext.data.JsonStore({ 
            fields: [
                'id',
                'name',
            ],
            root: "content",
            url:'/units/show_units.json',
            totalProperty:'total',
            method: 'GET'
        });
        unit_store.load();
        var unit_combox = new Ext.form.ComboBox({ 
            id: 'unit_id',
            store: unit_store,
            emptyText: '请选择单位',
            width: 150,
            mode: 'local',
            displayField: 'name',
            valueField: 'id',
            fieldLabel: '单位',
            triggerAction: 'all',
            readOnly: true
        });
        return  new Ext.form.FormPanel({ 
            frame: true,
            region: 'center',
            width:400,
            height: 300,
            buttons: [{ 
                text: '保存', handler: _this.saveMaterials}],
            items: [{ 
                layout: 'column',
                xtype: 'fieldset',
                title: '带*号为必填信息',
                style: 'margin-left:5px;',
                width:1000,
                height:280,
                items:[{ 
                    layout:'form',
                    defaultType:'textfield',
                    items:[
                        { fieldLabel: '*物料名', id: 'material_name' },
                        { fieldLabel: '库存', id: 'material_quantity',xtype: 'numberfield' },
                        { fieldLabel: '单价', id: 'material_price',xtype: 'numberfield' },
                        { fieldLabel: '备注', id: 'material_remark' },
                        unit_combox
                    ]
                }]
          }]
      })
    },

    saveMaterials: function(){ 
        var _this = Manage.manageWin;
        Ext.Msg.confirm('提示', "是否保存?", function(button){ 
            if(button == 'no') { 
            } else {  
                var name = Ext.getCmp("material_name").getValue();
                if(name == ""){ 
                    Ext.Msg.alert("提示","物料名不能为空!");
                }else{  
                     var price_params = [{ price:Ext.getCmp("material_price").getValue() }];
                     var materials = { 
                        name : Ext.getCmp("material_name").getValue(),
                        quantity : Ext.getCmp("material_quantity").getValue(),
                        remark : Ext.getCmp("material_remark").getValue(),
                        unit_id : Ext.getCmp("unit_id").getValue(),
                        prices_params: price_params
                    };
                    Ext.Ajax.request({ 
                        url:  '/materials',
                        method: "POST",
                        jsonData: { materials: materials },
                        success: function(){
                            Ext.Msg.alert("提示", "保存成功!");
                            MaterialStore.reload();

                        },
                        failure: function(response, onpts) {
                            Ext.Msg.alert("提示", "保存失败！");
                    } 
                });
              }
           }
        }); 
    },

    //删除权限小组
    deleteCardType: function(id) { 
        Ext.Msg.confirm("提示", "确认删除此小组？", function(btn) {
            if (btn == 'yes') {
                Ext.Ajax.request({ 
                    url:    '/groups/' + id,
                    method: 'DELETE',
                    success: function(response, opts) { 
                    //scope.createGrid().store.load();
                    //暂时用全局
                    MaterialStore.load();
                    Ext.Msg.alert("提示", "删除成功");
                    },
                    failure: function(response, opts) { 
                    Ext.Msg.alert("提示", "删除失败");
                    } 
              });
          }
      });
    },

  //删除所有的权限小组
  deleteAllCardType: function(){ 
      Ext.Msg.confirm("提示", "确认删除所有证件类型？", function(btn) {
         if (btn == 'yes') {
             Ext.Ajax.request({ 
                 url:    '/groups/delete_all',
                 method: 'post',
                 success: function(response, opts) { 
                 MaterialStore.load();
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
