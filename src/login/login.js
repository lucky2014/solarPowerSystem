define(function(require,exports,module){
	var $ = require("jquery");
	var setup = require("setup");
	var dd = 1; //cookie时间

	var app = {
		submitFn: function(){
			var me = this;
			var userName = $("input[name=userName]").val();
			var passWord = $("input[name=passWord]").val();
			if(!userName){
				$(".msg").html("<em>*</em>请输入用户名！").show();
			}else if(!passWord){
				$(".msg").html("<em>*</em>请输入密码！").show();
			}

			//获取参数,然后请求
			var params = setup.getParams({
				account: userName,
				pwd: passWord
			});

			setup.commonAjax("login", params, function(msg){
				sessionStorage.setItem("userName", msg.userName);
				sessionStorage.setItem("userId", msg.userId);

				document.cookie = setup.setCookie("userName",userName,dd); //1代表1天
				document.cookie = setup.setCookie("passWord",passWord,dd); //1代表1天
				document.cookie = setup.setCookie("userId",msg.userId,dd); //1代表1天
				me.isHasUrl(msg);
			});
		},
		isHasUrl: function(msg){
			var url = setup.getQueryString("url");
			if(url){
				if(setup.isIE()){ //如果是IE，传参数
			    	location.href = url + "?userName=" +msg.userName+"&userId="+msg.userId;
			    }else{
			    	location.href = url;
			    }
			}else{
				if(setup.isIE()){ //如果是IE，传参数
			    	location.href = "index.html?userName="+msg.userName+"&userId="+msg.userId;
			    }else{
			    	location.href = "index.html";
			    }
			}
		}
	}

	/*var cookieUserName = setup.getCookie("userName");
	var cookiePassWord = setup.getCookie("passWord");
	if(cookieUserName && cookieUserName != "" && cookiePassWord && cookiePassWord != ""){
		//获取参数,然后请求
		var params = setup.getParams({
			account: cookieUserName,
			pwd: cookiePassWord
		});

		setup.commonAjax("login", params, function(msg){
			sessionStorage.setItem("userId", msg.userId);
			sessionStorage.setItem("userName", msg.userName);
			document.cookie = setup.setCookie("userId",msg.userId,dd); //dd=1代表1天
			document.cookie = setup.setCookie("userName",msg.userName,dd); //dd=1代表1天
			app.isHasUrl(msg);
		});
	}*/	

	//点击登录按钮
	$("#loginBtn").click(function(){
		app.submitFn();
	});

	//按回车键登录
	document.onkeydown = function(e){
		var keycode = e.which;
		
		if (keycode == 13 ){ //回车键是13
			app.submitFn();
		}
	};

	//输入框获得焦点提示信息隐藏
	$(".inputDiv input").focus(function(){
		$(".msg").text("").hide();
	});
});