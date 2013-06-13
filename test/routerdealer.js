var should      = require("should")
var waterfront  = require("../")

describe("router/dealer", function(){
  describe("messaging", function(){
    var port        = 9300
    var host        = "localhost"
    var connection  = waterfront.connect(port, host)

    before(function(done){
      waterfront.listen(port, host, function(){
        done()
      })
    })

    it("should be recieve messages", function(done){
      var req = connection.socket('req')
      var rep = connection.socket('rep')

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



  describe("connection", function(){
    it("should be able to send message before broker binds", function(done){
      var port        = 9400
      var host        = "localhost"
      var connection  = waterfront.connect(port, host)
      var req         = connection.socket('req')
      var rep         = connection.socket('rep')

      rep.on("message", function(msg, callback){
        msg.hello = msg.hello.toUpperCase()
        callback(msg)
      })

      req.send({ hello: "canada" }, function(msg){
        msg.hello.should.eql("CANADA")
        done()
      })

      waterfront.listen(port, host)
    })

    it("should be able to send request before client connects", function(done){
      var port        = 9410
      var host        = "localhost"
      var connection  = waterfront.connect(port, host)
      var req         = connection.socket('req')

      req.send({ hello: "brazil" }, function(msg){
        msg.hello.should.eql("BRAZIL")
        done()
      })

      waterfront.listen(port, host, function(){
        var rep = connection.socket('rep')
        rep.on("message", function(msg, callback){
          msg.hello = msg.hello.toUpperCase()
          callback(msg)
        })
      })

    })
  })

})
