(function ($) {
      $.each(['show', 'hide'], function (i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function () {
          this.trigger(ev);
          return el.apply(this, arguments);
        };
      });
    })(jQuery);
//same code?
var x2js = new X2JS(); 
var client = {}
ui = {}
views = {}
models = {}
client.handlers = {}
ui.windows = {}


ui.newWindow = function(name, title, content)
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
	$("#window-"+name).css('left', $( window ).width()/2 - ($("#window-"+name).width()*2.5))
	$("#window-"+name).css('top', $( window ).height()/2 - ($("#window-"+name).height()*2))
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

    ui.windows[name] = $window

    $window.on('hide', function(x){
    	this.remove()	
    })
}
client.connected = false
client.connect = function()
{
	socket = new WebSocket("ws://localhost:4567")
	this.socket = socket
	client = this
	this.socket.onmessage = function (event) {
  		obj = JSON.parse(event.data)
  		eventName = obj.eventName
  		delete obj['eventName']
  		client.trigger(eventName, obj)
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
	if(!this.handlers[eventname])
		this.handlers[eventname] = []

	this.handlers[eventname].push(f)
}

client.trigger = function(fkey, arg)
{
	arg = Object.keys(arg).map(function(x){
		return arg[x]
	})
	if(this.handlers[fkey])
	{
		this.handlers[fkey].forEach(function(x){
			x.apply(client.socket, arg);
		})
	}
}


client.connect()

client.on('console.log', function(x){
	console.log("Message Recieved:"+x)
})

client.on('server.error', function(x){
	console.error("Server Error:"+x)

})

client.on('load.roster', function(x){
	client.roster = x2js.xml_str2json(x).iq.query.item
	console.log('Connected')
})
client.on('msg', function(x){
	msg = x2js.xml_str2json(x).message
	if(msg.body != undefined)
	console.log("IM from "+ msg._from+":"+msg.body)
})

models.TestModel = Backbone.Model.extend({
	addText:function(t){
		this.set('text', this.get('text')+t)
	}
})

mymodel = new models.TestModel({text:'yes'})


views.testView = Backbone.View.extend({
	tagName: "div",
	initialize: function() {
    this.listenTo(this.model, "change", this.render);
  	},
  	template: _.template('<div><%= text %></div>'),
  	render: function() {
    	this.$el.html(this.template(this.model.attributes))
    	return(this)
  }
})
myView = new views.testView({model:mymodel})
sampletable = function()
{

	ui.newWindow("testwindow2","Another", myView.el)

	myView.render()
}
