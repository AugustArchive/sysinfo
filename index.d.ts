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
     * @returns {'Linux' | 'Macintosh' | 'Windows' | 'Android' | 'Unknown'} The OS that the machine is running
     * 
     * - `Linux`: All Linux distributions
     * - `Macintosh`: MacOS
     * - `Windows`: Microsoft Windows
     * - `Android`: Any android app that supports Node.js
     * - `Unknown`: The library cannot find the OS by `process.platform`
     */
    export function getPlatform(): 'Linux' | 'Macintosh' | 'Windows' | 'Android' | 'Unknown';

    /**
     * Gets the CPU count
     * @works Windows, Linux, MacOS
     */
    export function getCpuCount(): number;

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
     * ```js
     * const usage = sys.getCpuUsage();
     * console.log(`${usage}%`); //> 35%
     * ```
     */
    export function getCpuUsage(): number;

    /**
     * Gets the CPU's first and last mode, the total and idle memory allocated
     * @works Windows, Linux, MacOS
     * @returns The information needed
     */
    export function getCpuInfo(): CPUInfo;

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
     * Warnings:
     * - This will not work in a Windows machine
     * 
     * @param pid The number of processes to list
     * @works Linux, MacOS
     * @returns An array of all the processes running by the `pid` argument
     */
    export function getProcesses(pid?: number): Process[];
}