
/* get HTML elements */
const section = document.getElementById('area');
const canvas = document.getElementById('particles_canvas');
const counter = document.getElementById('particles_counter');
const button = document.getElementById('particles_button');

const canvas_context = canvas.getContext('2d');
const button_display = button.style.display;

var canvas_width = parseInt(canvas.getAttribute('width'));
var canvas_height = parseInt(canvas.getAttribute('height'));

/* particles constants */
const PARTICLE_COUNT = 4000;
const PARTICLE_RADIUS = 2;
const PARTICLE_LIFESPAN = 5;
const PARTICLE_MAX_SPEED = 0.5;

const FORCE_RADIUS = 100;
const SQR_FORCE_RADIUS = FORCE_RADIUS * FORCE_RADIUS;

const CONTACT_RADIUS = 25;
const SQR_CONTACT_RADIUS = CONTACT_RADIUS * CONTACT_RADIUS;


const LINE_WIDTH = 0.8;




function getRandomSpeed(){
    return [
        randomNumFrom(-PARTICLE_MAX_SPEED, PARTICLE_MAX_SPEED),
        randomNumFrom(-PARTICLE_MAX_SPEED, PARTICLE_MAX_SPEED)
    ];
}

function randomArrayItem(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumFrom(min, max){
    return ((Math.random() * (max - min)) + min);
}

// Random Ball
function getRandomBall(){
    /* TODO: replace 'top', 'right', etc. with numbers/enum */
    const pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
    const speed = getRandomSpeed();
    switch(pos){
        case 'top':
            return {
                x: randomSidePos(canvas_width),
                y: -PARTICLE_RADIUS,
                vx: speed[0],
                vy: speed[1],
                r: PARTICLE_RADIUS,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'right':
            return {
                x: canvas_width + PARTICLE_RADIUS,
                y: randomSidePos(canvas_height),
                vx: speed[0],
                vy: speed[1],
                r: PARTICLE_RADIUS,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'bottom':
            return {
                x: randomSidePos(canvas_width),
                y: canvas_height + PARTICLE_RADIUS,
                vx: speed[0],
                vy: speed[1],
                r: PARTICLE_RADIUS,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'left':
            return {
                x: -PARTICLE_RADIUS,
                y: randomSidePos(canvas_height),
                vx: speed[0],
                vy: speed[1],
                r: PARTICLE_RADIUS,
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
function renderBalls() {
    for (let i = 0; i < balls.length; ++i) {
        const b = balls[i];
        canvas_context.fillStyle = 'rgba(' + ball_color.r + ','
                                           + ball_color.g + ','
                                           + ball_color.b + ','
                                           + b.alpha + ')';
        canvas_context.beginPath();
        canvas_context.arc(b.x, b.y, PARTICLE_RADIUS, 0, Math.PI * 2, true);
        canvas_context.closePath();
        canvas_context.fill();
    }

/* TODO: use other properties specific to 'mouse_ball' */
/*
canvas_context.fillStyle = 'rgba('+ball_color.r+','+ball_color.g+','+ball_color.b+',1)';
canvas_context.beginPath();
canvas_context.arc(mouse_ball.x, mouse_ball.y, PARTICLE_RADIUS*2, 0, Math.PI*2, true);
canvas_context.closePath();
canvas_context.fill();
*/

/* TODO: move all this to update!
+ handle 'real' death (destroy object) */
    for (let i = 0; i < dead_balls.length; ++i) {
        const ball = dead_balls[i];
        const alpha = ball.life/PARTICLE_LIFESPAN;
        canvas_context.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
        canvas_context.beginPath();
        canvas_context.arc(ball.x, ball.y, PARTICLE_RADIUS + (PARTICLE_LIFESPAN - ball.life), 0, Math.PI * 2);
        canvas_context.closePath();
        canvas_context.fill();
    }
}

// Update balls
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
	var fraction = getDistance(b, mouse_ball) / SQR_CONTACT_RADIUS;
	if(fraction < 1){
//		b.dead = true;
//		b.life = PARTICLE_LIFESPAN;
balls[i] = balls[balls.length-1];
balls.pop();
dead_balls.push(b);
		b.life = PARTICLE_LIFESPAN;

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


// Draw lines
function renderLines(){
	if (!mouse_in) {
		return;
	}

	var fraction, alpha;
	for (var i = 0; i < balls.length; i++) {
		fraction = getDistance(balls[i], mouse_ball) / SQR_FORCE_RADIUS;
		if(fraction < 1){

			alpha = (1 - fraction).toString();

			canvas_context.strokeStyle = 'rgba(150,150,150,'+alpha+')';
			canvas_context.lineWidth = LINE_WIDTH;

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
function getDistance(b1, b2){
    var  delta_x = Math.abs(b1.x - b2.x),
       delta_y = Math.abs(b1.y - b2.y);

    /* avoid 'sqrt' for performance */
    return (delta_x*delta_x + delta_y*delta_y);
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
            r: PARTICLE_RADIUS,
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
    initBalls(PARTICLE_COUNT);
    window.requestAnimationFrame(render);
}

window.addEventListener('load', (e) => {
    start();
});

window.addEventListener('resize', (e) => {
    initCanvas();
});


section.addEventListener('mouseenter', () => {
    mouse_in = true;
});
section.addEventListener('mouseleave', () => {
    mouse_in = false;
});

window.addEventListener('mousemove', (e) => {
    var e = e || window.event;
    mouse_ball.x = e.pageX;
    mouse_ball.y = e.pageY;
});

button.onclick = function(){
    start();
};

var nb_balls = PARTICLE_COUNT;

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


var balls = [];
var alpha_f = 0.03;
var alpha_phase = 0;

var dead_balls = [];

/* mouse */
var mouse_in = false;
var mouse_ball = {
    /* start far offscreen */
    x: -500,
    y: -500,
    vx: 0,
    vy: 0,
    r: 0,
    type: 'mouse'
};

//var add_mouse_point = true;

