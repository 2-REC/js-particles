
const container = document.getElementById('container');
const canvas = document.getElementById('particles_canvas');
const counter = document.getElementById('particles_counter');
const button = document.getElementById('particles_button');

const canvas_context = canvas.getContext('2d');
const button_display = button.style.display;

var canvas_width = parseInt(canvas.getAttribute('width'));
var canvas_height = parseInt(canvas.getAttribute('height'));

const PI_2 = Math.PI * 2;

const PARTICLE_COUNT = 4000;
const PARTICLE_RADIUS = 2;
const PARTICLE_PHASE = 0.03;
const PARTICLE_MAX_SPEED = 0.5;
const PARTICLE_LIFESPAN = 5;
/* TODO: Could be added to each particle to have changing colors */
var PARTICLE_COLOR = {
    r: 207,
    g: 255,
    b: 4
};
/* TODO: changes anything performance wise? (don't use if want changing colors) */
const PARTICLE_RGB_STR = PARTICLE_COLOR.r + ',' + PARTICLE_COLOR.g + ',' + PARTICLE_COLOR.b;

const LINE_WIDTH = 0.8;

const FORCE_RADIUS = 100;
const SQR_FORCE_RADIUS = FORCE_RADIUS * FORCE_RADIUS;

const CONTACT_RADIUS = 25;
const SQR_CONTACT_RADIUS = CONTACT_RADIUS * CONTACT_RADIUS;

var outside_right = canvas_width + PARTICLE_RADIUS;
var outside_top = canvas_height + PARTICLE_RADIUS;


function getRandomNumber(max){
    /* cast to int isn't necessary */
    return (Math.random() * max);
}

function getRandomRangeNumber(min, max) {
    return ((Math.random() * (max - min)) + min);
}

/* TODO: can have null speeds... */
function getRandomSpeed() {
    return [
        getRandomRangeNumber(-PARTICLE_MAX_SPEED, PARTICLE_MAX_SPEED),
        getRandomRangeNumber(-PARTICLE_MAX_SPEED, PARTICLE_MAX_SPEED)
    ];
}

function isOutside(particle) {
    return (particle.x < -50
            || particle.x > outside_right
            || particle.y < -50
            || particle.y > outside_top)
}

function getDistance(p1, p2){
    const delta_x = Math.abs(p1.x - p2.x);
    const delta_y = Math.abs(p1.y - p2.y);

    /* avoid 'sqrt' for performance */
    return (delta_x * delta_x + delta_y * delta_y);
}

function newParticle(x, y) {
    if (x === undefined) {
        x = getRandomNumber(canvas_width);
    }
    if (y === undefined) {
        y = getRandomNumber(canvas_height);
    }
    const speed = getRandomSpeed();

    return {
        x: x,
        y: y,
        vx: speed[0],
        vy: speed[1],
        alpha: 1,
        phase: getRandomRangeNumber(0, 10)
    }
}

/* TODO: return at end of function + handle default case (?) */
function newSideParticle(){
    const pos = Math.floor(getRandomRangeNumber(0, 4));
    switch(pos){
        case 0: // top
            return newParticle(undefined, -PARTICLE_RADIUS);
        case 1: // right
            return newParticle(canvas_width + PARTICLE_RADIUS, undefined);
        case 2: // bottom
            return newParticle(undefined, canvas_height + PARTICLE_RADIUS);
        case 3: // left
            return newParticle(-PARTICLE_RADIUS, undefined);
    }
}

/* recreate 'missing' particles */
function addParticles(){
    while(particles.length < nb_particles){
        particles.push(newSideParticle());
    }
}

function updateParticles() {
    line_particles.length = 0;
    for (var i = particles.length-1; i >= 0; --i) {
        const b = particles[i];
        b.x += b.vx;
        b.y += b.vy;

        if (isOutside(b)) {
            particles[i] = particles[particles.length - 1];
            particles.pop();
            continue
        }

        /* TODO: better to make separate loop only if 'mouse_in'? */
        if (mouse_in) {
            /* TODO: optimise with kind of BSP tree? */
            const distance = getDistance(b, mouse_particle);
            if (distance < SQR_CONTACT_RADIUS) {
                /* TODO: make separate function */
                particles[i] = particles[particles.length - 1];
                particles.pop();
                --nb_particles;

                b.life = PARTICLE_LIFESPAN;
                dead_particles.push(b);

            } else if (distance < SQR_FORCE_RADIUS) {
                /* TODO: make better formula... */
                b.vx = (mouse_particle.x - b.x) / 100.0;
                b.vy = (mouse_particle.y - b.y) / 100.0;
                line_particles.push([b, distance]);
            }
        }

        b.phase += PARTICLE_PHASE;
        /* TODO: can avoid 'cos' (lookup table)? */
        b.alpha = Math.abs(Math.cos(b.phase));
    }

    /* TODO: make function */
    for (var i = dead_particles.length-1; i >= 0; --i) {
        const b = dead_particles[i];
        --b.life;
        if (b.life <= 0) {
            dead_particles[i] = dead_particles[dead_particles.length-1];
            dead_particles.pop();
        }
    }
}


function drawParticles() {
    counter.innerHTML = nb_particles;
    if (nb_particles == 0) {
        button.style.display = button_display;
    }

    for (let i = 0; i < particles.length; ++i) {
        const b = particles[i];
/*
        canvas_context.fillStyle = 'rgba(' + PARTICLE_COLOR.r + ','
                                           + PARTICLE_COLOR.g + ','
                                           + PARTICLE_COLOR.b + ','
                                           + b.alpha + ')';
*/
        canvas_context.fillStyle = 'rgba(' + PARTICLE_RGB_STR + ',' + b.alpha + ')';
        canvas_context.beginPath();
        canvas_context.arc(b.x, b.y, PARTICLE_RADIUS, 0, PI_2, true);
        canvas_context.closePath();
        canvas_context.fill();
    }

/* TODO: use other properties specific to 'mouse_particle' (+make separate function?) */
/*
    if (mouse_in) {
        canvas_context.fillStyle = 'rgba('+PARTICLE_COLOR.r+','+PARTICLE_COLOR.g+','+PARTICLE_COLOR.b+',1)';
        canvas_context.beginPath();
        canvas_context.arc(mouse_particle.x, mouse_particle.y, PARTICLE_RADIUS*2, 0, PI_2, true);
        canvas_context.closePath();
        canvas_context.fill();
    }
*/

    for (let i = 0; i < dead_particles.length; ++i) {
        const particle = dead_particles[i];
        const alpha = particle.life / PARTICLE_LIFESPAN;
        canvas_context.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
        canvas_context.beginPath();
        canvas_context.arc(particle.x, particle.y, PARTICLE_RADIUS + (PARTICLE_LIFESPAN - particle.life), 0, PI_2);
        canvas_context.closePath();
        canvas_context.fill();
    }
}

function drawLines() {
    if (!mouse_in || !line_particles.length) {
        return;
    }

    canvas_context.lineWidth = LINE_WIDTH;
    for (var i = 0; i < line_particles.length; i++) {
        const line_particle = line_particles[i];
        const b = line_particle[0];
        const distance = line_particle[1];

        const alpha = 1 - (distance / SQR_FORCE_RADIUS);

        canvas_context.strokeStyle = 'rgba(150,150,150,' + alpha + ')';
        //canvas_context.lineWidth = LINE_WIDTH;

        canvas_context.beginPath();
        canvas_context.moveTo(b.x, b.y);
        canvas_context.lineTo(mouse_particle.x, mouse_particle.y);
        canvas_context.stroke();
        canvas_context.closePath();
    }
}


function process(){
    addParticles();
    updateParticles();

    canvas_context.clearRect(0, 0, canvas_width, canvas_height);
    drawParticles();
    drawLines();
    window.requestAnimationFrame(process);
}

function updateCanvas() {
    const width = container.clientWidth;
    canvas.setAttribute('width', width);
    canvas_width = width; // 'parseInt'?
    outside_right = canvas_width + PARTICLE_RADIUS;

    const height = container.clientHeight;
    canvas.setAttribute('height', height);
    canvas_height = height; // 'parseInt'?
    outside_top = canvas_height + PARTICLE_RADIUS;
}

function initParticles(){
    particles = [];
    nb_particles = PARTICLE_COUNT;

    for(var i = 1; i <= nb_particles; i++){
        particles.push(newParticle(undefined, undefined));
    }
}

function initElements() {
    counter.innerHTML = nb_particles;
    button.style.display = "none";
}

function start(){
    updateCanvas();
    initParticles();
    initElements();
    window.requestAnimationFrame(process);
}

function init() {
    window.addEventListener('load', (e) => {
        start();
    });
    window.addEventListener('resize', (e) => {
        updateCanvas();
    });

    container.addEventListener('mouseenter', () => {
        mouse_in = true;
    });
    container.addEventListener('mouseleave', () => {
        mouse_in = false;
    });
    window.addEventListener('mousemove', (e) => {
        var e = e || window.event;
        mouse_particle.x = e.pageX;
        mouse_particle.y = e.pageY;
    });

    button.onclick = function(){
        start();
    };
}


var nb_particles = 0;
var particles = [];
var dead_particles = [];
var line_particles = [];


var mouse_in = false;
var mouse_particle = {
    /* start offscreen */
    x: -FORCE_RADIUS,
    y: -FORCE_RADIUS,
};


init();
