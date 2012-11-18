# waterfront

## description

A generic message broker system on top of `axon` with discovery patterns for
push/pull, req/rep, pub/sub, pub-emitter/sub-emitter.

## why waterfront?

Axon provides low level building blocks for designing messaging patterns.
Although easy to build, all the ports to bind and connect to can be difficult
to keep track of. Waterfront provides a simple robust messaging pattern with
detailt ports.

## usage

### listen([ports] [,host])

This method is for standing up a woterfront message broker. It is the
centralized component.

    var waterfront = require('waterfront').listen()

### connect([ports] [,host])

    var waterfront = require('waterfront').connect()

### socket(type)

socket returns an axon socket based on the type that is passed in. possible
values for `type` are: push, pull, req, rep, pub, sub, pub-emitter, sub-
emitter.

    var waterfront = require('waterfront').connect()
    var sock       = waterfront.socket("push")

#### push socket

    var waterfront = require('socket').connect()
    var sock       = waterfront.socket('push')

    setInterval(function(){
      sock.send({ "date" : (+new Date) })
    }, 200)

#### pull socket

    var waterfront = require('waterfront').connect()
    var sock       = waterfront.socket('pull')

    sock.on("message", function(data){
      console.log(data)
    })

#### req socket

    var waterfront = require('waterfront').connect()
    var sock       = waterfront.socket('req')

    sock.send({ req: +new Date }, function(rep){
      console.log(rep)
      process.exit()
    })

#### rep socket

    var waterfront = require('waterfront').connect()
    var sock       = waterfront.socket('rep')

    sock.on('message', function(data, callback){
      data.rep = +new Date
      callback(data)
    })

#### pub socket

    var waterfront = require('waterfront').connect()
    var sock       = waterfront.socket("pub")

    setInterval(function(){
      sock.send({ pub: +new Date })
    }, 200)

#### sub socket

    var waterfront = require('waterfront').connect()
    var sock       = waterfront.socket("sub")

    sock.on("message", function(msg){
      console.log(msg)
    })

#### pub-emitter socket

    var waterfront = require('waterfront').connect()
    var sock       = waterfront.socket('pub-emitter')

    setInterval(function(){
      sock.emit( "vancouver", { "date": (+new Date) })
    }, 500)

#### sub-emitter socket

    var waterfront = require('waterfront').connect()
    var sock       = waterfront.socket('sub-emitter')

    sock.on('*', function(channel, data){
      console.log(channel, data)
    })
