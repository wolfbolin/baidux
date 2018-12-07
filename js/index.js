// 声明剪切板功能模块
var clipboard = new ClipboardJS('.copy');
clipboard.on('success', function(e) {
    console.log(e);
    $("#tip1").text("已将链接复制到剪切板");
    $("#tip2").text("快把这智慧的链接糊给他吧");
});
clipboard.on('error', function(e) {
    console.log(e);
    $("#tip1").text("不知道为啥复制失败了");
    $("#tip2").text("你可以手动复制框内的文本");
});
// 通过正则表达式获取链接中的参数
function getQuery(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
// 不使用window.location.host，以保证在本地也可用
function getHostname() {
    url = window.location.href;
    hostname = url.split("?");
    return hostname[0];
}
// 延迟递归完成文本数输入
function addSearchText(text) {
    text = String(text);
    $("#search-input").val($("#search-input").val() + text.substr(0, 1));
    text = text.slice(1); // 删除已经写入的第一个字符
    if (text.length == 0) {
        $("#tip2").text("输入之后点击\"百度一下\"按钮");
        return; // 递归结束
    }
    setTimeout("addSearchText(" + text + ")", 300); // 递归循环写入
}
$(document).ready(function() {
    hostname = getHostname(); // 获取页面域名或地址
    $("#search-button").click(function() {
        // “百度一下”按钮的响应事件
        input_text = $("#search-input").val();
        input_text = input_text.trim();
        if (input_text.length == 0) {
            $("#tip1").text("我帮您教他如何使用百度搜索");
            $("#tip2").text("将问题输入后点击\"百度一下\"");
            $("#link").css("display", "none");
            return;
        } else {
            $("#tip1").text("蕴藏知识的链接已经生成");
            $("#tip2").text("点击\"复制链接\"即可复制到剪切板");
            $("#link").css("display", "block");
        }
        query_text = encodeURI(input_text);
        $("#tip-input").val(hostname + "?q=" + query_text);
    });
    query = getQuery("q"); // 试图获取查询参数
    if (query == null) {
        //没有参数输入，中断处理
        return;
    }
    query = decodeURI(query); // 对查询的内容进行URL解码
    query = query.trim(); // 删除可能很奇怪的空白字符
    if (query.length !== 0) {
        // 参数不为空时呈现动态
        // 更新输入框与提示框内容
        $("#search-input").val("");
        $("#tip1").text("其实找资料特别简单呢");
        $("#tip2").text("跟着我一起输入你想知道的问题");
        // 获取输入框与按钮的位置
        input_offest = $("#search-input").offset();
        button_offest = $("#search-button").offset();
        console.log("输入框位置");
        console.log(input_offest);
        console.log("按钮位置");
        console.log(button_offest);
        // 显示鼠标图案
        mouse_obj = $("#fake-mouse");
        mouse_obj.css({
            "display": "block",
            "top": "240px",
            "left": "0"
        });
        // 开始从初始位置移动至输入框
        mouse_obj.animate({
            "top": input_offest.top + 30,
            "left": input_offest.left + 10,
        }, 2000, "swing", function(){
        	addSearchText(query);// 逐个写入文本内容
        });
        // 继续滑动鼠标位置
        mouse_obj.animate({
            "top": button_offest.top + 30,
            "left": button_offest.left + 10
        }, 2000, "swing", function(){
        	$("#search-button").trigger('mouseenter')
        	$("#tip2").text("然后就能找到答案啦，超简单呢");
        	navigate = "https://www.baidu.com/s?wd=";
        	navigate += encodeURI(query);
        	console.log(navigate);
        	setTimeout(function(){
        		window.location.href = navigate;
        	}, 1000);
        });
    }
});