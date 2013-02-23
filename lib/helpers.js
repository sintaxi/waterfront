
/**
 * Generates a list of ports based on port passed in.
 * 
 *  eg...
 *
 *      genPortList(4100) => [4101, 4102, 4103, 4104, 4105, 4106, 4107, 4108]
 *
 */
 
exports.genPortList = function(port){
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