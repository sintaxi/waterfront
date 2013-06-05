
/**
 * Addr
 *
 *  eg...
 *
 *      addr(4100, "localhost") => tcp://localhost:4100
 *
 */

exports.addr = function(port, host){
  if(host == "localhost") host = "127.0.0.1"

  return "tcp://" + host + ":" + port
}


/**
 * Builds a list of ports based on port passed in.
 *
 *  eg...
 *
 *      genPortList(4100) => [4101, 4102, 4103, 4104, 4105, 4106, 4107, 4108]
 *
 */

exports.buildPortList = function(port){
  if(!port) port = 4100
  port = parseInt(port)

  return [
    port + 1,
    port + 2,
    port + 3,
    port + 4,
    port + 5,
    port + 6,
    port + 7,
    port + 8
  ]
}


/**
 * Builds a port map for all the socket types
 *
 *  eg...
 *
 *      genPortMap([4101, 4102, 4103, 4104, 4105, 4106, 4107, 4108])
 *
 *        => {
 *          "push"        : 4101,
 *          "pull"        : 4102,
 *          "req"         : 4103,
 *          "rep"         : 4104,
 *          "pub"         : 4105,
 *          "sub"         : 4106,
 *          "pub-emitter" : 4107,
 *          "sub-emitter" : 4108
 *        }
 *
 */

exports.buildPortMap = function(ports){
  return {
    "push"        : ports[0],
    "pull"        : ports[1],
    "req"         : ports[2],
    "rep"         : ports[3],
    "pub"         : ports[4],
    "sub"         : ports[5],
    "pub-emitter" : ports[6],
    "sub-emitter" : ports[7]
  }
}