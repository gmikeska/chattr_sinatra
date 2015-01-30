var x2js = new X2JS(); 
var client = {}
client.ui = {}
client.ui.windows = {}


client.ui.newWindow = function(name, title, content)
{
	var $window = $('<div>').attr('id', 'window-'+name).addClass('ui-window')
	$window.append($('<div>').attr('id','window-titlebar-'+name).addClass('window-titlebar ui-titlebar').text(title))
	$window.append($('<div>').attr('id','window-content-'+name).attr('class','window-content').append(content))
	//$('#window-content-'+name).css('min-height', '100px')
	$('#main').append($window)
	$("#window-"+name).draggable({handle: "#window-titlebar-"+name}).resizable({
	  maxHeight: $( window ).height()-30,
      maxWidth: $( window ).width() - 30,
      minHeight: 40,
      minWidth: 200,
      alsoResize: '#window-content-'+name
  })
	$('#window-content-'+name).resizable({
          disabled:true
    })
	//	$('#window-content-'+name).css('min-height', '100px')
	var $close = $('<button>').button({
      icons: {
        primary: "ui-icon-closethick"
      },
      text: false
    });
	$close.addClass('closeButton')
    //$close.width('22px').height('22px').css('float', 'right').css('padding-right', '10px')
    $close.click(function(x){
    	$window.hide('fade')
    })
    $('#window-titlebar-'+name).append($close)
	$('.ui-resizable-handle', '#window-content-'+name).remove()

    client.ui.windows[name] = $window
}
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

client.on('console.log', function(x){
	console.log("Message Recieved:"+x)
})

client.on('console.error', function(x){
	console.error("Server Error:"+x)

})

client.on('load.roster', function(x){
	client.roster = x2js.xml_str2json(x).iq.query.item
})
client.on('msg', function(x){
	msg = x2js.xml_str2json(x).message
	if(msg.body != undefined)
	console.log("IM from "+ msg._from+":"+msg.body)
})


sampletable = function()
{
	t = $('<table>')
	console.log(client.roster)
	$(client.roster, function(i,x){
		console.log(x)
		t.append($('<tr>').append($('<td>').text(x._jid)).css('border-bottom', '1px solid black'))
	})
	
	t.width('100%')
	client.ui.newWindow("testwindow2","Another", t)
}