/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
'use strict';
const winston_1 = require('winston');
class PolymerLogger {
    /**
     * Constructs a new instance of PolymerLogger. This creates a new internal
     * `winston` logger, which is what we use to handle most of our logging logic.
     */
    constructor(options) {
        options = options || {};
        this._transport = new (winston_1.transports.Console)({
            level: options.level || 'info',
            label: options.name || null,
            prettyPrint: true,
        });
        this._logger = new (winston_1.Logger)({ transports: [this._transport] });
        this._logger.cli();
    }
    /**
     * Read the instance's level from our internal logger.
     */
    get level() {
        return this._transport.level;
    }
    /**
     * Sets a new logger level on the internal winston logger. The level dictates
     * the minimum level severity that you will log to the console.
     */
    set level(newLevel) {
        this._transport.level = newLevel;
    }
    /**
     * Logs a message of any level. Used internally by the public logging methods.
     */
    _log(_level, _msg, ..._metadata) {
        this._logger.log.apply(this._logger, arguments);
    }
    /**
     * Logs an ERROR message, if the log level allows it. These should be used
     * to give the user information about a serious error that occurred. Usually
     * used right before the process exits.
     */
    error(_msg, ..._metadata) {
        return this._log.bind(this, 'error').apply(this, arguments);
    }
    /**
     * Logs a WARN message, if the log level allows it. These should be used
     * to give the user information about some unexpected issue that was
     * encountered. Usually the process is able to continue, but the user should
     * still be concerned and hopefully investigate further.
     */
    warn(_msg, ..._metadata) {
        return this._log.bind(this, 'warn').apply(this, arguments);
    }
    /**
     * Logs an INFO message, if the log level allows it. These should be used
     * to give the user generatl information about the process, including progress
     * updates and status messages.
     */
    info(_msg, ..._metadata) {
        return this._log.bind(this, 'info').apply(this, arguments);
    }
    /**
     * Logs a DEBUG message, if the log level allows it. These should be used
     * to give the user useful information for debugging purposes. These will
     * generally only be displayed when the user is are troubleshooting an
     * issue.
     */
    debug(_msg, ..._metadata) {
        return this._log.bind(this, 'debug').apply(this, arguments);
    }
}
module.exports = {
    level: 'info',
    /**
     * Set all future loggers created, across the application, to be verbose.
     */
    setVerbose: function () {
        this.level = 'debug';
    },
    /**
     * Set all future loggers created, across the application, to be quiet.
     */
    setQuiet: function () {
        this.level = 'error';
    },
    /**
     * Create a new logger with the given name label. It will inherit the global
     * level if one has been set within the application.
     */
    getLogger: function (name) {
        return new PolymerLogger({
            level: this.level,
            name: name,
        });
    },
};
