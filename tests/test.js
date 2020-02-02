// Why not use Jest?
// Jest requires *everything* to match the same
// and this is a System Information library, so
// tests will fail if ran by a different machine
const { inspect } = require('util');
const sys = require('../lib');

console.log(`@augu/sysinfo version: ${sys.version}`);
console.log(`System OS: ${sys.getPlatform()}`);
console.log(`System CPU Count: ${sys.getCpuCount()}`);
console.log(`System Free Memory: ${sys.getFreeMemory()}`);
console.log(`System Total Memory: ${sys.getTotalMemory()}`);
console.log(`System CPU Usage: ${sys.getCpuUsage()}%`);
// it's intentional to emit a warning
console.log(`System Memory by Megabytes:\n${inspect(sys.free(sys.Constants.FreeFlags.megabytes))}`);
console.log(`System Memory by Gigabytes:\n${inspect(sys.free('gigabytes'))}\n`);
console.log(`System Load Average by 1: ${sys.getLoadAvg(1)}`);
console.log(`System Load Average by 5: ${sys.getLoadAvg(5)}`);
console.log(`System CPU Model (${sys.getCpuInfo().firstModel}...${sys.getCpuInfo().lastModel}):\n${inspect(sys.getCpuInfo())}\n`);
console.log(`System Filesystem:\n${inspect(sys.getFilesystemInfo())}\n`);
console.log(`System Proccess by 10:\n${inspect(sys.getProcesses(10))}\n`);
console.log(`Unix Uptime:\n${inspect(sys.getUnixUptime())}`);