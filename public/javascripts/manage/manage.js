Manage = new Ext.app.App({
	init:function(){
		Ext.QuickTips.init()
	},


	getModules: function(){
        Manage.userRegisterWin = new Manage.UserRegisterWin();
        Manage.reportWin = new Manage.ReportWin();
        Manage.userGroupWin = new Manage.UserGroupWin();
        Manage.userPartWin = new Manage.UserPartWin();
        Manage.userSettingWin  =   new Manage.UserSettingWin();
        Manage.manageWin  =   new Manage.ManageWin();
        Manage.userManageWin  =   new Manage.UserManageWin()
        if(Group == 1){  
		        return [
                Manage.userRegisterWin,
                Manage.userGroupWin,
                Manage.reportWin,
                Manage.userSettingWin,
                Manage.manageWin,
                Manage.userManageWin
          ]
       }
       else if(Group == 2){ 
           return[
               Manage.userRegisterWin,
               Manage.reportWin,
               Manage.userSettingWin,
               Manage.manageWin,
               Manage.userManageWin
           ]
       } 
       else{ 
          return[
              Manage.userSettingWin,
          ]
       }
	},

    // config for the start menu
    getStartConfig: function(){
        return {
            title: '图书馆用户管理系统',
            iconCls: 'user'
            /*
            toolItems: [{
                text:'设置',
                iconCls:'settings',
                //handler: Manage.setting.createWindow,
                scope:this
            },'-',{
                text:'注销',
                iconCls:'logout',
                scope:this,
                //handler: 
            }]
            */
        };
    }
});
