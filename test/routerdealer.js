var should      = require("should")
var waterfront  = require("../")
var port        = 9300
var host        = "localhost"
var connection  = waterfront.connect(port, host)

describe("router/dealer", function(){

  before(function(done){
    waterfront.listen(port, host, function(){
      done()
    })
  })

  it("should be recieve messages", function(done){
    var req    = connection.socket('req')
    var rep    = connection.socket('rep')

    rep.on("message", function(msg, callback){
      msg.hello = msg.hello.toUpperCase()
      callback(msg)
    })

    req.send({ hello: "world" }, function(msg){
      msg.hello.should.eql("WORLD")
      done()
    })
  })

})
