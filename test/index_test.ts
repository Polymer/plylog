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

import * as winston from 'winston';
import * as stream from 'stream';
import {assert} from 'chai';
import * as sinon from 'sinon';
import * as logging from '../index';

suite('plylog', () => {

  suite('getLogger()', () => {

    test('creates an internal winston logger with the given logger when instantiated', () => {
      let logger = logging.getLogger('TEST_LOGGER');
      assert.instanceOf(logger['_logger'], stream.Stream);
    });

  });

  suite('setVerbose()', () => {

    test('sets the level of all future loggers to "debug"', () => {
      logging.setVerbose();
      assert.equal(logging.defaultConfig.level, 'debug');
      let logger = logging.getLogger('TEST_LOGGER');
      assert.equal(logger['_logger'].transports[0].level, 'debug');
    });

  });

  suite('setQuiet()', () => {

    test('sets the level of all future loggers to "error"', () => {
      logging.setQuiet();
      assert.equal(logging.defaultConfig.level, 'error');
      let logger = logging.getLogger('TEST_LOGGER');
      assert.equal(logger['_logger'].transports[0].level, 'error');
    });

  });

  suite('PolymerLogger instance', () => {

    test('changes its internal logger\'s level when level property is changed', () => {
      let logger = logging.getLogger('TEST_LOGGER');
      logger.level = 'info';
      assert.equal(logger['_logger'].transports[0].level, 'info');
      logger.level = 'debug';
      assert.equal(logger['_logger'].transports[0].level, 'debug');
     });

    test('reads its internal logger\'s level when the level property is read', () => {
      let logger = logging.getLogger('TEST_LOGGER');
      logger.level = 'silly';
      assert.equal(logger['_logger'].transports[0].level, 'silly');
      assert.equal(logger.level, 'silly');
     });

    test('loggers properly pass arguments to their internal logger\'s log methods when called', () => {
      let logger = logging.getLogger('TEST_LOGGER');
      let winstonSpy = sinon.spy(logger['_logger'], 'log');
      logger.debug('hello:debug');
      assert.isOk(winstonSpy.calledWith('debug', 'hello:debug'));
      logger.info('hello:info');
      assert.isOk(winstonSpy.calledWith('info', 'hello:info'));
      logger.warn('hello:warn');
      assert.isOk(winstonSpy.calledWith('warn', 'hello:warn'));
      logger.error('hello:error', {metadata: 'foobar'});
      assert.isOk(winstonSpy.calledWithMatch('error', 'hello:error', {metadata: 'foobar'}));
    });

  });

  suite('default transport factory', () => {
    let initialTransportFactory = undefined as any;
    setup(() => {
      initialTransportFactory = logging.defaultConfig.transportFactory;
    });
    teardown(() => {
      logging.defaultConfig.transportFactory = initialTransportFactory;
    });

    test('is used when instantiating a new logger', async () => {
      class InstanceTrackingTransport extends winston.transports.Stream {
        calls: number = 0;
        constructor(options: any) {
          super({ stream: process.stdout, ...options });
          InstanceTrackingTransport.instances.push(this);
          this.on('log', () => ++this.calls);
        }
        write(chunk: any, encoding?: string | ((error?: Error | null |undefined) => void), callback?: (error?: Error | null | undefined) => void): boolean {
          ++this.calls;
          if (typeof encoding === 'string') {
            super.write(chunk, encoding, callback);
          } else {
            super.write(chunk, encoding);
          }
          return true;
        }
        static instances: InstanceTrackingTransport[] = [];
      }

      logging.defaultConfig.transportFactory = (options) => {
        return new InstanceTrackingTransport(options);
      };
      
      assert.lengthOf(InstanceTrackingTransport.instances, 0);
      const trackedLogger = logging.getLogger('foo');
      assert.lengthOf(InstanceTrackingTransport.instances, 1);

      const instance = InstanceTrackingTransport.instances[0]!;
      assert.equal(instance.calls, 0);
      trackedLogger.warn('not logged anywhere, but does increment calls');
      assert.equal(instance.calls, 1);
    });

  });
});
