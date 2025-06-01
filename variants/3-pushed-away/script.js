var canvas = document.getElementById('nokey'),
   can_w = parseInt(canvas.getAttribute('width')),
   can_h = parseInt(canvas.getAttribute('height')),
   ctx = canvas.getContext('2d');

// console.log(typeof can_w);
var BALL_NUM = 3000

var ball = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 0,
      alpha: 1,
      phase: 0
   },
   ball_color = {
       r: 207,
       g: 255,
       b: 4
   },
   R = 2,
   balls = [],
   alpha_f = 0.03,
   alpha_phase = 0,
    
// Line
   link_line_width = 0.8,
   dis_limit = 25,
   add_mouse_point = true,
   mouse_in = false,
   mouse_ball = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 0,
      type: 'mouse'
   };
var dead_balls = [];

// Random speed
function getRandomSpeed(pos){
    var  min = -0.5,
       max = 0.5;
    switch(pos){
        case 'top':
            return [randomNumFrom(min, max), randomNumFrom(0.1, max)];
            break;
        case 'right':
            return [randomNumFrom(min, -0.1), randomNumFrom(min, max)];
            break;
        case 'bottom':
            return [randomNumFrom(min, max), randomNumFrom(min, -0.1)];
            break;
        case 'left':
            return [randomNumFrom(0.1, max), randomNumFrom(min, max)];
            break;
        default:
            return;
            break;
    }
}
function randomArrayItem(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomNumFrom(min, max){
    return Math.random()*(max - min) + min;
}
console.log(randomNumFrom(0, 10));
// Random Ball
function getRandomBall(){
    var pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
    switch(pos){
        case 'top':
            return {
                x: randomSidePos(can_w),
                y: -R,
                vx: getRandomSpeed('top')[0],
                vy: getRandomSpeed('top')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'right':
            return {
                x: can_w + R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('right')[0],
                vy: getRandomSpeed('right')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'bottom':
            return {
                x: randomSidePos(can_w),
                y: can_h + R,
                vx: getRandomSpeed('bottom')[0],
                vy: getRandomSpeed('bottom')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'left':
            return {
                x: -R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('left')[0],
                vy: getRandomSpeed('left')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
    }
}
function randomSidePos(length){
    return Math.ceil(Math.random() * length);
}

// Draw Ball
function renderBalls(){
    Array.prototype.forEach.call(balls, function(b){
		/* TODO: remove 'type' property, useless */
       if(!b.hasOwnProperty('type')){
           ctx.fillStyle = 'rgba('+ball_color.r+','+ball_color.g+','+ball_color.b+','+b.alpha+')';
           ctx.beginPath();
           ctx.arc(b.x, b.y, R, 0, Math.PI*2, true);
           ctx.closePath();
           ctx.fill();
       }
    });

/* TODO: use other properties specific to 'mouse_ball' */
/*
ctx.fillStyle = 'rgba('+ball_color.r+','+ball_color.g+','+ball_color.b+',1)';
ctx.beginPath();
ctx.arc(mouse_ball.x, mouse_ball.y, R*2, 0, Math.PI*2, true);
ctx.closePath();
ctx.fill();
*/

/* TODO: move all this to update!
+ handle 'real' death (destroy object) */
    Array.prototype.forEach.call(dead_balls, function(b){
		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.beginPath();
//		ctx.arc(b.x, b.y, R+(10-b.life), 0, Math.PI*2, true);
		ctx.arc(b.x, b.y, R+(5-b.life), 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
	});
}

// Update balls
/*
function updateBalls(){
    var new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
        b.x += b.vx;
        b.y += b.vy;

////
var fraction = getDisOf(b, mouse_ball) / 25;
if(fraction < 1){
	return;
}
////

        if(b.x > -(50) && b.x < (can_w+50) && b.y > -(50) && b.y < (can_h+50)){
           new_balls.push(b);
        }
        
        // alpha change
        b.phase += alpha_f;
        b.alpha = Math.abs(Math.cos(b.phase));
        // console.log(b.alpha);
    });
    
    balls = new_balls.slice(0);
}
*/
function updateBalls(){
    //var new_balls = [];
    for (var i = balls.length-1; i >= 0; --i) {
		var b = balls[i];
        b.x += b.vx;
        b.y += b.vy;

        if(b.x > -(50) && b.x < (can_w+50) && b.y > -(50) && b.y < (can_h+50)){
           //new_balls.push(b);

////
if (mouse_in) {
//TODO: make function
	var dist = getDisOf(b, mouse_ball);
	if (dist / dis_limit < 1) {
		// push away
		b.vx = (dis_limit - dist +0.1) * (b.x - mouse_ball.x) / 100.0;
		b.vy = (dis_limit - dist +0.1) * (b.y - mouse_ball.y) / 100.0;
		// trippy 'atom' effect (better with big 'dis_limit'
//		b.vx -= (b.x - mouse_ball.x) / 100.0;
//		b.vy -= (b.y - mouse_ball.y) / 100.0;
	}
}
////

        } else {
			balls[i] = balls[balls.length-1];
//TODO: better to reposition instead of killing
// => make function 'exitCanvas', where can decide what to do (die, reposition, etc.)
			balls.pop();
		}
/*
        if(b.x < -(50) || b.x > (can_w+50) || b.y < -(50) || b.y > (can_h+50)){
			balls[i] = balls[balls.length-1];
			balls.pop();
        }
*/

        // alpha change
        b.phase += alpha_f;
        b.alpha = Math.abs(Math.cos(b.phase));
        // console.log(b.alpha);
    }

////
for (var i = dead_balls.length-1; i >= 0; --i) {
	var b = dead_balls[i];
	--b.life;
	if (b.life <= 0) {
--BALL_NUM;
		dead_balls[i] = dead_balls[dead_balls.length-1];
		dead_balls.pop();
	}
}
////

    //balls = new_balls.slice(0);
}

/*
// loop alpha
function loopAlphaInf(){
    
}
*/

// Draw lines
/*
function renderLines(){
    var fraction, alpha;
    for (var i = 0; i < balls.length; i++) {
        for (var j = i + 1; j < balls.length; j++) {
           
           fraction = getDisOf(balls[i], balls[j]) / dis_limit;
            
           if(fraction < 1){
               alpha = (1 - fraction).toString();

               ctx.strokeStyle = 'rgba(150,150,150,'+alpha+')';
               ctx.lineWidth = link_line_width;
               
               ctx.beginPath();
               ctx.moveTo(balls[i].x, balls[i].y);
               ctx.lineTo(balls[j].x, balls[j].y);
               ctx.stroke();
               ctx.closePath();
           }
        }
    }
}
*/
function renderLines(){
	if (!mouse_in) {
		return;
	}
	var fraction, alpha;
	for (var i = 0; i < balls.length; i++) {
		fraction = getDisOf(balls[i], mouse_ball) / dis_limit;
		if(fraction < 1){
			alpha = (1 - fraction).toString();

			ctx.strokeStyle = 'rgba(150,150,150,'+alpha+')';
			ctx.lineWidth = link_line_width;

			ctx.beginPath();
			ctx.moveTo(balls[i].x, balls[i].y);
			ctx.lineTo(mouse_ball.x, mouse_ball.y);
			ctx.stroke();
			ctx.closePath();
		}
	}
}

// calculate distance between two points
function getDisOf(b1, b2){
    var  delta_x = Math.abs(b1.x - b2.x),
       delta_y = Math.abs(b1.y - b2.y);
    
    return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
}

// add balls if there a little balls
function addBallIfy(){
    //if(balls.length < BALL_NUM){
    while(balls.length < BALL_NUM){
        balls.push(getRandomBall());
    }
}

// Render
function render(){
    ctx.clearRect(0, 0, can_w, can_h);
    
    renderBalls();
    
//    renderLines();
    
    updateBalls();
    
    addBallIfy();
    
    window.requestAnimationFrame(render);
}

// Init Balls
function initBalls(num){
    for(var i = 1; i <= num; i++){
        balls.push({
            x: randomSidePos(can_w),
            y: randomSidePos(can_h),
            vx: getRandomSpeed('top')[0],
            vy: getRandomSpeed('top')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10)
        });
    }
}
// Init Canvas
function initCanvas(){
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    
    can_w = parseInt(canvas.getAttribute('width'));
    can_h = parseInt(canvas.getAttribute('height'));
}
window.addEventListener('resize', function(e){
    console.log('Window Resize...');
    initCanvas();
});

window.addEventListener('load', function(e){
    console.log('Window Load...');
    goMovie();
});

function goMovie(){
    initCanvas();
    initBalls(BALL_NUM);
    window.requestAnimationFrame(render);
}
//goMovie();

// Mouse effect
canvas.addEventListener('mouseenter', function(){
/*    console.log('mouseenter');*/
    mouse_in = true;
/*    balls.push(mouse_ball);*/
});
canvas.addEventListener('mouseleave', function(){
/*    console.log('mouseleave');*/
    mouse_in = false;
/*
    var new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
        if(!b.hasOwnProperty('type')){
            new_balls.push(b);
        }
    });
    balls = new_balls.slice(0);
*/
});
canvas.addEventListener('mousemove', function(e){
    var e = e || window.event;
    mouse_ball.x = e.pageX;
    mouse_ball.y = e.pageY;
    // console.log(mouse_ball);
});















