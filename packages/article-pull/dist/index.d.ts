import { options } from './options';
type TOptions = typeof options;
export declare const run: (options: TOptions) => Promise<void>;
export declare const bin: () => Promise<void>;
export {};
