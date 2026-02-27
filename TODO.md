# TODO

## Simulation

- [ ] Add option to spawn particles from mouse cursor position
- [ ] Use pooling for particles
- [ ] Optimize `UpdateParticles` function (see comments)
- [ ] Rendering: use interpolation for smooth display (`interpolation = accumulatedTime / TIME_STEP`)
- [ ] FPS parameter seems ignored. To check.
- [ ] Fix "inifinity" FPS bug

## GUI

- [ ] Make mobile friendly (cursor not responding well, cannot drag panel, etc.)
- [ ] Input fields: only update simulation parameter value when finished editing (ENTER)
- [ ] Add throttle to color changes to avoid heavy updates.
- [ ] Show/hide FPS counters
- [ ] Show/hide particles counter
- [ ] Add toggle control to spawn particles from mouse cursor position
- [ ] Set controls on a single line (more compact)

## General

- [ ] Restructure project (less folders and rename files)
- [ ] Check/validate all CSS
    - [ ] Uniformize
    - [ ] Make global what can
    - [ ] Use CSS variables
