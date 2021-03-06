var pushTimer, progress = null;
var queueIndex = 0, queueTimer, timer, _color = 'red';
var mybackgroundAudio = document.getElementById('mybackgroundAudio');
//开奖记录有效期
function validity(h,m,s) {
    //获取当前时间时间戳
    var nowunix = Math.round(new Date().getTime());
    var date = new Date();
    date.setHours(h);
    date.setMinutes(m);
    date.setSeconds(s);
    //获取指定时间时间戳
    var secunix = Math.round(date.getTime());
    var shengunix = secunix - nowunix;
    shengunix = parseFloat(shengunix) / 1000;
    var date1 = new Date();
    date1.setTime(date1.getTime() + (shengunix * 1000));
    return date1;
}

var mn_fc3d_ball = [];
if ($.cookie('mn_fc3d_ball')){
    var o = $.cookie('mn_fc3d_ball');
    mn_fc3d_ball = JSON.parse(o);
}
var emulator3D = {
    config: {
        area: [{x: 38, y: 61}, {x: 110, y: 61}, {x: 186, y: 61}],
        start_point: {x: 20, y: 95},
        stock: {x: 0, y: 100, width: 50, height: 40},
        push_point: [{x: 33, y: -53}, {x: 28, y: -53}, {x: 26, y: -53}]
        // audio: WEB_URL + 'assets/audio/BallBouncing.mp3'
    },
    //初始化
    init: function () {
        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
            WeixinJSBridge.call('hideOptionMenu');
        });
        var cfg = this.config;
        $.each(cfg.area, function (i, d) {
            $e = $('<div class="ballBox"><div class="xBox"></div></div>').appendTo($('#emulator')).css({
                left: d.x,
                top: d.y
            });
            var arr = [];
            for (var i = 0; i < 10; i++) arr.push('<figure class="ball"><p>' + i + '</p></figure>');
            $o = $('<div style="position:absolute"><section class="stage">' + arr.join('') + '</section></div>').appendTo($e.find('.xBox')).css({
                left: cfg.start_point.x,
                top: cfg.start_point.y
            });
            $o.find('.ball').css({width: 12, height: 12});
        });
    },
    //开始摇奖
    start: function () {
        // $('<audio id="Audio3d"><source src="'+this.config.audio+'"></audio>').appendTo('body');
        // Audio3d.play();
        $('.action').hide();
        mybackgroundAudio.play();
        var __ = this;
        if (progress != null && progress) return;
        if (progress == null) progress = true;
        if ($('.chosed').length > 1) {
            this.restart();
        } else {
            $('.xBox .ball').each(function () {
                $(this).transition({x: 3, y: 80});
            });
            this.bounce();
        }
    },
    //随机滚动
    bounce: function () {
        var __ = this;
        var cfg = this.config;
        timer = window.setInterval(function () {
            $('.xBox .ball').each(function (i) {
                var x = Math.ceil((Math.random() * (cfg.stock.x + cfg.stock.width)) + cfg.stock.x);
                var y = Math.ceil((Math.random() * (cfg.stock.height + cfg.stock.height)) + cfg.stock.y);
                if (!$(this).hasClass('chosed')) {
                    var $e = $(this).css('position', 'absolute');
                    $e.transition({x: x, y: y}, 50);
                }
            });

        }, 20);
        popTimer = window.setInterval(function () {
            __.pushBall();
        }, 1000);
        setTimeout(function () {
            //$('#Audio3d').remove();
            mybackgroundAudio.pause();
            mybackgroundAudio.currentTime = 0;
            window.clearInterval(timer);
            window.clearInterval(popTimer);
            for(var i=0;i<$('.xBox .chosed').length;i++){
                $('.billboard').append('<span class="ball red">' + $('.xBox .chosed:eq('+i+') p').html() + '</span>');
            }
            $('.xBox figure').not('.chosed').remove();
            progress = false;
            $('.action').show();
            $('#modal').hide();
            __.addIntoResult();
        }, 8000);
    },
    //抽取随机球
    pushBall: function () {
        var total = $('.chosed').length;
        if (total < 3) {
            $e = $('.xBox').eq(total).find('.ball').eq(Math.ceil((Math.random() * 9) + 0)).addClass('chosed');
            $e.transition({x: this.config.push_point[total].x, y: this.config.push_point[total].y});
        } else {
            $('.button img').attr('src','./images/again.png');
        }
    },
    //重启摇奖
    restart: function () {
        $('.xBox').remove();
        $('.result').html('').hide();
        var __ = this;
        __.init();
        setTimeout(function () {
            __.start();
        }, 1500);
    },
    addIntoResult: function () {
        var now = new Date();
        var ball_fc3d = [];
        var h = now.getHours(), m = now.getMinutes();
        var now_time = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
        var $node_fc3d = $('<li><span class="record_time">' + now_time + '</span></li>');
        for(var i = 0;i < 3;i++){
            $node_fc3d.append($('<span class="red">' + $('.billboard .ball:eq('+i+')').html() + '</span>'));
            ball_fc3d.push($('.billboard .ball:eq('+i+')').html());
        }
        var ball_fc3d_cont = {
            time: now_time,
            balls: ball_fc3d
        };
        mn_fc3d_ball.push(ball_fc3d_cont);
        var str = JSON.stringify(mn_fc3d_ball);
        var validity1 = validity(23,59,59);
        $.cookie('mn_fc3d_ball', str, { expires: validity1 });
        $node_fc3d.prependTo($('.record_cont.mn_fc3d .record_cont_cont'));
    }
};

var mn_7lc_ball = [];
if ($.cookie('mn_7lc_ball')){
    var o = $.cookie('mn_7lc_ball');
    mn_7lc_ball = JSON.parse(o);
}
var emulator7lecai = {
    config: {
        ball: [['01', '02', '03', '04', '05'], ['06', '07', '08', '09', 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20], [21, 22, 23, 24, 25], [26, 27, 28, 29, 30]],
        ball_geo: [{x: 122, y: 175}, {x: 138, y: 175}, {x: 156, y: 175}, {x: 170, y: 175}, {x: 188, y: 175}, {x: 204, y: 175}],
        bounce_area: {x: -20, y: -75, width: 40, height: 65}
    },
    init: function () {
        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
            WeixinJSBridge.call('hideOptionMenu');
        });
        var __ = this;
        $.each(__.config.ball, function (i, d) {
            var arr = [];
            for (var k = 0; k < d.length; k++) arr.push('<figure class="ball red"><p>' + d[k] + '</p></figure>');
            $('<div style="position:absolute" class="group"><section class="stage">' + arr.join('') + '</section></div>').appendTo($('#emulator')).css({
                left: __.config.ball_geo[i].x,
                top: __.config.ball_geo[i].y
            });
            $('.group').find('.ball').css({width: 12, height: 12});
        });
    },
    start: function () {
        if ($('.chosed').length > 0) {
            $('.chosed').remove();
            emulator7lecai.init();
        }
        $('.billboard').html('');
        $('.action').hide();
        mybackgroundAudio.play();
        $('.group').transition({y: 70});
        setTimeout(function () {
            emulator7lecai.bounce();
        }, 200);
    },
    bounce: function () {
        var __ = this;
        timer = window.setInterval(function () {
            $('.group .ball').each(function () {
                var x = Math.ceil((Math.random() * __.config.bounce_area.width) + __.config.bounce_area.x);
                var y = Math.ceil((Math.random() * __.config.bounce_area.height) + __.config.bounce_area.y);
                $(this).css({left: x, top: y});
            });
        }, 100);
        queueTimer = window.setInterval(function () {
            __.pushBall();
        }, 2000);
    },
    pushBall: function () {
        var __ = this;
        var total = $('.chosed').length;
        if (total < 8) {
            var time = 110;
            $e = $('.group .ball').eq(Math.ceil(Math.random() * 29)).addClass('chosed').appendTo($('#emulator'))
                .css({
                    'position': 'absolute',
                    'transform': 'translate(0,0)',
                    left: '152px',
                    top: '215px',
                    width: 16,
                    height: 16
                })
                .transition({y: -98})
                .transition({x: 35}, time, 'in')
                .transition({x: 98, y: -46}, time, 'in')
                .transition({x: 110, y: 5}, time, 'in')
                .transition({x: 96, y: 60}, time, 'in')
                .transition({x: 60, y: 96}, time, 'in')
                .transition({x: 30, y: 115}, time, 'in')
                .transition({x: -95 + (total * 17), y: 140 - (total * 3.7)});
            if (total == 7){
                if($e.text()) $('.billboard').append('<span class="ball blue">' + $e.text() + '</span>');
            }else {
                if($e.text()) $('.billboard').append('<span class="ball red">' + $e.text() + '</span>');
            }
        } else {
            mybackgroundAudio.pause();
            mybackgroundAudio.currentTime = 0;
            $('.group').remove();
            window.clearInterval(timer);
            window.clearInterval(queueTimer);
            $('.action').show();
            $('.button img').attr('src','./images/again.png');
            $('#modal').hide();
            var now = new Date();
            var ball_7lc = [];
            var h = now.getHours(), m = now.getMinutes();
            var now_time = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
            var $node = $('<li><span class="record_time">' + now_time + '</span></li>');
            for(var i = 0;i < 8;i++){
                if(i == 7){
                    $node.append($('<span class="blue">' + $('.billboard .ball:eq('+i+')').html() + '</span>'));
                }else {
                    $node.append($('<span class="red">' + $('.billboard .ball:eq('+i+')').html() + '</span>'));
                }
                ball_7lc.push($('.billboard .ball:eq('+i+')').html());
            }
            var ball_7lc_cont = {
                time: now_time,
                balls: ball_7lc
            };
            mn_7lc_ball.push(ball_7lc_cont);
            var str = JSON.stringify(mn_7lc_ball);
            var validity1 = validity(23,59,59);
            $.cookie('mn_7lc_ball', str, { expires: validity1 });
            $node.prependTo($('.record_cont.mn_7lc .record_cont_cont'));
        }
    }
};
//
// // 双色球背景音控制
backgroundAudioflag = true;// 标记是否为篮球选号

var mn_shsq_ball = [];
if ($.cookie('mn_shsq_ball')){
    var o = $.cookie('mn_shsq_ball');
    mn_shsq_ball = JSON.parse(o);
}
var emulatorSSQ = {
    config: {
        red: [['01', '02', '03', '04'], ['05', '06', '07', '08'], ['09', 10, 11, 12], [13, 14, 15], [16, 17, 18], [19, 20, 21], [22, 23, 24], [25, 26, 27], [28, 29, 30], [31, 32, 33]],
        blue: [['01', '02'], ['03', '04'], ['05', '06'], ['07', '08'], ['09', 10], [11, 12], [13], [14], [15], [16]],
        red_geo: [{x: 82, y: 112}, {x: 98, y: 112}, {x: 114, y: 112}, {x: 130, y: 127}, {x: 146, y: 127}, {x: 162, y: 127}, {x: 178, y: 127}, {x: 194, y: 127}, {x: 210, y: 127}, {x: 226, y: 127}],
        blue_geo: [{x: 82, y: 140}, {x: 98, y: 140}, {x: 114, y: 140}, {x: 130, y: 140}, {x: 146, y: 140}, {x: 162, y: 140}, {x: 178, y: 150}, {x: 194, y: 150}, {x: 210, y: 150}, {x: 226, y: 150}],
        bounce_area: {x: -40, y: -70, width: 75, height: 70},
        first_point: [{x: 88, y: 90}, {x: 70, y: 90}, {x: 50, y: 90}, {x: 30, y: 75}, {x: 10, y: 75}, {
            x: -10,
            y: 75
        }, {x: -30, y: 75}, {x: -50, y: 75}, {x: -70, y: 75}, {x: -88, y: 75}]
    },
    init: function () {
        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
            WeixinJSBridge.call('hideOptionMenu');
        });
        this.prepare('red');
    },
    prepare: function (color) {
        var __ = this;
        _color = color;
        var data = color == 'red' ? __.config.red : __.config.blue;
        var geo = color == 'red' ? __.config.red_geo : __.config.blue_geo;
        $.each(data, function (i, d) {
            var arr = [];
            for (var k = 0; k < d.length; k++) arr.push('<figure class="ball ' + color + '"><p>' + d[k] + '</p></figure>');
            $('<div style="position:absolute;" class="group"><section class="stage">' + arr.join('') + '</section></div>').appendTo($('#emulator')).css({
                left: geo[i].x,
                top: geo[i].y
            }).find('.ball').css({width: 15, height: 15});
        });
    },
    start: function () {
        $('.action').hide();
        mybackgroundAudio.play();
        var __ = this;
        if ($('.group').length < 1) {
            $('.ball').remove();
            $('.billboard').html('');
            this.init();
        }
        queueTimer = window.setInterval(function () {
            if (queueIndex >= (_color == 'red' ? 33 : 16)) {
                window.clearInterval(queueTimer);
                setTimeout(function () {
                    __.bounce();
                }, 200);
                return;
            }
            var $e = $('.group .ball').eq(queueIndex);
            var i = $e.parents('.group').index() - (_color == 'red' ? 2 : 8); //alert(i)
            $e.css('position', 'absolute').transition({y: 40 - 15 * $e.index()}).transition({
                x: emulatorSSQ.config.first_point[i].x,
                y: emulatorSSQ.config.first_point[i].y
            }, 30).transition({y: 180});
            queueIndex++;
        }, 30);
    },
    bounce: function () {
        //mybackgroundAudio.play();// 开始播放背景音
        // $(".playbtn").click();
        var __ = this;
        timer = window.setInterval(function () {
            $('.group .ball').each(function () {
                var x = Math.ceil((Math.random() * __.config.bounce_area.width) + __.config.bounce_area.x);
                var y = Math.ceil((Math.random() * __.config.bounce_area.height) + __.config.bounce_area.y);
                $(this).css({left: x, top: y});
            });
        }, 100);
        queueTimer = window.setInterval(function () {
            __.pushBall();
        }, 2000);
    },
    pushBall: function () {
        var __ = this;
        var total = $('.chosed').length;
        if (total == 6 && backgroundAudioflag) {// 变为篮球里暂停背景音
            backgroundAudioflag = false;
            mybackgroundAudio.pause();
            mybackgroundAudio.currentTime = 0;
        }

        if (total < (_color == 'red' ? 6 : 7)) {
            if (_color == 'red')
                _t = 32;
            else
                _t = 15;
            $e = $('.group .ball').eq(Math.ceil((Math.random() * _t))).addClass('chosed').appendTo($('#emulator'))
                .css({'transform': 'translate(0,0)', left: '153px', top: '303px'})
                .transition({x: 36, y: 55})
                .transition({x: -62 + (total * 18)});
            if (_color == 'blue') {
                setTimeout(function () {
                    $('.action').show();
                    $('.button img').attr('src','./images/again.png');
                    $('#modal').hide();
                    __.addIntoResult();
                }, 100);
                if ($e.text() != '') $('.billboard').append('<span class="ball blue">' + $e.text() + '</span>');
            } else {
                if ($e.text() != '') $('.billboard').append('<span class="ball red">' + $e.text() + '</span>');
            }

        } else {
            $('.group').remove();
            window.clearInterval(timer);
            window.clearInterval(queueTimer);
            queueIndex = 0;
            if (_color == 'red') {
                this.prepare('blue');
                setTimeout(function () {
                    emulatorSSQ.start();
                }, 1500);
            }
        }
        // console.log($('.billboard .ball').html());
    },
    addIntoResult: function () {
        setTimeout(function () {// 单注选号结束，停止背景音
            mybackgroundAudio.pause();
            backgroundAudioflag = true;
            mybackgroundAudio.current = 0;
        }, 1000);
        var now = new Date();
        var ball_shsq = [];
        var h = now.getHours(), m = now.getMinutes();
        var now_time = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
        var $node = $('<li><span class="record_time">' + now_time + '</span></li>');
        for(var i = 0;i < 7;i++){
            if(i == 6){
                $node.append($('<span class="blue">' + $('.billboard .ball:eq('+i+')').html() + '</span>'));
            }else {
                $node.append($('<span class="red">' + $('.billboard .ball:eq('+i+')').html() + '</span>'));
            }
            ball_shsq.push($('.billboard .ball:eq('+i+')').html());
        }
        var ball_shsq_cont = {
            time: now_time,
            balls: ball_shsq
        };
        mn_shsq_ball.push(ball_shsq_cont);
        var str = JSON.stringify(mn_shsq_ball);
        var validity1 = validity(23,59,59);
        $.cookie('mn_shsq_ball', str, { expires: validity1 });
        $node.prependTo($('.record_cont.mn_shsq .record_cont_cont'));
    }
};

//       幸运选号js

var emulatorLucky = {
    init:function () {
        $('#dialog .close').bind('click', function () {
            $('#modal').hide();
        });
        //双色球红球号码组
        var shsq_red_ball = ['01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33];
        //双色球蓝球号码组
        var shsq_blue_ball = ['01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14, 15, 16];
        //福彩3D号码组
        var fc3d_ball = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        //七乐彩号码组
        var seven_ball = ['01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
        //从指定数组中产生指定长度的数组
        Array.prototype.random_numbers = function (num, repeat, s) {
            var length = this.length;
            if (num >= length) {
                return false;
            }
            var hash = [];
            //号码可以重复？
            repeat = (repeat) ? true : false;
            //是否要排序
            var issort = s ? true : false;
            do {
                var key = Math.floor(Math.random() * (length));
                var number = this[key];
                // 如果可以重复
                if (repeat) {
                    hash.push(number);
                } else {
                    if ($.inArray(number, hash) == -1) {
                        hash.push(number);
                    }
                }
            } while (hash.length < num);
            if (issort) hash.sort();
            return hash;
        };

        window.addEventListener('load', function () {
            //用户点击转盘时的索引
            var test_num = -1;
            //判断是否是首次加载canvas
            var first = true;
            //默认显示生肖转盘
            var category = 'animal';
            //生肖转盘数据
            var brr = [{name: '猴', deg: '120'}, {name: '羊', deg: '150'}, {name: '马', deg: '179'}, {name: '蛇', deg: '210'},
                {name: '龙', deg: '240'}, {name: '兔', deg: '269'}, {name: '虎', deg: '300'}, {name: '牛', deg: '330'},
                {name: '鼠', deg: '359'}, {name: '猪', deg: '30'}, {name: '狗', deg: '60'}, {name: '鸡', deg: '89'}];
            //星座转盘数据
            var crr = [{name: '白羊', deg: '120'}, {name: '金牛', deg: '150'}, {name: '双子', deg: '179'}, {name: '巨蟹', deg: '210'},
                {name: '狮子', deg: '240'}, {name: '处女', deg: '269'}, {name: '天秤', deg: '300'}, {name: '天蝎', deg: '330'},
                {name: '射手', deg: '359'}, {name: '摩羯', deg: '30'}, {name: '水瓶', deg: '60'}, {name: '双鱼', deg: '89'}];
            //血型转盘数据
            var drr = [{name: 'A型', deg: '0'}, {name: 'B型', deg: '90'}, {name: 'O型', deg: '180'}, {name: 'AB型', deg: '270'}];
            var canvas = document.getElementById('canvas');
            if (canvas){
                if (!canvas.getContext) {
                    alert('抱歉！您当前浏览器不支持canvas');
                    return;
                }
                var ctx = canvas.getContext('2d');
            }

            //绘制 生肖、星座 转盘底部各区域形状
            /**
             num : 有多少块区域
             p : 用户点击位置的坐标
             **/
            function draw(num, ctx, p) {
                // 清空画布
                canvas.height = canvas.height;
                for (var i = 0; i < num; i++) {
                    //保存当前状态
                    ctx.save();
                    ctx.beginPath();
                    // 位移到圆心，下面需要围绕圆心旋转
                    ctx.translate(130, 130);
                    ctx.moveTo(0, 0);
                    // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
                    ctx.rotate((360 / num * i + 360 / num / 2) * Math.PI / 180);
                    // 绘制圆弧
                    ctx.arc(0, 0, 130, 0, 2 * Math.PI / num, false);
                    if (first && i == 8) {
                        ctx.fillStyle = '#FF704E';
                        ctx.fill();
                    } else {
                        ctx.fillStyle = '#FEDB39';
                        ctx.fill();
                    }
                    //判断用户是否有点击行为
                    if (p) {
                        //判断用户点击位置是否在当前路径内
                        if (p && ctx.isPointInPath(p.x, p.y)) {
                            //保存用户当前点击的索引
                            test_num = i;
                            ctx.fillStyle = '#FF704E';
                            ctx.fill();
                        } else {
                            ctx.fillStyle = '#FEDB39';
                            ctx.fill();
                        }
                    }
                    ctx.lineWidth = 0.5;
                    ctx.strokeStyle = '#f48d24';
                    ctx.stroke();
                    // 恢复前一个状态
                    ctx.restore();
                }
            }

            // 绘制 血型 转盘底部各区域形状
            /**
             num : 有多少块区域
             p : 用户点击位置的坐标
             **/
            function drawBlood(num, p) {
                canvas.height = canvas.height;
                for (var i = 0; i < num; i++) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.translate(130, 130);
                    ctx.moveTo(0, 0);
                    ctx.rotate((360 / num * i + 360 / num) * Math.PI / 180);
                    ctx.lineTo(-65, -67);
                    // 绘制不规则曲线
                    ctx.arcTo(-160, -240, -10, -75, 24);
                    ctx.arcTo(0, -180, 50, -15, 26);
                    ctx.arcTo(100, -150, 65, -65, 25);
                    ctx.lineTo(0, 0);
                    if (i == 0 || i == 2) {
                        if (p && ctx.isPointInPath(p.x, p.y)) {
                            test_num = i + 1;
                            ctx.fillStyle = '#FF704E';
                        } else {
                            ctx.fillStyle = '#FFB900';
                        }
                    } else {
                        if (p && ctx.isPointInPath(p.x, p.y)) {
                            test_num = i + 1;
                            if (i == 3) {
                                test_num = 0;
                            }
                            ctx.fillStyle = '#FF704E';
                        } else {
                            if (first && i == 3) {
                                ctx.fillStyle = '#FF704E';
                            } else {
                                ctx.fillStyle = '#FFDA3B';
                            }
                        }
                    }
                    ctx.fill();
                    ctx.restore();
                }
            }

            //绘制各转盘区域的文字及对应图标
            /**
             *
             obj_arr : 绘制对象数组
             degX : 文字位置 X 坐标
             degY : 文字位置 Y 坐标
             category : 需要绘制的转盘对象
             */
            function creatFont(obj_arr, degX, degY, category) {
                for (var j = 0; j < obj_arr.length; j++) {
                    //取得第一个图标
                    var img = document.getElementById(category + '_01_' + j);
                    ctx.save();
                    ctx.translate(130, 130);
                    //角度*Math.PI/180=弧度
                    ctx.rotate(obj_arr[j].deg * Math.PI / 180);
                    if (test_num == j) {
                        ctx.fillStyle = '#ffffff';
                        if (category == 'animal') {
                            img = document.getElementById(category + '_02_' + j);
                        }
                    } else {
                        if (first && j == 8) {
                            ctx.fillStyle = '#ffffff';
                            if (category == 'animal') {
                                img = document.getElementById(category + '_02_' + j);
                            }
                        } else {
                            ctx.fillStyle = '#F6312D';
                            if (category != 'blood') {
                                img = document.getElementById(category + '_01_' + j);
                            }
                        }
                    }
                    if (category == 'blood' && first) {
                        if (j == 0) {
                            ctx.fillStyle = '#ffffff';
                        } else {
                            ctx.fillStyle = '#F6312D';
                        }
                    }
                    //绘制字体及图标
                    if (category != 'blood') {
                        ctx.font = 'Bold 14px verdana';
                        ctx.fillText(obj_arr[j].name, degX, degY);
                        ctx.drawImage(img, -16, -120, 40, 30);
                    } else {
                        ctx.font = 'Bold 18px verdana';
                        ctx.fillText(obj_arr[j].name, degX, degY);
                    }
                    ctx.restore();
                }
            }


            //默认加载生肖转盘
            draw(12, ctx);
            creatFont(brr, -6, -60, category);

            //用户点击切换转盘
            /**
             cont : 用户点击选项的内容
             **/
            function chooseWitch(cont) {
                first = true;
                test_num = -1;
                switch (cont) {
                    case '生肖':
                        $('.qq_phone').hide();
                        $('#scream').attr('src', './images/zhuanpan.png');
                        $('#canvas,#btn1').show();
                        $('.two_ul li:eq(0)').addClass('active').siblings().removeClass('active');
                        category = 'animal';
                        draw(12, ctx);
                        creatFont(brr, -6, -60, category);
                        break;
                    case '星座':
                        $('.qq_phone').hide();
                        $('#scream').attr('src', './images/zhuanpan.png');
                        $('.two_ul li:eq(1)').addClass('active').siblings().removeClass('active');
                        $('#canvas,#btn1').show();
                        category = 'constellation';
                        draw(12, ctx);
                        creatFont(crr, -12, -70, category);
                        break;
                    case '血型':
                        $('.qq_phone').hide();
                        $('#scream').attr('src', './images/zhuanpan.png');
                        $('.two_ul li:eq(2)').addClass('active').siblings().removeClass('active');
                        $('#canvas,#btn1').show();
                        category = 'blood';
                        drawBlood(4);
                        creatFont(drr, -17, -60, category);
                        break;
                    case 'QQ号':
                        $('#canvas,#btn1').hide();
                        $('.qq_phone').show();
                        $('#scream').attr('src', './images/num_zhuanpan.png');
                        $('.qq_phone .qq_phone_top').html('请输入您的QQ号');
                        // $('#input').focus();
                        $('#input').val('');
                        $('#input').removeAttr('placeholder');
                        $('.two_ul li:eq(3)').addClass('active').siblings().removeClass('active');
                        break;
                    case '手机号':
                        $('#canvas,#btn1').hide();
                        $('.qq_phone').show();
                        $('#scream').attr('src', './images/num_zhuanpan.png');
                        $('.qq_phone .qq_phone_top').html('请输入您的手机号');
                        // $('#input').focus();
                        $('#input').val('');
                        $('#input').attr('placeholder','请输入正确的11位手机号');
                        $('.two_ul li:eq(4)').addClass('active').siblings().removeClass('active');
                        break;
                }
            }

            $(function () {

                if (window.sessionStorage.active_one) {
                    var active_one = window.sessionStorage.active_one;
                    switch (active_one) {
                        case '双色球':
                            $('.one_ul li:eq(0)').addClass('active').removeClass('boxshadow').siblings().removeClass('active').addClass('boxshadow');
                            break;
                        case '3D':
                            $('.one_ul li:eq(1)').addClass('active').removeClass('boxshadow').siblings().removeClass('active').addClass('boxshadow');
                            break;
                        case '七乐彩':
                            $('.one_ul li:eq(2)').addClass('active').removeClass('boxshadow').siblings().removeClass('active').addClass('boxshadow');
                            break;
                    }
                }
                if (window.sessionStorage.active_two) {
                    var active_two = window.sessionStorage.active_two;
                    chooseWitch(active_two);
                }
                function getCookie(cookieName, colorName) {
                    $('.record_cont.' + colorName + ' .record_cont_cont').html('');
                    if ($.cookie(cookieName)) {
                        var o = $.cookie(cookieName);
                        var xyxh_balls = JSON.parse(o);
                        for (var i = 0; i < xyxh_balls.length; i++) {
                            var $node = $('<div class="record_cont_cont"></div>');
                            var $node4 = $('<dl class="every_time_cont"></dl>');
                            var $node1 = $('<dt class="record_time">' + xyxh_balls[i].time + '</dt>');
                            $node4.append($node1);
                            for (var j = 0; j < xyxh_balls[i].balls.length; j++) {
                                var $node2 = $('<dd></dd>');
                                for (var k = 0; k < xyxh_balls[i].balls[j].length; k++) {
                                    if (k == xyxh_balls[i].balls[j].length - 1 && colorName != '3d') {
                                        $node2.append($('<span class="blue">' + xyxh_balls[i].balls[j][k] + '</span>'));
                                    } else {
                                        $node2.append($('<span class="red">' + xyxh_balls[i].balls[j][k] + '</span>'));
                                    }
                                }
                                $node4.append($node2);
                            }
                            $node.append($node4);
                            $node.prependTo($('.record_cont.' + colorName + ' .record_all_cont'));
                        }
                    }
                }

                getCookie('xyxh_shsq_balls', 'shsq');
                getCookie('xyxh_fc3d_balls', '3d');
                getCookie('xyxh_7lc_balls', '7lc');

                //幸运记录高度自适应
                var length_one = $('.record_cont_cont').length;
                for (var i = 0; i < length_one; i++) {
                    var height_one = parseInt($('.record_cont_cont:eq(' + i + ')').height()) + 'px';
                    $('.record_time:eq(' + i + ')').css('line-height', height_one);
                }

                //转盘切换选项栏处理
                var arr = [{top: '35px', left: '5px', deg: 'rotate(-35deg)'}, {top: '10px', left: '', deg: 'rotate(-20deg)'},
                    {top: '', left: '', deg: ''}, {top: '10px', left: '', deg: 'rotate(20deg)'}, {top: '35px', left: '-3px', deg: 'rotate(35deg)'}];
                for (var i = 0; i < arr.length; i++) {
                    $('.two_ul li:eq(' + i + ')').css({top: arr[i].top, left: arr[i].left, transform: arr[i].deg});
                }
            });
            $('.zushu_num,.top_menu li').bind('click', function () {
                $(this).addClass('active').siblings().removeClass('active');
            });
            $('.one_ul li span').bind('click', function () {
                var __ = $(this);
                __.parent().removeClass('boxshadow').siblings().addClass('boxshadow');
                window.sessionStorage.setItem('active_one', __.html());
            });
            $('.null_top:eq(0)').bind('click', function () {
                chooseWitch('生肖');
                window.sessionStorage.setItem('active_two', '生肖');
            });
            $('.null_top:eq(1)').bind('click', function () {
                chooseWitch('手机号');
                window.sessionStorage.setItem('active_two', '手机号');
            });
            $('.two_ul li').bind('click', function () {
                var cont = $(this).html();
                chooseWitch(cont);
                window.sessionStorage.setItem('active_two', cont);
            });
            //添加事件响应
            canvas.addEventListener('click', function (e) {
                var p = getEventPosition(e);

                first = false;
                //重绘
                if (category == 'animal') {
                    draw(12, ctx, p);
                    creatFont(brr, -6, -60, category);
                }
                if (category == 'constellation') {
                    draw(12, ctx, p);
                    creatFont(crr, -12, -70, category);
                }
                if (category == 'blood') {
                    drawBlood(4, p);
                    creatFont(drr, -12, -60, category);
                }
            }, false);

            //得到点击的坐标
            function getEventPosition(ev) {
                var x, y;
                if (ev.layerX || ev.layerX == 0) {
                    x = ev.layerX;
                    y = ev.layerY;
                } else if (ev.offsetX || ev.offsetX == 0) { // Opera
                    x = ev.offsetX;
                    y = ev.offsetY;
                }
                return {x: x, y: y};
            }

            // 从cookie中取出之前的记录
            var xyxh_shsq_balls = [], xyxh_fc3d_balls = [], xyxh_7lc_balls = [];
            if ($.cookie('xyxh_shsq_balls')) {
                var o1 = $.cookie('xyxh_shsq_balls');
                xyxh_shsq_balls = JSON.parse(o1);
            }
            if ($.cookie('xyxh_fc3d_balls')) {
                var o2 = $.cookie('xyxh_fc3d_balls');
                xyxh_fc3d_balls = JSON.parse(o2);
            }
            if ($.cookie('xyxh_7lc_balls')) {
                var o3 = $.cookie('xyxh_7lc_balls');
                xyxh_7lc_balls = JSON.parse(o3);
            }

            //幸运选号记录
            /**
             *
             * @param colorName: 将当前数据添加到HTML 对应容器的类名
             * @param colorBall：取出cookie已有内容的数组
             * @param cookieName：需要设置的cookie名称
             */
            function getBall(colorName, colorBall, cookieName) {
                var now = new Date();
                var h = now.getHours(), m = now.getMinutes();
                var xyxh_ball = {};
                var zushu = parseInt($('.zushu .zushu_num.active').html());
                var $node = $('<div class="record_cont_cont"></div>');
                var $node4 = $('<dl class="every_time_cont"></dl>');
                var now_time = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
                var $node1 = $('<dt class="record_time">' + now_time + '</dt>');
                $node4.append($node1);
                xyxh_ball.time = now_time;
                xyxh_ball.balls = [];
                for (var i = 0; i < zushu; i++) {
                    var $node2 = $('<dd></dd>');
                    var $node5 = $('<li></li>');
                    switch (colorBall) {
                        case 'xyxh_shsq_balls':
                            var arr = shsq_red_ball.random_numbers(6, true, true);
                            var brr = shsq_blue_ball.random_numbers(1);
                            var one_zhu = arr.concat(brr);
                            break;
                        case 'xyxh_fc3d_balls':
                            var one_zhu = fc3d_ball.random_numbers(3, true, true);
                            break;
                        case 'xyxh_7lc_balls':
                            var one_zhu = seven_ball.random_numbers(8, true, true);
                            break;
                    }
                    xyxh_ball.balls.push(one_zhu);
                    for (var j = 0; j < one_zhu.length; j++) {
                        if (j == one_zhu.length - 1 && colorBall != 'xyxh_fc3d_balls') {
                            $node2.append($('<span class="blue">' + one_zhu[j] + '</span>'));
                            $node5.append($('<span class="blue">' + one_zhu[j] + '</span>'));
                        } else {
                            $node2.append($('<span class="red">' + one_zhu[j] + '</span>'));
                            $node5.append($('<span class="red">' + one_zhu[j] + '</span>'));
                        }
                    }
                    $node4.append($node2);
                    $('.dialog_ball').append($node5);
                }
                var str;
                //序列化数据存入cookie
                switch (colorBall) {
                    case 'xyxh_shsq_balls':
                        xyxh_shsq_balls.push(xyxh_ball);
                        str = JSON.stringify(xyxh_shsq_balls);
                        break;
                    case 'xyxh_fc3d_balls':
                        xyxh_fc3d_balls.push(xyxh_ball);
                        str = JSON.stringify(xyxh_fc3d_balls);
                        break;
                    case 'xyxh_7lc_balls':
                        xyxh_7lc_balls.push(xyxh_ball);
                        str = JSON.stringify(xyxh_7lc_balls);
                        break;
                }
                //设置过期时间为当天零点
                var validity1 = validity(23, 59, 59);
                $.cookie(cookieName, str, {expires: validity1});
                $node.append($node4);
                $node.prependTo($('.record_cont.' + colorName + ' .record_all_cont'));
            }

            var click_num = 1;
            $('#btn2,#btn1,.img_null').bind('click', function () {
                var cont = $('.two_ul li.active').html();
                var pane = /^[0-9]*$/;
                if (cont == 'QQ号') {
                    console.log(pane.test($('#input').val()));
                    if ($('#input').val() == '' || !pane.test($('#input').val())) {
                        $('#input').val('');
                        $('#input').focus();
                        return;
                    }
                }
                if (cont == '手机号') {
                    if ($('#input').val() == '' || !pane.test($('#input').val()) || $('#input').val().length != 11) {
                        $('#input').val('');
                        $('#input').focus();
                        return;
                    }
                }
                $('#modal').show().css('opacity', 0).children().hide();
                $('.dialog_ball').html('');
                if (cont == 'QQ号' || cont == '手机号') {
                    $('#modal').css({
                        'background': 'rgba(0,0,0,0.4)',
                        'opacity': 1
                    }).children('.before_result').show().siblings().hide();
                    var str = '';
                    var timer = setInterval(function () {
                        if (str == '....') {
                            str = '';
                        }
                        $('.ellipsis').html(str);
                        str += '.';
                    }, 600);
                }
                var name = $('.one_ul li.active span').html();
                var deg = click_num * 1800;
                canvas.style.transform = 'rotate(' + deg + 'deg)';
                click_num++;
                setTimeout(function () {
                    switch (name) {
                        case '双色球':
                            getBall('shsq', 'xyxh_shsq_balls', 'xyxh_shsq_balls');
                            break;
                        case '3D':
                            getBall('3d', 'xyxh_fc3d_balls', 'xyxh_fc3d_balls');
                            break;
                        case '七乐彩':
                            getBall('7lc', 'xyxh_7lc_balls', 'xyxh_7lc_balls');
                            break;
                    }
                    var length_one = $('.record_cont_cont').length;
                    for (var i = 0; i < length_one; i++) {
                        var height_one = $('.record_cont_cont:eq(' + i + ')').innerHeight() + 'px';
                        $('.record_time:eq(' + i + ')').css('line-height', height_one);
                    }
                    window.clearInterval(timer);
                    $('#modal').css({
                        'background': 'rgba(0,0,0,0.4)',
                        'opacity': 1
                    }).children('#dialog').show().siblings().hide();
                }, 5000);
            });
        }, false);
    }
};