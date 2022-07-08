'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
function $Promise (executor) {
    this._state = 'pending';
    this._handlerGroups = [];

    if(typeof executor !== 'function') throw new TypeError('executor function');

    executor((data) => this._internalResolve(data), (data) => this._internalReject(data))

}

$Promise.prototype._internalResolve = function (data) {
    if (this._state === 'pending') {
        this._state = 'fulfilled';
        this._value = data;
        this._callHandlers();
    }
}

$Promise.prototype._internalReject = function (hola) {
    if(this._state === 'pending') {
        this._state = 'rejected';
        this._value = hola;
        this._callHandlers();
    }
}; 


$Promise.prototype.then = function (successCb, errorCb) {
    if(typeof successCb !== 'function') successCb = false;
    if(typeof errorCb !== 'function') errorCb = false;

    const downstreamPromise = new $Promise (function(){});

    this._handlerGroups.push({successCb, errorCb, downstreamPromise});

    if (this._state !== 'pending') this._callHandlers();

    return downstreamPromise;

}

$Promise.prototype._callHandlers = function (){
    while (this._handlerGroups.length > 0) {
      
        let actual = this._handlerGroups.shift() // {success, error}

        if (this._state === 'fulfilled') {
            if(!actual.successCb) {
                actual.downstreamPromise._internalResolve(this._value);    // CUANDO ES NULL LA PROMESA SE RESUELVE A EL VALOR DE LA PROMESA ANTERIOR
            } else {
                try {
                    const result = actual.successCb(this._value)
                    if(result instanceof $Promise) { // CUANDO DEVUELVE UNA PROMESA DEPENDE DE SI ES RECHAZADA O RESUELTA EL VALOR DEL RESULT
                        result.then(value => actual.downstreamPromise._internalResolve(value), value => actual.downstreamPromise._internalReject(value))
                    } else { // si se re
                        actual.downstreamPromise._internalResolve(result)
                    }   
                    
                } catch (e) {
                    actual.downstreamPromise._internalReject(e)
                }
            }
        }
        else {
            if (this._state === 'rejected') {
                if(!actual.errorCb) {
                    actual.downstreamPromise._internalReject(this._value);
                } else {
                    try {
                        const result = actual.errorCb(this._value);
                        if (result instanceof $Promise) {
                            result.then(value => actual.downstreamPromise._internalResolve(value), value => actual.downstreamPromise._internalReject(value))
                        } else {
                            actual.downstreamPromise._internalResolve(result);
                        }
                    } catch (error) {
                        actual.downstreamPromise._internalReject(error);
                    }
                }
            }
        }
    }
}

$Promise.prototype.catch = function (errorCb) {    
    return this.then(null, errorCb)
}

 

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
