Manage = new Ext.app.App({
	init:function(){
		Ext.QuickTips.init();
	},


	getModules: function(){
        Manage.userRegisterWin = new Manage.UserRegisterWin();
        Manage.reportWin = new Manage.ReportWin();
        Manage.userGroupWin = new Manage.UserGroupWin();
        Manage.userPartWin = new Manage.UserPartWin();
        Manage.userSettingWin  =   new Manage.UserSettingWin();
        Manage.manageWin  =   new Manage.ManageWin();
        
       // Manage.clothPartShow = new Manage.ClothPartShow();
        //Manage.orderWindowLook = new Manage.OrderWindowLook();
//        Manage.outboundWin = new Manage.OutboundWin();
//        Manage.inboundWin = new Manage.InboundWin();
//        Manage.storeWin = new Manage.StoreWin();
        //Manage.purchasingWin = new Manage.PurchasingWin();
        //Manage.questionBase   = new Manage.QuestionBase();

		return [
           Manage.userRegisterWin,
           Manage.userGroupWin,
           Manage.reportWin,
          // Manage.userPartWin,
           Manage.userSettingWin,
           Manage.manageWin,
           
//           Manage.inboundWin,
//           Manage.storeWin,
//           Manage.outboundWin
		];
	},

    // config for the start menu
    getStartConfig: function(){
        return {
            title: '图书馆用户管理系统',
            iconCls: 'user',
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
