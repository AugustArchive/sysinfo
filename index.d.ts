declare module '@augu/sysinfo' {
  type FreeFlag = 'bytes' | 'kilobytes' | 'megabytes' | 'gigabytes' | 'terabytes' | 'petabytes';
  interface FreeInfo {
    total: number;
    free: number;
    buffers: number;
    cached: number;
    used: number;
  }

  interface Constants {
    FreeFlags: { 
      [x in FreeFlag]: string;
    }
  }

  interface FilesystemInfo {
    mounted: string;
    type: string;
    size: string;
    used: string;
    avaliable: string;
    usedPercentage: string;
    mountedRoot: string;
  }

  interface CPUInfo {
    firstModel: string;
    lastModel: string;
    total: number;
    idle: number;
  }

  interface Process {
    command: string;
    time: string;
    cpu: string;
  }

  interface WindowsProcess {
    name: string;
    ppid: number;
    pid: number;
  }

  interface UnixUptimeStats {
    uptime: string;
    users: number;
    loads: number[];
  }

  interface Workstation {
    serverMessageBlocks: number;
    bytesTransmitted: number;
    bytesReceived: number;
    desktopName: string;
    writeOp: number;
    readOp: number;
    since: string;
  }

  interface Motherboard {
    serialNumber: string;
    manufacturer: string;
    product: string;
  }

  /**
   * The version of the library
   */
  export const version: string;

  /**
   * Any Constants that is used in the library
   */
  export const Constants: Constants;

  /**
   * Gets the platform to a humanizable-like format
   * @works Windows, MacOS, Linux
   * @returns {'Linux' | 'Unix' | 'SunOS' | 'Macintosh' | 'Windows' | 'BSD' | 'Android' | 'Unknown'} The OS that the machine is running
   * 
   * - `Linux`: All Linux distributions
   * - `Macintosh`: MacOS
   * - `Windows`: Microsoft Windows
   * - `SunOS`: SunOS
   * - `Unix`: Other Unix distributions
   * - `BSD`: BSD family of distributions (FreeBSD and OpenBSD)
   * - `Android`: Any android app that supports Node.js
   * - `Unknown`: The library cannot find the OS by `process.platform`
   */
  export function getPlatform(): 'Linux' | 'Unix' | 'SunOS' | 'Macintosh' | 'Windows' | 'BSD' | 'Android' | 'Unknown';

  /**
   * Gets the CPU count
   * @works Windows, Linux, MacOS
   */
  export function getCPUCount(): number;

  /**
   * Gets the free allocated memory
   * @works Windows, Linux, MacOS
   */
  export function getFreeMemory(): number;

  /**
   * Gets the total allocated memory
   * @works Windows, Linux, MacOS
   */
  export function getTotalMemory(): number;

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
  export function free(type: FreeFlag): FreeInfo;

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
  export function getLoadAvg(time?: number): number;

  /**
   * Gets the CPU usage to a humanizable-like format
   * @works Windows, Linux, MacOS
   * @example
   * const usage = sys.getCPUUsage();
   * console.log(`${usage}%`); //> 35%
   */
  export function getCPUUsage(): number;

  /**
   * Gets the CPU's first and last mode, the total and idle memory allocated
   * @works Windows, Linux, MacOS
   * @returns The information needed
   */
  export function getCPUInfo(): CPUInfo;

  /**
   * Gets the file system information from the `df` command
   * 
   * Warnings:
   * - This function will throw a syntax error if used on a Windows system
   * 
   * @works Linux, MacOS
   * @returns The information fetched from the `df` command
   */
  export function getFilesystemInfo(): FilesystemInfo;

  /**
   * Gets all of the processes running
   * 
   * @param pid The number of processes to list
   * @works Windows, Linux, MacOS
   * @returns An array of all the processes running by the `pid` argument
   */
  export function getProcesses(pid?: number): (Process | WindowsProcess)[];
  
  /**
   * Gets information from the `uptime` command in Unix-subsystems
   * @works Linux, MacOS
   * @returns An object from the command
   */
  export function getUnixUptime(): UnixUptimeStats;

  /**
   * Gets information from `net statistics workstation` command
   * @works Windows
   * @returns An object of everything from that
   */
  export function getWindowsWorkstation(): Workstation;

  /**
   * Gets the enabled services running in the background
   * @works Windows
   * @returns Array of all services avaliable
   */
  export function getWindowsServices(): string[];
}
