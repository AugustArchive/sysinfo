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
        child.exec('free -m', (error, stdout, stderr) => {
            if (error) cb(stderr, null);
            let lines = stdout.split('\n');
            const memory = lines[1].replace(/[\s\n\r]+/g, ' ');
            const info = memory.split(' ');
            const total = parseFloat(info[1]);
            const free = parseFloat(info[3]);
            const buffers = parseFloat(info[5]);
            const cached = parseFloat(info[6]);
            
            const used = total - (free + buffers + cached);
            cb(null, { total, free, buffers, cached, used });
        });
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