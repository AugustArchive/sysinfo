const child = require('child_process');
const os = require('os');

module.exports = {
    version: require('../package').version,
    getPlatform: () => process.platform,
    getCpuCount: () => os.cpus().length,
    getFreeMemory: () => os.freemem() / (1024 * 1024),
    getTotalMemory: () => os.totalmem() / (1024 * 1024),
    free: (cb) => {
        if (process.platform === 'win32') throw new Error('The "free" function requires a Unix-subsystem.');
        const stdout = child.execSync('free -m').toString();
        let lines = stdout.split('\n');
        const info = lines[1].replace(/[\s\n\r]+/g, ' ');
        const oop = info.split(' ');

        const total = parseFloat(oop[1]);
        const free = parseFloat(oop[3]);
        const buffers = parseFloat(oop[5]);
        const cached = parseFloat(oop[6]);
        const used = total - (free + buffers + cached);
        cb({ total, free, buffers, cached, used });
    },
    getLoadAvg: (time) => {
        if (time === undefined || (time !== 5 && time !== 15)) time = 1;
        const loads = os.loadavg();
        let i = 0;
        if (time === 1) i = loads[0];
        if (time === 5) i = loads[1];
        if (time === 15) i = loads[2];

        return i;
    },
    getCpuUsage: () => {
        const stats = module.exports.getCpuInfo();
        let idle = stats.idle;
        let total = stats.total;
        /** @type {number} */
        let perc;

        setTimeout(() => {
            const stats2 = module.exports.getCpuInfo();
            let endTotal = stats2.total;
            let endIdle = stats2.idle;

            let totalIdle = endIdle - idle;
            let totalInfo = endTotal - total;
            perc = totalIdle / totalInfo;
        }, 1000);
        return perc;
    },
    getCpuInfo: () => {
        const cpus = os.cpus();

        let user = 0;
        let nice = 0;
        let sys = 0;
        let idle = 0;
        let irq = 0;
        let total = 0;
        for (const cpu of cpus) {
            user += cpu.times.user;
            nice += cpu.times.nice;
            sys += cpu.times.sys;
            irq += cpu.times.irq;
            idle += cpu.times.idle;
        }

        const uwu = (user + nice + sys + idle + irq);
        return {
            idle,
            total: uwu
        };
    }
};