const { cpus, freemem, totalmem, loadavg } = require('os');
const { execSync } = require('child_process');
const { colors } = require('leeks.js');
const pkg = require('../package');

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
  getCpuCount: () => cpus().length,

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
  getCpuUsage: () => ((process.memoryUsage().heapUsed / totalmem()) * 100).toFixed(2),

  /**
   * Gets the platform to a humanizable-like format
   * @works Windows, MacOS, Linux
   * @returns {'Linux' | 'Macintosh' | 'Windows' | 'Android' | 'Unknown'} The OS that the machine is running
   * 
   * - `Linux`: All Linux distributions
   * - `Macintosh`: MacOS
   * - `Windows`: Microsoft Windows
   * - `Android`: Any android app that supports Node.js
   * - `Unknown`: The library cannot find the OS by `process.platform`
   */
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

  /**
   * Shows information from the `free` command in any Unix-subsystem
   * 
   * Warnings: 
   * - The `free` command will error on Microsoft Windows
   * - This function will emit an warning if you use anything from `Constants.FreeFlags`
   * 
   * @works Linux, MacOS
   * @param {'bytes' | 'kilobytes' | 'megabytes' | 'gigabytes' | 'terabytes' | 'petabytes'} type The type to get information from
   * @returns The data that the `free` command fetched
   */
  free(type) {
    if (!type) type = 'bytes';
    if (process.platform === 'win32') throw new Error('The "free" function requires a Unix-subsystem.');

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
      firstModel: _cpus[0].model,
      lastModel: _cpus[_cpus.length - 1].model,
      idle,
      total
    };
  },

  /**
   * Gets the file system information from the `df` command
   * 
   * Warnings:
   * - This function will throw a syntax error if used on a Windows system
   * 
   * @works Linux, MacOS
   * @returns The information fetched from the `df` command
   */
  getFilesystemInfo() {
    const os = this.getPlatform();
    if (os === 'Windows') throw new SyntaxError('Operating System is not a Unix-subsystem');

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
   * Warnings:
   * - This will not work in a Windows machine
   * 
   * @param {number} pid The number of processes to list
   * @works Linux, MacOS
   * @returns An array of all the processes running by the `pid` argument
   */
  getProcesses(pid = 10) {
    if (this.getPlatform() === 'Windows') throw new SyntaxError('The "getProcesses" function requires to be in a Unix-subsystem');

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
  }
};