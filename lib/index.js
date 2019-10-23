const { cpus, freemem, totalmem, loadavg } = require('os');
const { execSync } = require('child_process');
const pkg = require('../package');

module.exports = {
    version: pkg.version,
    getPlatform() {
        //* credit: https://github.com/PassTheWessel/yorushika/blob/master/src/commands/Discord/Information/stats.js#L80-L90
        switch (process.platform) {
            case 'aix': return 'Linux';
            case 'sunos': return 'Linux';
            case 'win32': return 'Windows';
            case 'linux': return 'Linux';
            case 'darwin': return 'Macintosh';
            case 'freebsd': return 'Linux';
            case 'openbsd': return 'Linux';
            case 'android': return 'Android';
            default: 'Unknown';
        }
    },
    getCpuCount: () => cpus().length,
    getFreeMemory: () => freemem() / (1024 * 1024),
    getTotalMemory: () => totalmem() / (1024 * 1024),
    getCpuUsage: () => ((process.memoryUsage().heapUsed / totalmem()) * 100).toFixed(2),
    free() {
        if (process.platform === 'win32') throw new Error('The "free" function requires a Unix-subsystem.');

        const stdout = execSync('free -m').toString();
        const lines  = stdout.split('\n');
        const info   = lines[1].replace(/[\s\n\r]+/g, ' ');
        const oop    = info.split(' ');

        const total   = parseFloat(oop[1]);
        const free    = parseFloat(oop[3]);
        const buffers = parseFloat(oop[5]);
        const cached  = parseFloat(oop[6]);
        return {
            total,
            free,
            buffers,
            cached,
            used: total - (free + buffers + cached)
        };
    },
    getLoadAvg(time) {
        if (time === undefined || (time !== 5 && time !== 15)) time = 1;

        const loads = loadavg();
        let total = 0;
        if (time === 1) total = loads[0];
        if (time === 5) total = load[1];
        if (time === 15) total = loads[2];

        return total;
    },
    getCpuInfo() {
        const _cpus = cpus();

        let user = 0;
        let nice = 0;
        let sys = 0;
        let idle = 0;
        let irq = 0;
        let total = 0;
        for (const cpu of _cpus) {
            user += cpu.times.user;
            nice += cpu.times.nice;
            sys += cpu.times.sys;
            irq += cpu.times.irq;
            idle += cpu.times.idle;
        }

        const _total = (user + nice + sys + idle + irq);
        return {
            idle,
            total: _total
        };
    }
};