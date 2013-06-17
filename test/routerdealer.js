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

    // it("should be able to do rpc", function(done){
    //   var req = connection.socket('req')
    //   var rep = connection.socket('rep')

    //   rep.on("message", function(msg, callback){
    //     msg.hello = msg.hello.toUpperCase()
    //     callback(msg)
    //   })

    //   req.send({ hello: "world" }, function(msg){
    //     msg.hello.should.eql("WORLD")
    //     done()
    //   })
    // })

    it("should be able to exchange several requests", function(done){
      var req   = connection.socket('req')
      var rep   = connection.socket('rep')
      var count = 0
      var total = 50

      rep.on("message", function(msg, callback){
        msg.result = msg.num * 2
        callback(msg)
      })

      for(var i=0; i < 50; i++)(function(i){
        req.send({ num: i }, function(msg){
          msg.num.should.eql(i)
          msg.result.should.eql(i * 2)
          count ++
          if(count == total){
            done()
          }
        })
      })(i)

    })

  })



  describe("connection", function(){
    it("should not lose messages if broker is late binding", function(done){
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

      setTimeout(function(){
        waterfront.listen(port, host)
      }, 200)

    })

    it("should not lose messages if worker is late connecting", function(done){
      var port        = 9410
      var host        = "localhost"
      var connection  = waterfront.connect(port, host)
      var req         = connection.socket('req')

      req.send({ hello: "brazil" }, function(msg){
        msg.hello.should.eql("BRAZIL")
        done()
      })

      waterfront.listen(port, host, function(){
        setTimeout(function(){
          var rep = connection.socket('rep')
          rep.on("message", function(msg, callback){
            msg.hello = msg.hello.toUpperCase()
            callback(msg)
          })
        }, 200)
      })
    })

  })

})
