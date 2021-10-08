import * as TurndownService from 'turndown';
import { IOptions } from '../index';
export default function (options: IOptions): (turndownService: TurndownService) => void;
