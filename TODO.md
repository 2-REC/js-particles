# TODO

- [ ] Make mobile friendly! (cursor not responding well, cannot drag panel, etc.)

- [ ] Input fields: only update simulation parameter value when finished editing (ENTER)
- [ ] FPS parameter seems ignored. To check.
- [ ] Add throttle to color changes to avoid heavy updates.
- [ ] Show/hide FPS counters
- [ ] Show/hide particles counter
- [ ] Set controls on a single line (more compact)
- [ ] Use pooling for particles
- [ ] Restructure project (less folders and rename files)
- [ ] Check/validate all CSS
    - [ ] Uniformize
    - [ ] Make global what can
    - [ ] Use CSS variables
    - [ ] Reuse toggle control in bottom bar for "Live Updates"
- [ ] Rendering: use interpolation for smooth display (`interpolation = accumulatedTime / TIME_STEP`)
- [ ] Optimize `UpdateParticles` function (see comments)
- [ ] Fix "inifinity" FPS bug
