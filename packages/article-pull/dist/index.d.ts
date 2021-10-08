import options from './options';
declare type TOptions = typeof options;
export declare const run: (options: TOptions) => Promise<void>;
export declare const bin: () => Promise<void>;
export {};
