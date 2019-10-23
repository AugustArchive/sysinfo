declare module '@augu/sysinfo' {
    interface FreeInfo {
        total: number;
        free: number;
        buffers: number;
        cached: number;
        used: number;
    }

    export const version: string;
    export function getPlatform(): 'Linux' | 'Macintosh' | 'Windows' | 'Android' | 'Unknown';
    export function getCpuCount(): number;
    export function getFreeMemory(): number;
    export function getTotalMemory(): number;
    export function free(): FreeInfo;
    export function getLoadAvg(time?: number): number;
    export function getCpuUsage(): number;
    export function getCpuInfo(): { total: number; idle: number; }
}