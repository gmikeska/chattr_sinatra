
var client = {}
client.handlers = {}
client.connected = false
client.connect = function()
{
	socket = new WebSocket("ws://localhost:4567")
	this.socket = socket
	client = this
	this.socket.onmessage = function (event) {
  		obj = JSON.parse(event.data)
  		command = obj.command
  		delete obj['command']
  		client.trigger(command, obj)
	}
	socket.onopen = function (event) {
 		client.connected = true

	};
}

client.send = function(object)
{
	
	this.socket.send(JSON.stringify(object))
}

client.on = function(eventname, f)
{	
	this.handlers[eventname] = f
}

client.trigger = function(fkey, arg)
{
	arg = Object.keys(arg).map(function(x){
		return arg[x]
	})
	client.handlers[fkey].apply(client.socket, arg)
}


client.connect()

client.on('recieve', function(x){
	console.log("Message Recieved:"+x)
})

client.on('error', function(x){
	console.error("Server Error:"+x)

})



