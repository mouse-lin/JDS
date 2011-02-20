Manage.UserSettingWin = Ext.extend(Ext.app.Module,  {
    id: 'userSettingWin',
    init: function() {
        this.launcher = {
            text: '基础设置',
            iconCls: 'settings',
            handler: this.createWindow,
            scope: this
        }
    },

    createWindow: function() {
      var _this = Manage.userSettingWin;
      var manage = _this.app.getDesktop();
      var win = manage.getWindow('userSettingWin');
      if(!win) {
            win = manage.createWindow({
                id: 'userSettingWin',
                title: '基础设置',
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

  //TODO 密码修改
    createTabPanel: function(){ 
        var _this = Manage.userSettingWin;
        return new Ext.TabPanel({ 
            frame: true,
            activeTab: 0,
            deferredRender: false, // tabpanel 显示切换渲染
            items: [
            { 
                title: '个人资料',
                layout: 'anchor',
                html: '<iframe src="user_parts/choose_image" frameborder="0" width="100%" height="100%"></iframe>' 
            },{ 
                title: '密码修改',
                layout: 'anchor',
                html: '<iframe src="user_parts/update_pw_win" frameborder="0" width="100%" height="100%"></iframe>'
            },{ 
                title: '主题选择',
                layout: 'anchor',
                html: '<iframe src="user_parts/update_theme_win" frameborder="0" width="100%" height="100%"></iframe>'
                //items: _this.createImagePanel()
            },{ 
                title: '背景图选择',
                layout: 'anchor',
                html: '<iframe src="user_parts/update_bg_image_win" frameborder="0" width="100%" height="100%"></iframe>'
                //items: _this.createImagePanel()
            }],
      })
    },

    createImagePanel: function(){ 
        return  createGroupFormPanel =  new Ext.form.FormPanel({ 
            frame: true,
            region: 'center',
            width:640,
            height: 300,
            anchor: "100% 100%",
            items: [{ 
                layout: 'column',
                xtype: 'fieldset',
                title: '带*号为必填信息',
                style: 'margin-left:5px;',
                width:640,
                height:500,
                anchor: "100% 100%",
                items:[
                { 
                    layout:'form',
                    defaultType:'textfield',
                    items:[
                    {   
                        xtype: 'box', //或者xtype: 'component',   
                        width: 200, //图片宽度   
                        height: 200, //图片高度   
                        id:"bg1",
                        autoEl: {   
                            tag: 'img',    //指定为img标签   
                            src: '/images/wallpapers/bg1.jpg'    //指定url路径   
                        },   
                     }, {   
                        xtype: 'box', //或者xtype: 'component',   
                        width: 200, //图片宽度   
                        height: 200, //图片高度   
                        id:"bg2",
                        autoEl: {   
                            tag: 'img',    //指定为img标签   
                            src: '/images/wallpapers/bg2.jpg'    //指定url路径   
                        },   
                          }
                    ]
                }]
          }]
      })

    }

})

