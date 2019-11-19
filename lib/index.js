const { cpus, freemem, totalmem, loadavg } = require('os');
const { execSync } = require('child_process');
const pkg = require('../package');

const Constants = {
    FreeFlags: {
        bytes: '-b',
        kilobytes: '--kilo',
        megabytes: '--mega',
        gigabytes: '--giga',
        terabytes: '--tera',
        petabytes: '--petabytes'
    }
};

module.exports = {
    version: pkg.version,
    Constants,
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
    getFreeMemory: () => freemem(),
    getTotalMemory: () => totalmem(),
    getCpuUsage: () => ((process.memoryUsage().heapUsed / totalmem()) * 100).toFixed(2),
    free(type) {
        if (!type) type = 'bytes';
        if (process.platform === 'win32') throw new Error('The "free" function requires a Unix-subsystem.');

        const _type = Constants.FreeFlags[type];
        if (!_type) throw new Error(`Invalid type: "${_type}" (${Object.keys(Constants.FreeFlags).join(' | ')})`);

        const stdout = execSync(`free ${type || '-b'}`).toString();
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
        switch (time) {
            case 1: {
                total = loads[0];
            } break;
            case 5: {
                total = loads[1];
            } break;
            case 15: {
                total = loads[2];
            } break;
            default: { 
                total = loads[0];
            } break;
        }

        return total;
    },
    getCpuInfo() {
        const _cpus = cpus();

        let user = 0;
        let nice = 0;
        let sys = 0;
        let idle = 0;
        let irq = 0;
        for (const cpu of _cpus) {
            user += cpu.times.user;
            nice += cpu.times.nice;
            sys += cpu.times.sys;
            irq += cpu.times.irq;
            idle += cpu.times.idle;
        }

        const total = (user + nice + sys + idle + irq);
        return {
            idle,
            total
        };
    }
};