import {LeveledLogMethod} from 'winston';

// TODO(fks) 11-10-2016: Remove this once @types/winston has been updated
// (https://github.com/DefinitelyTyped/DefinitelyTyped/pull/12613)

declare module 'winston' {

    export interface TransportInstance {
        silent: boolean;
        raw: boolean;
        name: string;
        formatter?: Function;
        level?: string;
        handleExceptions: boolean;
        exceptionsLevel: string;
        humanReadableUnhandledException: boolean;
    }

    export interface ConsoleTransportInstance {
        json: boolean;
        colorize: boolean;
        prettyPrint: boolean;
        timestamp: boolean;
        showLevel: boolean;
        label: string|null;
        logstash: boolean;
        depth: string|null;
        align: boolean;
        stderrLevels: {[key: string]: LeveledLogMethod;}
        eol: string;
        stringify?: (obj: Object) => string;
    }

}