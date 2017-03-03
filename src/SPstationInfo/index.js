define(function(require, exports, module) {
    var $ = require("jquery");
   	var setup = require("setup");
    	require('src/SPstationInfo/index.css');
        require('src/SPchartsSum/index.css');
        require("my97DatePicker");
    var echarts = require("echarts");
    var weatherApp = require("src/common.weather/weather"); //天气情况
    var addressApp = require("src/SPaddress/index"); //电站基本详情

    var SPchartsSum = require('src/SPstationInfo/chartsSum'); 

    //banner滚动
    var bannerSwiper = require("src/common.swiper/swiper"); 

    //组件发电详情
    var SPcomponentEnergyListApp = require('src/SPcomponentEnergyList/index');

    //渲染仪表图
    var gaugeApp = require("src/common.gaugeChart/index");
    
    //电站列表统计
    var stationListApp = require("src/common.stationList/stationList");
    //SMU子站列表
    var listStationSmuApp = require("src/SPSMUcomponentList/index");

    var componentApp = {
        readerBase: function(stationId){
            var me = this;
            $("#powerSumTab dd:eq(0),#componentTab dd:eq(0)").addClass("on").siblings().removeClass("on");

            //-----------------天气预报-----------------
            weatherApp.weatherInfo(stationId);

            //电站基本信息接口,统计banner、仪表图、
            me.getStationDetail(stationId);

            //------------------单个电站统计统计---------------------
            SPchartsSum.dateTypeChange(1, stationId);

            //------------------SMU子站列表---------------------
            listStationSmuApp.init(stationId);
        },
        getStationDetail: function(stationId){
            //电站基本信息接口,统计banner、仪表图、
            setup.commonAjax("getStationDetail", setup.getParams({
                stationId: stationId
            }), function(msg){
                //-----------------渲染地址-----------------  
                addressApp.initInfo(msg);

                //-----------------渲染banner-----------------  
                var banner = msg.pic.split("|");
                bannerSwiper.swiperInfo(banner);

                //-----------------渲染仪表图-----------------  
                gaugeApp.init(msg, "myGaugeInfo", "myPolarInfo");
            });
        },
        readerGauge: function(stationId){
            //电站基本信息接口,统计banner、仪表图、
            setup.commonAjax("getStationDetail", setup.getParams({
                stationId: stationId
            }), function(msg){
                //-----------------渲染仪表图-----------------  
                gaugeApp.init(msg, "myGaugeInfo", "myPolarInfo");
            });
        },
    };

    var timer ; //仪表计时器

    //初始化电站下拉列表
    stationListApp.init(function(stationId){
        componentApp.readerBase(stationId);

        clearInterval(timer);
        timer = null;

        timer = setInterval(function(){ //仪表功率计时器
            componentApp.readerGauge(stationId);
        }, 60000);
    });

    //点击下拉列表,把取得的stationId放进缓存
    stationListApp.liChangeFn(function(stationId){
        componentApp.readerBase(stationId);

        clearInterval(timer);
        timer = null;

        timer = setInterval(function(){ //仪表功率计时器
            componentApp.readerGauge(stationId);
        }, 60000);
    });

    $("#powerSumTab dd").click(function(){
        var me = $(this);
        var dateType = me.attr("data-value");
        me.addClass("on").siblings().removeClass("on");
        var stationId = $("#baseComponentStationId").attr("stationId");

        //最后一个1说明是从日期类型选中，而不是日期插件
        //第3个参数是传递的日期
        SPchartsSum.dateTypeChange(dateType, stationId, "", 1); 
    });

    //组件发电详情日期类型点击
    $("#componentTab dd").click(function(){
        var me = $(this);
        var dateType = me.attr("data-value");
        me.addClass("on").siblings().removeClass("on");
        var stationId = $("#baseComponentStationId").attr("stationId");

        //最后一个1说明是从日期类型选中，而不是日期插件
        //第四个参数是传递的日期
        SPcomponentEnergyListApp.dateTypeChange(dateType, stationId, "", 1); 
    });

    //点击地址栏
    $(".addressParent").hover(function(){
        var me = $(this);
        me.find("p.baseHide").removeClass("hide");
        me.addClass("all");
        $(".weather").hide();
    },function(){
        var me = $(this);
        me.find("p.baseHide").addClass("hide");
        me.removeClass("all");
        $(".weather").show();
    });
});