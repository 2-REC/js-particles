// TODO: outer/main stuff...
//const main_container = document.getElementById("services_foreground");
const container = document.getElementById("container");
const canvas = document.getElementById("particles_canvas");

const canvas_context = canvas.getContext("2d");

const PI_2 = Math.PI * 2;


// TODO: make variables if editable via UI...
// => unless find a way to reload JS by 'injecting' const values?
const FPS = 60;
const PARTICLE_COUNT = 3000;
// TODO: handle different radii?
const PARTICLE_RADIUS = 2;
const PARTICLE_PHASE = 0.03;

// speeds in pixels per second
const PARTICLE_MIN_SPEED = 0.1; // >0!
const PARTICLE_MAX_SPEED = 100;

const MOUSE_FORCE = 1000;
const FORCE_RADIUS = 1500;
const FORCE_INCREASE = false;

const CONTACT_RADIUS = 25;

const PARTICLE_LIFESPAN = 0; // time of death
const PARTICLES_RESPAWN = true; // dead particles reappear

const MOUSE_PARTICLE = false; // draw mouse particle
const DRAW_LINES = true;

// TODO: Could be a particle variable to have changing colors
// TODO: change to simple triplet instead of r,g,b
const PARTICLE_COLOR = {
    r: 207,
    g: 255,
    b: 4
};
/* TODO: changes anything performance wise? (don't use if want changing colors) */
const PARTICLE_RGB_STR = `${PARTICLE_COLOR.r},${PARTICLE_COLOR.g},${PARTICLE_COLOR.b}`;
const DEAD_PARTICLE_COLOR = {
    r: 255,
    g: 0,
    b: 0
};

const LINE_WIDTH = 0.8;


const TIME_STEP_SECONDS = 1 / FPS;
const TIME_STEP = TIME_STEP_SECONDS * 1000;

const SQR_FORCE_RADIUS = FORCE_RADIUS * FORCE_RADIUS;
const SQR_CONTACT_RADIUS = CONTACT_RADIUS * CONTACT_RADIUS;

// closer => faster
function ParticleSpeedIncrease(sqr_distance) {
    // +0.1 to avoid standing still when at full distance
    return Math.sqrt((SQR_FORCE_RADIUS - sqr_distance)) / FORCE_RADIUS + 0.1;
}

// further => faster
function ParticleSpeedDecrease(sqr_distance) {
    return Math.sqrt(sqr_distance) / FORCE_RADIUS;
}

const ParticleSpeed = (FORCE_INCREASE) ? ParticleSpeedIncrease : ParticleSpeedDecrease;


/* TODO: use closures to fix min, max or both numbers (as constants) */
/* TODO: rename to 'getRandomNumber' */
function getRandomRangeNumber(min, max) {
    return ((Math.random() * (max - min)) + min);
}

function getRandomSpeed() {
    const x_sign = Math.random() < 0.5 ? -1 : 1;
    const y_sign = Math.random() < 0.5 ? -1 : 1;
    return [
        getRandomRangeNumber(PARTICLE_MIN_SPEED, PARTICLE_MAX_SPEED) * x_sign,
        getRandomRangeNumber(PARTICLE_MIN_SPEED, PARTICLE_MAX_SPEED) * y_sign
    ];
}

/* TODO: replace 'PARTICLE_RADIUS' by other constant 'OUTBOUND' or something... */
function isOutside(particle) {
    return (
        particle.x < -PARTICLE_RADIUS
        || particle.x > outside_right
        || particle.y < -PARTICLE_RADIUS
        || particle.y > outside_top
    )
}

function getDistance(point1, point2){
    const delta_x = Math.abs(point1.x - point2.x);
    const delta_y = Math.abs(point1.y - point2.y);

    /* avoid 'sqrt' for performance */
    return (delta_x * delta_x + delta_y * delta_y);
}

/* TODO: add speeds as parameters? */
function newParticle(x, y) {
    const x_position = (x === undefined) ? (Math.random() * canvas_width) : x;
    const y_position = (y === undefined) ? (Math.random() * canvas_height) : y;
    const speed = getRandomSpeed();

    return {
        x: x_position,
        y: y_position,
        vx: speed[0],
        vy: speed[1],
        //r: PARTICLE_RADIUS,
        alpha: 1,
        phase: Math.random() * 10
    };
}

function newSideParticle() {
    let x = undefined;
    let y = undefined;

    const side = Math.floor(Math.random() * 4);
    switch(side){
        case 0: // top
            y = -PARTICLE_RADIUS;
            break;
        case 1: // right
            x = canvas_width + PARTICLE_RADIUS;
            break;
        case 2: // bottom
            y = canvas_height + PARTICLE_RADIUS;
            break;
        case 3: // left
            x = -PARTICLE_RADIUS;
            break;
    }

    return newParticle(x, y);
}

// recreate 'missing' particles
function addParticles() {
    while (particles.length < nb_particles) {
//        particles.push(newParticle());
        particles.push(newSideParticle());
    }
}

function updateParticles(step) {
    line_particles.length = 0;

    for (let i = particles.length-1; i >= 0; --i) {
        const b = particles[i];
        b.x += b.vx * step;
        b.y += b.vy * step;

        if (isOutside(b)) {
            particles[i] = particles[particles.length - 1];
            particles.pop();
            continue
        }

        /* TODO: better to make separate loop only if 'mouse_in'? */
        if (mouse_in) {
            /* TODO: optimise with kind of BSP tree? */
            const sqr_distance = getDistance(b, mouse_particle);
            if (sqr_distance < SQR_CONTACT_RADIUS) {
                /* TODO: make separate function */
                particles[i] = particles[particles.length - 1];
                particles.pop();
                if (!PARTICLES_RESPAWN) {
                    --nb_particles;
                }

                b.life = PARTICLE_LIFESPAN;
                dead_particles.push(b);

            } else if (sqr_distance < SQR_FORCE_RADIUS) {
                if (MOUSE_FORCE) {
                    const speed = ParticleSpeed(sqr_distance);

                    const deltaX = mouse_particle.x - b.x;
                    const deltaY = mouse_particle.y - b.y;

                    const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    if (magnitude === 0) {
                        b.vx = 0;
                        b.vy = 0;
                    } else {
                        b.vx = MOUSE_FORCE * (deltaX / magnitude) * speed;
                        b.vy = MOUSE_FORCE * (deltaY / magnitude) * speed;
                    }
                }

                line_particles.push([b, sqr_distance]);
            }
        }

        b.phase += PARTICLE_PHASE;
        /* TODO: can avoid 'cos' (lookup table)? */
        b.alpha = Math.abs(Math.cos(b.phase));
    }

    /* TODO: make function? */
    for (let i = dead_particles.length-1; i >= 0; --i) {
        const b = dead_particles[i];
        --b.life;
        if (b.life <= 0) {
            dead_particles[i] = dead_particles[dead_particles.length-1];
            dead_particles.pop();
        }
    }
}

function drawParticles() {
    if (nb_particles == 0) {
// TODO: return?
    }

    particles.forEach((particle) => {
//        canvas_context.fillStyle = `rgba(${PARTICLE_COLOR.r},${PARTICLE_COLOR.g},${PARTICLE_COLOR.b},${particle.alpha})`;
        canvas_context.fillStyle = `rgba(${PARTICLE_RGB_STR},${particle.alpha})`;
        canvas_context.beginPath();
        canvas_context.arc(particle.x, particle.y, PARTICLE_RADIUS, 0, PI_2, true);
        canvas_context.closePath();
        canvas_context.fill();
    });

    if (MOUSE_PARTICLE && mouse_in) {
        // TODO: use other properties specific to 'mouse_particle' (?)
        canvas_context.fillStyle = 'rgba('+PARTICLE_COLOR.r+','+PARTICLE_COLOR.g+','+PARTICLE_COLOR.b+',1)';
        canvas_context.beginPath();
        canvas_context.arc(mouse_particle.x, mouse_particle.y, PARTICLE_RADIUS*2, 0, PI_2, true);
        canvas_context.closePath();
        canvas_context.fill();
    }

    dead_particles.forEach((dead_particle) => {
        const alpha = dead_particle.life / PARTICLE_LIFESPAN;
        canvas_context.fillStyle = `rgba(${DEAD_PARTICLE_COLOR.r},${DEAD_PARTICLE_COLOR.g},${DEAD_PARTICLE_COLOR.b},${alpha})`;
        canvas_context.beginPath();
        canvas_context.arc(dead_particle.x, dead_particle.y, PARTICLE_RADIUS + (PARTICLE_LIFESPAN - dead_particle.life), 0, PI_2);
        canvas_context.closePath();
        canvas_context.fill();
    });
}

function drawLines() {
    if (!mouse_in || !line_particles.length) {
        return;
    }

    canvas_context.lineWidth = LINE_WIDTH;
    for (let i = 0; i < line_particles.length; i++) {
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

function updateLogic(step) {
    addParticles();
    updateParticles(step);

// TODO: make optional
//    updateLogicFPS();
}

function render() {
    canvas_context.clearRect(0, 0, canvas_width, canvas_height);

    drawParticles();
    if (DRAW_LINES) {
        drawLines();
    }

// TODO: make optional
//    updateDisplayFPS();
//    showFPS();
}

function processLoop(timestamp) {
    const deltaTime = timestamp - lastUpdateTime;
    lastUpdateTime = timestamp;

    accumulatedTime += deltaTime;

    while (accumulatedTime >= TIME_STEP) {
        updateLogic(TIME_STEP_SECONDS);
        accumulatedTime -= TIME_STEP;
    }

    // TODO: could use interpolation for smooth display...
    //const interpolation = accumulatedTime / TIME_STEP;
    render();

    if (nb_particles + dead_particles.length > 0)  {
        requestAnimationFrame(processLoop);
    }
}

function updateCanvas() {
    const width = container.clientWidth;
    canvas.setAttribute("width", width);
    canvas_width = width;
    outside_right = canvas_width + PARTICLE_RADIUS;

    const height = container.clientHeight;
    canvas.setAttribute("height", height);
    canvas_height = height;
    outside_top = canvas_height + PARTICLE_RADIUS;
}

function initParticles(nb) {
    particles.length = 0;
    nb_particles = nb;

    for (let i = 1; i <= nb; i++) {
        // if want to spawn off screen to force random repositioning around canvas borders
        //particles.push(newParticle(-100, -100));
        particles.push(newParticle(undefined, undefined));
    }
}

function initElements() {
    // TODO: html stuff
}

function start() {
    updateCanvas();
    initParticles(PARTICLE_COUNT);
    initElements();

    requestAnimationFrame(processLoop);
}

function init() {
    window.addEventListener("load", () => {
        start();
    });

    window.addEventListener("resize", () => {
        updateCanvas();
    });

    canvas.addEventListener("mouseenter", () => {
        mouse_in = true;
    });

    canvas.addEventListener("mouseleave", () => {
        mouse_in = false;
    });

    canvas.addEventListener("mousemove", (e) => {
        const event = e || window.event;
        mouse_particle.x = event.pageX;
        mouse_particle.y = event.pageY;
    });

}

let canvas_width = parseInt(canvas.getAttribute("width"));
let canvas_height = parseInt(canvas.getAttribute("height"));

let outside_right = canvas_width + PARTICLE_RADIUS;
let outside_top = canvas_height + PARTICLE_RADIUS;

let nb_particles = 0;
const particles = new Array();
const dead_particles = new Array();
let line_particles = [];

let mouse_in = false;
let mouse_particle = {
    /* start offscreen */
    x: -FORCE_RADIUS,
    y: -FORCE_RADIUS,
};

let lastUpdateTime = 0;
let accumulatedTime = 0;

init();

