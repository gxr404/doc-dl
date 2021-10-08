import config from './config';
export declare const bin: () => Promise<void>;
declare type TConfig = Partial<typeof config>;
export declare const run: (data: string, customConfig: TConfig) => Promise<string>;
export {};
