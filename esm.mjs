import sysinfo from './lib/index.js';

export const {
  version, 
  Constants, 
  getCpuCount, 
  getCpuInfo, 
  getCpuUsage, 
  getFilesystemInfo,
  getFreeMemory, 
  getLoadAvg, 
  getPlatform, 
  getProcesses, 
  getTotalMemory, 
  getUnixUptime, 
  free
} = sysinfo;