var should      = require("should")
var waterfront  = require("../")
var port        = 9100
var host        = "localhost"
var connection  = waterfront.connect(port, host)

describe("pubsub", function(){

  before(function(done){
    waterfront.listen(port, host, function(){
      done()
    })
  })

  it("should be recieve messages", function(done){
    var pub   = connection.socket('pub')
    var sub   = connection.socket('sub')
    var count = 0

    var poll = setInterval(function(){
      pub.send("message", { "location": "vancouver" })
    }, 1)

    sub.on("message", function(){
      count ++
      if(count == 100){
        clearInterval(poll)
        done()
      }
    })

  })

})