Ext.onReady(function(){
    var store = this.createStore();
    panel = new Ext.Panel({
        renderTo:Ext.getBody(),
             width: 940,
             height: 530,
             items: [
                   new Ext.Panel({title:"简历内容", items: [this.createForm(store), this.createGrid(store)]})
             ]
    });
});

    function createForm(store){ 
        var form = new Ext.form.FormPanel({ 
            frame: true,
            autoHeight: true,
            region: 'north',
            defaults: { width: 600 },
            buttonAlign: 'right',
            buttons: [{ 
                text: '保存',
                handler: function(){ 
                    var data = Ext.getCmp('question').getValue();
                    Ext.Ajax.request({ 
                        url: '/questions',
                        method: 'POST',
                        jsonData: { question: { qcon: data } },
                        success: function(){ 
                            store.reload();
                        },
                        failure: function(response, opts){ 
                            var message = Ext.decode(response.responseText);
                            Ext.Msg.alert('Wando团队', message.message);
                        }
                    })
                }
            }],
            items: [{ 
                xtype: 'textfield',
                fieldLabel: '问题',
                id: 'question'
            }]
        });
        return form;
    };

     function createStore(){ 
        return new Ext.data.JsonStore({ 
            url: '/questions.json',
            fields: [
                'id',
                'qcon'
            ]
        });
    };

     function createGrid(store){ 
        var deleteRecords = [];
        var deleteIds = [];
        var grid = new Ext.grid.GridPanel({ 
            width: 940,
            height: 420,
            id: 'questionGrid',
            frame: true,
            viewConfig: { forceFit: true },
            region: 'center',
            store: store,
            tbar: [{ 
                xtype: 'textfield', 
                id: 'questionBaseText'  //mouse
            },{ 
                text: '查找',  //mouse
                handler: function() { 
                    var value = Ext.getCmp('questionBaseText').getValue();
                    Ext.Ajax.request({ 
                        url: '/questions/search_by_qcon',
                        jsonData: { qcon: value },
                        success: function(response) { 
                            var questions = Ext.decode(response.responseText);
                            store.loadData(questions);
                        }, 
                        failure: function() { 
                            Ext.Msg.alert('Wando', 'failure');
                        }
                    });
                }
            }, { 
                text: '清空查询',  //mouse
                handler: function() { 
                    store.reload();
                }
            }, '-',{ 
                text: '删除',
                handler: function(){ 
                    deleteRecords = grid.getSelectionModel().getSelections();
                    for(var i = 0; i < deleteRecords.length; i++){ 
                        deleteIds.push(deleteRecords[i].get('id'));
                    }
                    Ext.Ajax.request({ 
                        url: '/questions/deletes',
                        method: 'DELETE',
                        jsonData: { question_ids: deleteIds },
                        success: function(){ 
                            store.reload();
                        },
                        failure: function(){ 
                            Ext.Msg.alert('Wando团队', '删除失败');
                        }
                    })
                }
            }],
            cm: new Ext.grid.ColumnModel([
                //new Ext.grid.RowNumberer(),
                { header: 'ID',   dataIndex: 'id', width: 5 },
                { header: '问题', dataIndex: 'qcon' }
            ])
        });
        return grid;
    }
