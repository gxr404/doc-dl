import * as TurndownService from 'turndown';
export interface IOptions {
    articleUrl: string;
    [key: string]: any;
}
declare const genPlugin: (options: IOptions) => TurndownService.Plugin;
export default genPlugin;
