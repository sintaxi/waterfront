# waterfront

## description

A message broker system built on ZeroMQ with discovery patterns for
push/pull, req/rep, pub/sub.

## why waterfront?

Messaging libraries provide low level building blocks for designing messaging patterns.
Although fairly easy to build, all the ports to bind and connect to can be difficult
to keep track of when managing intermediaries in prodiction. Waterfront provides a simple robust messaging broker/client to make it easier to build distributed systems.

## usage

### listen([ports] [,host])

This method is for standing up a woterfront message broker. It is the
centralized component.

    var waterfront = require('waterfront').listen()

### connect(hostname)

    var waterfront = require('waterfront').connect()

### socket(type)

socket returns an axon socket based on the type that is passed in. possible
values for `type` are: push, pull, req, rep, pub, sub.

    var waterfront = require('waterfront').connect()
    var sock       = waterfront.socket("push")

## License

Copyright 2012 Brock Whitten (All rights reserved).

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

#### push socket

    var waterfront = require('waterfront').connect()
    var sock       = waterfront.socket('push')

    setInterval(function(){
      sock.send({ "date" : (+new Date) })
    }, 200)

#### pull socket

    var waterfront = require('waterfront').connect()
    var sock       = waterfront.socket('pull')

    sock.on('message', function(data){
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
      sock.send('message', { pub: +new Date })
    }, 200)

#### sub socket

    var waterfront = require('waterfront').connect()
    var sock       = waterfront.socket("sub")

    sock.on('message', function(msg){
      console.log(msg)
    })

## License

Copyright 2012 Chloi Inc. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

