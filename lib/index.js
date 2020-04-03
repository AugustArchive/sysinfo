const { cpus, freemem, totalmem, loadavg } = require('os');
const { execSync } = require('child_process');
const { colors } = require('leeks.js');
const psList = require('ps-list');
const pkg = require('../package');
const { diskinfo } = require('@dropb/diskinfo');

/**
 * Function to emit an warning (mimck of `process.emitWarning`)
 * @param {string} message The message to emit an warning as
 */
function emitWarning(message) {
  const msg = colors.gray(message);
  process.stdout.write(`${colors.yellow(`(sysinfo:${process.pid})`)} Warning: ${msg}\n`);
}

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
  /**
   * The version of the library
   */
  version: pkg.version,

  /**
   * Constants from the library
   */
  Constants,

  /**
   * Gets the CPU count
   * @works Windows, Linux, MacOS
   */
  getCPUCount: () => cpus().length,

  /**
   * Gets the free allocated memory
   * @works Windows, Linux, MacOS
   */
  getFreeMemory: () => freemem(),

  /**
   * Gets the total allocated memory
   * @works Windows, Linux, MacOS
   */
  getTotalMemory: () => totalmem(),

  /**
   * Gets the CPU usage to a humanizable-like format
   * @works Windows, Linux, MacOS
   * @example
   * ```js
   * const usage = sys.getCpuUsage();
   * console.log(`${usage}%`); //> 35%
   * ```
   */
  getCPUUsage: () => ((process.memoryUsage().heapUsed / totalmem()) * 100).toFixed(2),

  /**
   * Gets the platform to a humanizable-like format
   * @works Windows, MacOS, Linux
   * @returns {'Linux' | 'Macintosh' | 'Windows' | 'Android' | 'SunOS' | 'Unix' | 'BSD' | 'Unknown'} The OS that the machine is running
   * 
   * - `Linux`: All Linux distributions
   * - `Macintosh`: MacOS
   * - `Windows`: Microsoft Windows
   * - `Android`: Any Android app that supports Node.js
   * - `Unknown`: The library cannot find the OS by `process.platform`
   */
  getPlatform() {
    //* credit: https://github.com/PassTheWessel/yorushika/blob/master/src/commands/Discord/Information/stats.js#L80-L90
    switch (process.platform) {
      case 'aix': return 'Unix';
      case 'sunos': return 'SunOS';
      case 'win32': return 'Windows';
      case 'linux': return 'Linux';
      case 'darwin': return 'Macintosh';
      case 'freebsd': return 'BSD';
      case 'openbsd': return 'BSD';
      case 'android': return 'Android';
      default: 'Unknown';
    }
  },

  /**
   * Shows information from the `free` command in any Unix-subsystem
   * 
   * Warnings: 
   * - Selecting type doesn't work on Windows
   * 
   * @works Windows, MacOS, Linux
   * @param {'bytes' | 'kilobytes' | 'megabytes' | 'gigabytes' | 'terabytes' | 'petabytes'} type The type to get information from
   * @returns The data that the `free` command fetched
   */
  async free(type) {
    if (!type) type = 'bytes';
    if (this.getPlatform() === 'Windows') {
      const info = await diskinfo('C:');
      return info.avail;
    }

    let _type = Constants.FreeFlags[type];
    if (!_type) {
      emitWarning(`Unknown type: ${colors.red(_type)}`);
      return this.free('megabytes');
    }

    const stdout = execSync(`free ${_type}`).toString();
    const lines = stdout.split('\n');
    const info = lines[1].replace(/[\s\n\r]+/g, ' ');
    const oop = info.split(' ');

    const total = parseFloat(oop[1]);
    const free = parseFloat(oop[3]);
    const buffers = parseFloat(oop[5]);
    const cached = parseFloat(oop[6]);
    return {
      total,
      free,
      buffers,
      cached,
      used: total - (free + buffers + cached)
    };
  },

  /**
   * Gets the average load time
   * 
   * Warnings:
   * - This function will use `1` if the values aren't `1`, `5`, `15` or undefined
   * 
   * @works Windows, MacOS, Linux
   * @param {number} time The number of time to get from
   * @returns The information the `loadavg` function got from
   */
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

  /**
   * Gets the CPU's first and last mode, the total and idle memory allocated
   * @works Windows, Linux, MacOS
   * @returns The information needed
   */
  getCPUInfo() {
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
      firstModel: _cpus[0].model,
      lastModel: _cpus[_cpus.length - 1].model,
      idle,
      total
    };
  },

  /**
   * Gets the file system information from the `df` command
   * 
   * @works Windows, Linux, MacOS
   * @returns The information fetched from the `df` command
   */
  async getFilesystemInfo() {
    if (this.getPlatform() === 'Windows') {
      const info = await diskinfo('C:');
      return info;
    }

    const stdout = execSync('df -HT .').toString();
    const oop = stdout.split('  '); // eslint-disable-line

    const mounted = oop[4].split('\n')[1];
    const type = oop[7];
    const size = oop[8];
    const used = oop[9].replace(' ', '');
    const avail = oop[10].replace(' ', '');
    const [usedPer, mountedOn] = oop[11].split(' ');

    return {
      mounted,
      type,
      size,
      used,
      avaliable: avail,
      usedPercentage: usedPer,
      mountedRoot: mountedOn.replace('\n', '')
    };
  },

  /**
   * Gets all of the processes running
   * 
   * @param {number} pid The number of processes to list
   * @works Windows, Linux, MacOS
   * @returns An array of all the processes that are sliced by the `pid` argument
   */
  async getProcesses(pid = 10) {
    if (this.getPlatform() === 'Windows') {
      const processes = await psList();
      return processes.slice(0, pid);
    }

    const stdout = execSync(`ps -eo pcpu,pmem,time,args | sort -k 1 -r | head -n ${pid}`).toString();
    const oop = stdout.split('\n');
    oop.shift();
    oop.pop();

    const processes = [];
    oop.forEach(res => {
      const item = res.replace(/[\s\n\r]+/g, ' ');
      const newItem = item.split(' ');
      const command = newItem.slice(4).join(' ');

      processes.push({
        command,
        time: newItem[3],
        cpu: `${newItem[1]}%`
      });
    });

    return processes;
  },

  /**
   * Gets information from the `uptime` command in Unix-subsystems
   * @works Linux, MacOS
   * @returns An object from the command
   */
  getUnixUptime() {
    if (this.getPlatform() === 'Windows') throw new Error('getUnixUptime requires to be on a Unix-subsystem');
    const stdout = execSync('uptime').toString();

    // Split it by a space and remove any new indent stuff
    const info = stdout.split(' ');

    const uptime = info[1];
    const users = parseInt(info[6]);
    const loads = [parseFloat(info[11].replace(',', '')), parseFloat(info[12].replace(',', ''), parseFloat(info[13].replace(',', '').replace('\n', '')))];
    
    return {
      uptime,
      users,
      loads
    };
  },

  /**
   * Gets information from `net statistics workstation` command
   * @works Windows
   * @returns An object of everything from that
   */
  getWindowsWorkstation() {
    const platform = this.getPlatform();
    if (!platform === 'Windows') throw new SyntaxError(`Must be running on Windows, currently running on ${platform}`);

    const stdout = execSync('net statistics workstation', { encoding: 'utf8' });
    const content = stdout.split('\n');

    const desktopName = content[0].split('\\');
    const since = content[3].split(' ');
    const bytesReceived = content[6];
    const serverMessageBlocks = content[7];
    const bytesTransmitted = content[8];
    const readOp = content[10];
    const writeOp = content[11];

    return {
      serverMessageBlocks: parseInt(serverMessageBlocks.split('        ')[1]), // eslint-disable-line
      bytesTransmitted: parseInt(bytesTransmitted.split('                            ')[1].replace(/\r/g, '')), // eslint-disable-line
      bytesReceived: parseInt(bytesReceived.split('                               ')[1].replace(/\r/g, '')), // eslint-disable-line
      desktopName: desktopName[2].replace(/\r/g, ''),
      writeOp: parseInt(writeOp.split('                             ')[1]), // eslint-disable-line
      readOp: parseInt(readOp.split('                             ')[1]), // eslint-disable-line
      since: `${since[2].replace('?', '').replace(/\?/g, '')} ${since[3]}${since[4].replace(/\r/g, '')}`
    };
  },

  /**
   * Gets the enabled services running in the background
   * @works Windows
   * @returns Array of all services avaliable
   */
  getWindowsServices() {
    const platform = this.getPlatform();
    if (!platform === 'Windows') throw new SyntaxError(`Must be running on Windows, currently running on ${platform}`);

    const stdout = execSync('net start', { encoding: 'utf8' });
    const content = stdout.split('\n');

    content.shift(); // Remove "These Windows services has started:"
    
    const services = content.filter(s => s !== '\r').map(s => s.replace('   ', '').replace(/\r/g, '')); // eslint-disable-line
    
    // Do this twice so we can remove empty whitespace and "Command has executed successfully"
    services.pop();
    services.pop();

    return services;
  },

  /**
   * Gets information on your motherboard in Windows
   * @works Windows
   * @returns Object of your motherboard information
   */
  getMotherboard() {
    const platform = this.getPlatform();
    if (!platform === 'Windows') throw new SyntaxError(`Must be running on Windows, currently running on ${platform}`);

    const stdout = execSync('wmic baseboard get product,Manufacturer,serialnumber', { encoding: 'utf8' });
    const content = stdout.split('\n');
    content.shift();
    content.pop();
    content.pop();

    const specs = content[0].split('  ');
    return {
      serialNumber: specs[5],
      manufacturer: specs[0],
      product: specs[4]
    };
  },

  /**
   * Gets the current user's username
   * @works Windows, Linux, MacOS
   * @returns Username 
   */
  getUsername() {
    if (this.getPlatform() === 'Windows') {
      const stdout = execSync('whoami', { encoding: 'utf8' });
      return stdout.split('\\')[1];
    }
    
    const stdout = execSync('id -un', { encoding: 'utf8' });
    return stdout;
  },

  /**
   * Gets the computer's name
   * @works Windows, Linux, MacOS
   * @returns Computer Name
   */
  getComputerName() {
    if (this.getPlatform() === 'Windows') {
      const stdout = execSync('whoami', { encoding: 'utf8' });
      return stdout.split('\\')[0];
    }
    
    const stdout = execSync('hostname', { encoding: 'utf8' });
    return stdout;
  }
};
