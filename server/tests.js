const logger = require('./logger');


function sayHello(name) {
    logger.log('Hello ' + name + '!');
}

sayHello('Matt')