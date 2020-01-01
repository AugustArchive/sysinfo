import sysinfo from './lib/index.js';

export const {
    Constants,
    version,
    getPlatform,
    getCpuCount,
    getFreeMemory,
    getCpuUsage,
    free,
    getLoadAvg,
    getCpuInfo
} = sysinfo;