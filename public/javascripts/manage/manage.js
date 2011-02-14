Manage = new Ext.app.App({
	init:function(){
		Ext.QuickTips.init();
	},


	getModules: function(){
        //Manage.setting  =   new Manage.Setting();
        Manage.userRegisterWin = new Manage.UserRegisterWin();
        Manage.reportWin = new Manage.ReportWin();
        Manage.userGroupWin = new Manage.UserGroupWin();

        Manage.clothPartShow = new Manage.ClothPartShow();
        Manage.purchasingWin = new Manage.PurchasingWin();
        Manage.orderWindowLook = new Manage.OrderWindowLook();
//        Manage.outboundWin = new Manage.OutboundWin();
//        Manage.inboundWin = new Manage.InboundWin();
//        Manage.storeWin = new Manage.StoreWin();
        //Manage.purchasingWin = new Manage.PurchasingWin();
        //Manage.questionBase   = new Manage.QuestionBase();

		return [
           //Manage.setting,
           Manage.userRegisterWin,
           Manage.userGroupWin,
           Manage.reportWin,

           Manage.clothPartShow,
           Manage.purchasingWin,
           Manage.orderWindowLook,
//           Manage.inboundWin,
//           Manage.storeWin,
//           Manage.outboundWin
		];
	},

    // config for the start menu
    getStartConfig: function(){
        return {
            title: '图书馆用户管理系统设置',
            iconCls: 'user',
            toolItems: [{
                text:'设置',
                iconCls:'settings',
                //handler: Manage.setting.createWindow,
                scope:this
            },'-',{
                text:'注销',
                iconCls:'logout',
                scope:this
            }]
        };
    }
});

