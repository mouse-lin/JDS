Manage = new Ext.app.App({
	init:function(){
		Ext.QuickTips.init();
	},


	getModules: function(){
        //Manage.setting  =   new Manage.Setting();
        Manage.orderWindow = new Manage.OrderWindow();
        Manage.orderWindowLook = new Manage.OrderWindowLook();
        Manage.clothPartWin = new Manage.ClothPartWin();
        Manage.clothPartShow = new Manage.ClothPartShow();
        Manage.purchasingWin = new Manage.PurchasingWin();
        Manage.processingWin = new Manage.ProcessingWin();
//        Manage.outboundWin = new Manage.OutboundWin();
//        Manage.inboundWin = new Manage.InboundWin();
//        Manage.storeWin = new Manage.StoreWin();
        //Manage.purchasingWin = new Manage.PurchasingWin();
        //Manage.questionBase   = new Manage.QuestionBase();

		return [
           //Manage.setting,
           Manage.orderWindow,
           Manage.orderWindowLook,
           Manage.clothPartWin,
           Manage.clothPartShow,
           Manage.purchasingWin,
           Manage.processingWin,
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

