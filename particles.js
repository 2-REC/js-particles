
/* get HTML elements */
var section = document.getElementById('area');
var canvas = document.getElementById('particles_canvas');
var counter = document.getElementById('particles_counter');
var button = document.getElementById('particles_button');

const canvas_context = canvas.getContext('2d');
const button_display = button.style.display;

var canvas_width = parseInt(canvas.getAttribute('width'));
var canvas_height = parseInt(canvas.getAttribute('height'));

const BALL_NUM = 3000;
const LIFE_SPAN = 5;


var nb_balls = BALL_NUM;


var ball = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    r: 0,
    alpha: 1,
    phase: 0
};

var ball_color = {
    r: 207,
    g: 255,
    b: 4
};

var R = 2;
var balls = [];
var alpha_f = 0.03;
var alpha_phase = 0;
    
// Line
var link_line_width = 0.8;
var dis_limit = 100;
var add_mouse_point = true;
var mouse_in = false;
var mouse_ball = {
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

// Random Ball
function getRandomBall(){
    var pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
    switch(pos){
        case 'top':
            return {
                x: randomSidePos(canvas_width),
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
                x: canvas_width + R,
                y: randomSidePos(canvas_height),
                vx: getRandomSpeed('right')[0],
                vy: getRandomSpeed('right')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'bottom':
            return {
                x: randomSidePos(canvas_width),
                y: canvas_height + R,
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
                y: randomSidePos(canvas_height),
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
           canvas_context.fillStyle = 'rgba('+ball_color.r+','+ball_color.g+','+ball_color.b+','+b.alpha+')';
           canvas_context.beginPath();
           canvas_context.arc(b.x, b.y, R, 0, Math.PI*2, true);
           canvas_context.closePath();
           canvas_context.fill();
       }
    });

/* TODO: use other properties specific to 'mouse_ball' */
/*
canvas_context.fillStyle = 'rgba('+ball_color.r+','+ball_color.g+','+ball_color.b+',1)';
canvas_context.beginPath();
canvas_context.arc(mouse_ball.x, mouse_ball.y, R*2, 0, Math.PI*2, true);
canvas_context.closePath();
canvas_context.fill();
*/

/* TODO: move all this to update!
+ handle 'real' death (destroy object) */
    Array.prototype.forEach.call(dead_balls, function(b){
		var alpha = b.life/LIFE_SPAN;
		canvas_context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
		canvas_context.beginPath();
		canvas_context.arc(b.x, b.y, R + (LIFE_SPAN - b.life), 0, Math.PI*2, true);
		canvas_context.closePath();
		canvas_context.fill();
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

        if(b.x > -(50) && b.x < (canvas_width+50) && b.y > -(50) && b.y < (canvas_height+50)){
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

        if(b.x > -(50) && b.x < (canvas_width+50) && b.y > -(50) && b.y < (canvas_height+50)){
           //new_balls.push(b);

////
if (mouse_in) {
	var fraction = getDisOf(b, mouse_ball) / 25;
	if(fraction < 1){
//		b.dead = true;
//		b.life = LIFE_SPAN;
balls[i] = balls[balls.length-1];
balls.pop();
dead_balls.push(b);
		b.life = LIFE_SPAN;

//TODO: make function
--nb_balls;
counter.innerHTML = nb_balls;
if (nb_balls == 0) {
	button.style.display = button_display;
}

	}
}
////

        } else {
			balls[i] = balls[balls.length-1];
			balls.pop();
		}
/*
        if(b.x < -(50) || b.x > (canvas_width+50) || b.y < -(50) || b.y > (canvas_height+50)){
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

               canvas_context.strokeStyle = 'rgba(150,150,150,'+alpha+')';
               canvas_context.lineWidth = link_line_width;
               
               canvas_context.beginPath();
               canvas_context.moveTo(balls[i].x, balls[i].y);
               canvas_context.lineTo(balls[j].x, balls[j].y);
               canvas_context.stroke();
               canvas_context.closePath();
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

			canvas_context.strokeStyle = 'rgba(150,150,150,'+alpha+')';
			canvas_context.lineWidth = link_line_width;

			canvas_context.beginPath();
			canvas_context.moveTo(balls[i].x, balls[i].y);
			canvas_context.lineTo(mouse_ball.x, mouse_ball.y);
			canvas_context.stroke();
			canvas_context.closePath();

			balls[i].vx = (mouse_ball.x - balls[i].x) / 100.0;
			balls[i].vy = (mouse_ball.y - balls[i].y) / 100.0;
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
    //if(balls.length < nb_balls){
    while(balls.length < nb_balls){
        balls.push(getRandomBall());
    }
}

// Render
function render(){
    canvas_context.clearRect(0, 0, canvas_width, canvas_height);
    
    renderBalls();
    
    renderLines();
    
    updateBalls();
    
    addBallIfy();
    
    window.requestAnimationFrame(render);
}

// Init Balls
function initBalls(num){
    nb_balls = num;
    for(var i = 1; i <= num; i++){
        balls.push({
            x: randomSidePos(canvas_width),
            y: randomSidePos(canvas_height),
            vx: getRandomSpeed('top')[0],
            vy: getRandomSpeed('top')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10)
        });
    }
}
// Init Canvas
function initCanvas() {
    canvas.setAttribute('width', section.clientWidth);
    canvas.setAttribute('height', section.clientHeight);

    canvas_width = parseInt(canvas.getAttribute('width'));
    canvas_height = parseInt(canvas.getAttribute('height'));
}

function initElements() {
    counter.innerHTML = nb_balls;
    button.style.display = "none";
}

function start(){
    initElements();
    initCanvas();
    initBalls(BALL_NUM);
    window.requestAnimationFrame(render);
}

window.addEventListener('load', function(e){
    start();
});

window.addEventListener('resize', function(e){
    initCanvas();
});


section.addEventListener('mouseenter', function(){
    mouse_in = true;
});
section.addEventListener('mouseleave', function(){
    mouse_in = false;
});

window.addEventListener('mousemove', function(e){
    var e = e || window.event;
    mouse_ball.x = e.pageX;
    mouse_ball.y = e.pageY;
});

button.onclick = function(){
    start();
};
