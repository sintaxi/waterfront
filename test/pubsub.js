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

  it("should be done", function(done){
    var pub = connection.socket('pub')
    var sub = connection.socket('sub')

    sub.on("message", function(){
      done()
    })

    setTimeout(function(){
      pub.send("message", { "location": "vancouver"})
    }, 25)

  })

})