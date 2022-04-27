/* SPDX-FileCopyrightText: 2022 Contributors of Meeting Stopwatch */

/* SPDX-License-Identifier: MIT */

class Timestamp {
    seconds;

    constructor(seconds = 0) {
        this.seconds = Math.round(seconds);
    }

    get seconds() {
        return this.seconds;
    }

    set seconds(v) {
        this.seconds = v;
    }

    clone() {
        return new Timestamp(this.seconds)
    }

    toString() {
        let secs = this.seconds;
        let minutes = Math.floor(secs / 60);
        let hours = Math.floor(minutes / 60);

        secs %= 60;
        minutes %= 60;
        hours %= 60;

        let str = '';
        if (hours > 0) {
            str += hours.toString().padStart(2, '0') + ':';
        }
        str += minutes.toString().padStart(2, '0') + ':';
        str += secs.toString().padStart(2, '0');
        return str;
    }

    compare(o) {
        if (this.seconds < o.seconds) {
            return -1;
        }
        if (this.seconds > o.seconds) {
            return 1;
        }
        return 0;
    }

    increment() {
        this.seconds++;
    }
}

class Stopwatch {
    on_tick;
    timestamp = new Timestamp();
    interval = null;

    constructor(on_tick = null) {
        this.on_tick = on_tick
        this.start();
    }

    get timestamp() {
        return this.timestamp;
    }

    get running() {
        return this.interval != null;
    }

    reset() {
        this.timestamp.seconds = 0;
        // Restart the interval
        if (this.running) {
            this.pause();
            this.resume();
        }
        this.notify_cb();
    }

    start() {
        this.stop();
        this.reset();
        this.resume();
    }

    stop() {
        this.pause();
    }

    pause() {
        if (this.running) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    resume() {
        if (!this.running) {
            this.interval = setInterval(() => {
                this.timestamp.increment();
                this.notify_cb();
            }, 1000);
        }
    }

    notify_cb() {
        if (this.on_tick != null) {
            this.on_tick(this.timestamp);
        }
    }
}

class TimeList {
    times = [];
    on_update;

    constructor(on_update = null) {
        this.on_update = on_update;
    }

    get count() {
        return this.times.length;
    }

    push(timestamp) {
        this.times.push(timestamp);

        this.times = this.times.sort((a, b) => {
            return a.compare(b);
        });

        if (this.on_update != null) {
            this.on_update()
        }
    }

    mean() {
        let sum = 0;
        for (const ts of this.times) {
            sum += ts.seconds;
        }
        return new Timestamp(sum / this.times.length);
    }

    median() {
        const list = this.times;
        if (list.length === 0) {
            return NaN;
        }
        if (list.length === 1) {
            return list[0];
        }
        const center = (list.length / 2) - 1;
        if (list.length % 2 === 0) {
            const sum = list[center].seconds + list[center + 1].seconds;
            return new Timestamp(sum / 2);
        } else {
            return list[Math.ceil(center)];
        }
    }

    toString() {
        let str = '';
        for (let i = 0; i < this.times.length; i++) {
            str += this.times[i];
            if (i !== this.times.length - 1) {
                str += ', ';
            }
        }
        return str;
    }
}