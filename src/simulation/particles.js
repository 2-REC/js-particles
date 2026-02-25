/**
 *  Core Simulation Logic
 */

export function initSimulation(initialConfig = {}) {
    const container = document.getElementById("container");
    const canvas = document.getElementById("particles_canvas");
    const counter = document.getElementById("particles_counter");
    const button = document.getElementById("particles_button");
    const canvas_context = canvas.getContext("2d");
    const PI_2 = Math.PI * 2;

    let config = {
        FPS: initialConfig.FPS || 60,
        PARTICLE_COUNT: initialConfig.PARTICLE_COUNT || 3000,
        PARTICLE_RADIUS: initialConfig.PARTICLE_RADIUS || 2,
        PARTICLE_PHASE: initialConfig.PARTICLE_PHASE || 0.03,
        PARTICLE_MIN_SPEED: initialConfig.PARTICLE_MIN_SPEED || 0.1,
        PARTICLE_MAX_SPEED: initialConfig.PARTICLE_MAX_SPEED || 100,
        MOUSE_FORCE: initialConfig.MOUSE_FORCE || 100,
        FORCE_RADIUS: initialConfig.FORCE_RADIUS || 100,
        FORCE_INCREASE: initialConfig.FORCE_INCREASE || false,
        CONTACT_RADIUS: initialConfig.CONTACT_RADIUS || 25,
        PARTICLE_LIFESPAN: initialConfig.PARTICLE_LIFESPAN || 5,
        PARTICLES_RESPAWN: initialConfig.PARTICLES_RESPAWN ?? false,
        MOUSE_PARTICLE: initialConfig.MOUSE_PARTICLE || false,
        DRAW_LINES: initialConfig.DRAW_LINES ?? true,
        LINE_WIDTH: initialConfig.LINE_WIDTH || 0.8,
        PARTICLE_COLOR: initialConfig.PARTICLE_COLOR || { r: 207, g: 255, b: 4 },
        DEAD_PARTICLE_COLOR: initialConfig.DEAD_PARTICLE_COLOR || { r: 255, g: 0, b: 0 },
        BACKGROUND_COLOR: initialConfig.BACKGROUND_COLOR || { r: 0, g: 0, b: 0 }
    };

    let TIME_STEP_SECONDS;
    let TIME_STEP;
    let SQR_FORCE_RADIUS;
    let SQR_CONTACT_RADIUS;
    let PARTICLE_RGB_STR;

    // TODO: rename to '...Fct'?
    let ParticleSpeed;

    /* TODO: rename to 'updateValues'? */
    function syncDerivedValues() {
        TIME_STEP_SECONDS = 1 / config.FPS;
        TIME_STEP = TIME_STEP_SECONDS * 1000;
        SQR_FORCE_RADIUS = config.FORCE_RADIUS * config.FORCE_RADIUS;
        SQR_CONTACT_RADIUS = config.CONTACT_RADIUS * config.CONTACT_RADIUS;
        PARTICLE_RGB_STR = `${ config.PARTICLE_COLOR.r },${ config.PARTICLE_COLOR.g },${ config.PARTICLE_COLOR.b }`;

        // TODO: no updates to do in sim?

        ParticleSpeed = config.FORCE_INCREASE ? ParticleSpeedIncrease : ParticleSpeedDecrease;

        if ( container ) {
            const bg = config.BACKGROUND_COLOR;
            container.style.backgroundColor = `rgb(${bg.r},${bg.g},${bg.b})`;
        }
    }

    // closer => faster
    function ParticleSpeedIncrease(sqr_distance) {
        // +0.1 to avoid standing still when at full distance
        return Math.sqrt((SQR_FORCE_RADIUS - sqr_distance)) / config.FORCE_RADIUS + 0.1;
    }

    // further => faster
    function ParticleSpeedDecrease(sqr_distance) {
        return Math.sqrt(sqr_distance) / config.FORCE_RADIUS;
    }

    function getRandomRangeNumber(min, max) {
        return ((Math.random() * (max - min)) + min);
    }

    function getRandomSpeed() {
        const x_sign = Math.random() < 0.5 ? -1 : 1;
        const y_sign = Math.random() < 0.5 ? -1 : 1;
        return [
            getRandomRangeNumber(config.PARTICLE_MIN_SPEED, config.PARTICLE_MAX_SPEED) * x_sign,
            getRandomRangeNumber(config.PARTICLE_MIN_SPEED, config.PARTICLE_MAX_SPEED) * y_sign
        ];
    }

    function isOutside(particle) {
        return (
            particle.x < -config.PARTICLE_RADIUS
            || particle.x > outside_right
            || particle.y < -config.PARTICLE_RADIUS
            || particle.y > outside_top
        );
    }

    function getDistance(point1, point2) {
        const delta_x = Math.abs(point1.x - point2.x);
        const delta_y = Math.abs(point1.y - point2.y);
        return (delta_x * delta_x + delta_y * delta_y);
    }

    function newParticle(x, y) {
        const x_position = (x === undefined) ? (Math.random() * canvas_width) : x;
        const y_position = (y === undefined) ? (Math.random() * canvas_height) : y;
        const speed = getRandomSpeed();
        return {
            x: x_position,
            y: y_position,
            vx: speed[0],
            vy: speed[1],
            alpha: 1,
            phase: Math.random() * 10
        };
    }

    function newSideParticle() {
        let x = undefined;
        let y = undefined;
        const side = Math.floor(Math.random() * 4);
        switch (side) {
            case 0:
                y = -config.PARTICLE_RADIUS;
                break;
            case 1:
                x = canvas_width + config.PARTICLE_RADIUS;
                break;
            case 2:
                y = canvas_height + config.PARTICLE_RADIUS;
                break;
            case 3:
                x = -config.PARTICLE_RADIUS;
                break;
        }
        return newParticle(x, y);
    }

    function addParticles() {
        while (particles.length < nb_particles) {
            particles.push(newSideParticle());
        }
    }

    function updateParticles(step) {
        line_particles.length = 0;
        for (let i = particles.length - 1; i >= 0; --i) {
            const b = particles[i];
            b.x += b.vx * step;
            b.y += b.vy * step;

            if (isOutside(b)) {
                particles[i] = particles[particles.length - 1];
                particles.pop();
                continue;
            }

            /* TODO: better to make separate loop only if 'mouse_in'? */
            if (mouse_in) {
                /* TODO: optimise with kind of BSP tree? */
                const sqr_distance = getDistance(b, mouse_particle);
                if (sqr_distance < SQR_CONTACT_RADIUS) {
                    /* TODO: make separate function */
                    particles[i] = particles[particles.length - 1];
                    particles.pop();
                    if (!config.PARTICLES_RESPAWN) {
                        --nb_particles;
                    }
                    b.life = config.PARTICLE_LIFESPAN;
                    dead_particles.push(b);
                } else if (sqr_distance < SQR_FORCE_RADIUS) {
                    if (config.MOUSE_FORCE) {
                        const speed = ParticleSpeed(sqr_distance);
                        const deltaX = mouse_particle.x - b.x;
                        const deltaY = mouse_particle.y - b.y;
                        const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                        if (magnitude === 0) {
                            b.vx = 0;
                            b.vy = 0;
                        } else {
                            b.vx = config.MOUSE_FORCE * (deltaX / magnitude) * speed;
                            b.vy = config.MOUSE_FORCE * (deltaY / magnitude) * speed;
                        }
                    }
                    line_particles.push([b, sqr_distance]);
                }
            }

            b.phase += config.PARTICLE_PHASE;
            /* TODO: can avoid 'cos' (lookup table)? */
            b.alpha = Math.abs(Math.cos(b.phase));
        }

        /* TODO: make function? */
        for (let i = dead_particles.length - 1; i >= 0; --i) {
            const b = dead_particles[i];
            --b.life;
            if (b.life <= 0) {
                dead_particles[i] = dead_particles[dead_particles.length - 1];
                dead_particles.pop();
            }
        }
    }

    function drawParticles() {
        /* TODO: move elsewhere! */
        /* TODO: remove hardcoded '2' => get nb digits at init */
        counter.innerHTML = String(nb_particles).padStart(2, "0");

        // TODO: not needed?
        /*
        if (nb_particles + dead_particles.length === 0) {
            button.style.display = "block";
            return;
        }
        */

        particles.forEach((particle) => {
            canvas_context.fillStyle = `rgba(${PARTICLE_RGB_STR},${particle.alpha})`;
            canvas_context.beginPath();
            canvas_context.arc(particle.x, particle.y, config.PARTICLE_RADIUS, 0, PI_2, true);
            canvas_context.closePath();
            canvas_context.fill();
        });

        if (config.MOUSE_PARTICLE && mouse_in) {
            canvas_context.fillStyle = `rgba(${config.PARTICLE_COLOR.r},${config.PARTICLE_COLOR.g },${config.PARTICLE_COLOR.b},1)`;
            canvas_context.beginPath();
            canvas_context.arc(mouse_particle.x, mouse_particle.y, config.PARTICLE_RADIUS * 2, 0, PI_2, true);
            canvas_context.closePath();
            canvas_context.fill();
        }

        dead_particles.forEach((dead_particle) => {
            const alpha = dead_particle.life / config.PARTICLE_LIFESPAN;
            const dColor = config.DEAD_PARTICLE_COLOR;
            canvas_context.fillStyle = `rgba(${dColor.r},${dColor.g},${dColor.b},${alpha})`;
            canvas_context.beginPath();
            canvas_context.arc(dead_particle.x, dead_particle.y, config.PARTICLE_RADIUS + (config.PARTICLE_LIFESPAN - dead_particle.life), 0, PI_2);
            canvas_context.closePath();
            canvas_context.fill();
        });
    }

    function drawLines() {
        if (!config.DRAW_LINES || !mouse_in || !line_particles.length)
            return;

        canvas_context.lineWidth = config.LINE_WIDTH;
        for (let i = 0; i < line_particles.length; i++) {
            const line_particle = line_particles[i];
            const b = line_particle[0];
            const distance = line_particle[1];
            const alpha = 1 - (distance / SQR_FORCE_RADIUS);
            canvas_context.strokeStyle = `rgba(150,150,150,${alpha})`;
            //canvas_context.lineWidth = LINE_WIDTH;
            canvas_context.beginPath();
            canvas_context.moveTo(b.x, b.y);
            canvas_context.lineTo(mouse_particle.x, mouse_particle.y);
            canvas_context.stroke();
            canvas_context.closePath();
        }
    }

    ////////////////
    // TODO: make small classes
    // TODO: keep both FPS counters?
    // display FPS
    // TODO: rename
    const displayFPS_div = document.getElementById("display_fps");
    let lastDisplay = Date.now();
    let displayFPS = 0;

    function updateDisplayFPS() {
        const now = Date.now();
        displayFPS = Math.round(1000 / (now - lastDisplay));
        lastDisplay = now;
    }

    // logic FPS
    // TODO: rename
    const logicFPS_div = document.getElementById("logic_fps");
    let lastLogic = Date.now();
    let logicFPS = 0;

    function updateLogicFPS() {
        const now = Date.now();
        logicFPS = Math.round(1000 / (now - lastLogic));
        lastLogic = now;
    }

    function showFPS() {
        displayFPS_div.innerHTML = displayFPS;
        logicFPS_div.innerHTML = logicFPS;
    }
    ////////////////

    function updateLogic(step) {
        addParticles();
        updateParticles(step);

        // TODO: make optional
        updateLogicFPS();
    }

    function render() {
        canvas_context.clearRect(0, 0, canvas_width, canvas_height);

        drawParticles();
        drawLines();

        // TODO: make optional
        updateDisplayFPS();
        showFPS();
    }

    function processLoop(timestamp) {
        const deltaTime = timestamp - lastUpdateTime;
        lastUpdateTime = timestamp;
        accumulatedTime += deltaTime;

        while (accumulatedTime >= TIME_STEP) {
            updateLogic(TIME_STEP_SECONDS);
            accumulatedTime -= TIME_STEP;
        }

        // TODO: should use interpolation for smooth display
        //const interpolation = accumulatedTime / TIME_STEP;
        render();

        if (nb_particles + dead_particles.length > 0) {
            frameId = requestAnimationFrame(processLoop);
        } else {
            button.style.display = "block";
        }
    }

    function updateCanvas() {
        const width = container.clientWidth;
        canvas.setAttribute("width", width);
        canvas_width = width;
        outside_right = canvas_width + config.PARTICLE_RADIUS;

        const height = container.clientHeight;
        canvas.setAttribute("height", height);
        canvas_height = height;
        outside_top = canvas_height + config.PARTICLE_RADIUS;
    }

    function initParticles(nb) {
        particles.length = 0;
        nb_particles = nb;
        for (let i = 0; i < nb; i++) {
            // if want to spawn off screen to force random repositioning around canvas borders
            //particles.push(newParticle(-100, -100));
            particles.push(newParticle(undefined, undefined));
        }
    }

    function initElements() {
        // TODO: not needed?
        //counter.innerHTML = String(nb_particles).padStart(2, "0");
        button.style.display = "none";
    }

    function start() {
        updateCanvas();
        initParticles(config.PARTICLE_COUNT);
        initElements();

        frameId = requestAnimationFrame(processLoop);
    }

    // event Handlers
    const handleResize = () => updateCanvas();
    const handleMouseEnter = () => { mouse_in = true; };
    const handleMouseLeave = () => { mouse_in = false; };
    const handleMouseMove = (e) => {
        // TODO: not needed? (and use 'event' const in following instructions)
        //const event = e || window.event;
        mouse_particle.x = e.pageX;
        mouse_particle.y = e.pageY;
    };

    // listeners
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("mousemove", handleMouseMove);
    button.onclick = start;

    syncDerivedValues();

    // initializations
    let canvas_width = 0;
    let canvas_height = 0;
    let outside_right = 0;
    let outside_top = 0;
    let nb_particles = 0;
    const particles = [];
    const dead_particles = [];
    let line_particles = [];
    let mouse_in = false;
    let mouse_particle = { x: -config.FORCE_RADIUS, y: -config.FORCE_RADIUS };
    let lastUpdateTime = 0;
    let accumulatedTime = 0;
    let frameId;

    // function React GUI will call
    const updateParams = (newParams) => {
        const prevCount = config.PARTICLE_COUNT;

        // merge new parameters into existing config
        config = { ...config, ...newParams };

        if (config.PARTICLE_COUNT !== prevCount) {
            initParticles(config.PARTICLE_COUNT);
        }

        syncDerivedValues();

        outside_right = canvas_width + config.PARTICLE_RADIUS;
        outside_top = canvas_height + config.PARTICLE_RADIUS;
    };

    start();

    return {
        updateParams,
        cleanup: () => {
            cancelAnimationFrame(frameId);

            window.removeEventListener("resize", handleResize);
            canvas.removeEventListener("mouseenter", handleMouseEnter);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
            canvas.removeEventListener("mousemove", handleMouseMove);
            button.onclick = null;
        }
    };
}
