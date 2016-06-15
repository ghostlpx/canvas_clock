/*var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 600;
var RADIUS = 6;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 120;*/

//const endTime = new Date(2016,5,16,15,24,34);
var endTime = new Date();
endTime.setTime( endTime.getTime() + 3600*1000 );

var curTimeSecond = 0;

var balls = [];
//小球的颜色，共十种
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

window.onload = function(){

	//令画布大小根据屏幕进行自适应，这里注意一个css技巧：应该将html、body、canvas的height都设为100%
	WINDOW_WIDTH = document.body.clientWidth;
	WINDOW_HEIGHT = document.body.clientHeight;

	MARGIN_LEFT = Math.round( WINDOW_WIDTH/10 );	//左右边距各为1/10
	RADIUS = Math.round( WINDOW_WIDTH*4/5/108 )-1;	//数字总共占4/5

	MARGIN_TOP = Math.round( WINDOW_HEIGHT/5 );	

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;

	curTimeSecond = getCurTimeSecond();

	//每隔50ms对画布扫描一次
	setInterval( function(){
		render( context );
		update();
	},50 );
	
}

function getCurTimeSecond(){
	var curTime = new Date();

	//时钟效果
	var ret = curTime.getHours()*3600 + curTime.getMinutes()*60 + curTime.getSeconds();
	return ret;

	//倒计时效果
	/*var ret = endTime.getTime() - curTime.getTime();
	ret = Math.round( ret/1000 );
	return ret>=0 ? ret : 0;*/
}

//负责数据的升级
function update(){
	var nextTimeSecond = getCurTimeSecond();

	var nextHours = parseInt( nextTimeSecond/3600 );
	var nextMinutes = parseInt( (nextTimeSecond-nextHours*3600)/60 );
	var nextSeconds = nextTimeSecond%60;

	var curHours = parseInt( curTimeSecond/3600 );
	var curMinutes = parseInt( (curTimeSecond-curHours*3600)/60 );
	var curSeconds = curTimeSecond%60;

	if( nextSeconds != curSeconds ){

		//对比每个位置的数字是否发生变化，如果有变化则添加小球（addBalls()）
		if( parseInt(curHours/10) != parseInt(nextHours/10) ){
            addBalls( MARGIN_LEFT + 0 , MARGIN_TOP , parseInt(curHours/10) );
        }
        if( parseInt(curHours%10) != parseInt(nextHours%10) ){
            addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10) );
        }

        if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){
            addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10) );
        }
        if( parseInt(curMinutes%10) != parseInt(nextMinutes%10) ){
            addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes%10) );
        }

        if( parseInt(curSeconds/10) != parseInt(nextSeconds/10) ){
            addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curSeconds/10) );
        }
        if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
            addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
        }

		curTimeSecond = nextTimeSecond;
	}

	updateBalls();
}

//balls是个数组，里面放着每个构成数字的小球
function updateBalls(){

    for( var i = 0 ; i < balls.length ; i ++ ){

        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        //碰撞检测，碰撞下壁
        if( balls[i].y >= WINDOW_HEIGHT-RADIUS ){
            balls[i].y = WINDOW_HEIGHT-RADIUS;
            balls[i].vy = - balls[i].vy*0.75;
        }

        //碰撞检测，碰撞右壁
        if( balls[i].x >= WINDOW_WIDTH-RADIUS ){
        	balls[i].x = WINDOW_WIDTH-RADIUS;
        	balls[i].vx = - balls[i].vx*0.75;
        }
    }

    //性能优化。如果一直向balls数组中添加小球，终有内存耗尽的时刻。
    //所以，只把还存在于画布中的小球保留。
    var count = 0;
    for (var i = 0; i < balls.length; i++) {
    	if ( balls[i].x + RADIUS > 0 ) {
    		balls[count++] = balls[i];
    	}
    }

    while ( balls.length > count ) {
    	balls.pop();
    }
}

//想数组balls中添加小球，定义每个小球对象为aBall，它有自己的属性
function addBalls( x , y , num ){

    for( var i = 0  ; i < digit[num].length ; i ++ )
        for( var j = 0  ; j < digit[num][i].length ; j ++ )
            if( digit[num][i][j] == 1 ){
                var aBall = {
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:1.5+Math.random(),
                    vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,
                    vy:-5,
                    color: colors[ Math.floor( Math.random()*colors.length ) ]
                }

                balls.push( aBall )
            }
}

//负责画布的渲染
function render( cxt ){

	//每次渲染之前都对画布进行刷新
	cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

	var hours = parseInt( curTimeSecond/3600 );
	var minutes = parseInt( (curTimeSecond-hours*3600)/60 );
	var seconds = curTimeSecond%60;

	/*每个圆球都放在一个正方形格子中，球与格子内壁相距1px，那么正方形格子边长为2*(RADIUS+1)*/

	renderDigit( MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), cxt );
	renderDigit( MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, parseInt(hours%10), cxt );
	renderDigit( MARGIN_LEFT + 30*(RADIUS+1), MARGIN_TOP, 10, cxt );
	renderDigit( MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, parseInt(minutes/10), cxt );
	renderDigit( MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP, parseInt(minutes%10), cxt );
	renderDigit( MARGIN_LEFT + 69*(RADIUS+1), MARGIN_TOP, 10, cxt );
	renderDigit( MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, parseInt(seconds/10), cxt );
	renderDigit( MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP, parseInt(seconds%10), cxt );

	//继上面渲染完数字后，对即将下落的小球进行渲染
	for( var i = 0 ; i < balls.length ; i ++ ){
        cxt.fillStyle=balls[i].color;

        cxt.beginPath();
        cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI , true );
        cxt.closePath();

        cxt.fill();
    }
}

function renderDigit( x, y, num, cxt ){
	cxt.fillStyle = 'rgb(0,102,153)';

	for( var i=0; i<digit[num].length; i++ ){
		for( var j=0; j<digit[num][i].length; j++ ){
			if( digit[num][i][j] == 1 ){
				cxt.beginPath();
				cxt.arc( x+(2*j+1)*(RADIUS+1), y+(2*i+1)*(RADIUS+1), RADIUS, 0, 2*Math.PI );
				cxt.closePath();

				cxt.fill();
			}
		}
	}
}