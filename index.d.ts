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

    export const version: string;
    export const Constants: Constants;
    export function getPlatform(): 'Linux' | 'Macintosh' | 'Windows' | 'Android' | 'Unknown';
    export function getCpuCount(): number;
    export function getFreeMemory(): number;
    export function getTotalMemory(): number;
    export function free(type: FreeFlag): FreeInfo;
    export function getLoadAvg(time?: number): number;
    export function getCpuUsage(): number;
    export function getCpuInfo(): { total: number; idle: number; }
}