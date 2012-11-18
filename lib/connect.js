var axon = require("axon")

module.exports = function(domain){

  var ports = [4101, 4102, 4103, 4104, 4105, 4106, 4107, 4108]

  if(!domain){
    domain = "localhost"
  }

  return {
    socket: function(type){
      var sock = axon.socket(type)
      var map = {
        "push": 0,
        "pull": 1,
        "req" : 2,
        "rep" : 3,
        "pub" : 4,
        "sub" : 5,
        "pub-emitter": 6,
        "sub-emitter": 7,
      }
      sock.connect("tcp://" + domain + ":" + ports[map[type]])

      if(["pub-emitter", "sub-emitter"].indexOf(type) === -1)
        sock.format('json')

      return sock
    }
  }
}
