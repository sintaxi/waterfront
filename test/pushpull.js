var should      = require("should")
var waterfront  = require("../")
var port        = 9200
var host        = "localhost"
var connection  = waterfront.connect(port, host)

describe("push/pull", function(){

  before(function(done){
    waterfront.listen(port, host, function(err){
      done()
    })
  })

  it("should be recieve messages", function(done){
    var push1    = connection.socket('push')
    var push2    = connection.socket('push')
    var pull1    = connection.socket('pull')
    var pull2    = connection.socket('pull')
    var total    = 100
    var sent     = 0
    var recieved = 0

    for(var i=0; i < 50; i++){
      sent ++
      push1.send({ pusher: 1, sent: sent })
    }

    for(var i=0; i < 50; i++){
      sent ++
      push1.send({ pusher: 2, sent: sent })
    }

    var handler = function(){
      recieved ++
      if(recieved == total){
        done()
      }
    }

    pull1.on("message", handler)
    pull2.on("message", handler)

  })

})