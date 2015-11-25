var waterfront = require("../").connect()
var sock       = waterfront.socket("pub")

request.get("...", function(err, rsp, body){
  sock.send(err, rsp, body)
})





// setInterval(function(){
//   var data = { pub: +new Date }
//   console.log("pub:", data)
//   sock.send(data)
// }, 200)