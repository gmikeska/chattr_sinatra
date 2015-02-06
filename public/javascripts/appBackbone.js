//same code?
var LoginWindowModel = Backbone.Model.extend({
	flashMessage: function(msg) {
		this.set('notification', msg)
    this.set('username', '')
    this.set('password', '')
    // flash a message to say your password is wrong and put into the view
    // other portions of this view will not need to be changed dynamically
	},
  login: function() {
    client.send({eventName:'login', username: this.get('username'), password: this.get('password')});
  }
})

models.login = new LoginWindowModel({
  username: null,
  password: null,
  notification: null
  // to set notification null; in order to render the template, however, initially there are no problems
  // and thus, no messages to flash to the user about errors with login
});

// View for first model below
var loginTemplateString = '<center><img class="loginImage" src="/images/jabberlogo.png"></center>';
loginTemplateString += '<form>';
loginTemplateString += '<label>Username:</label>'
loginTemplateString += '<input type="text" name="username" value="<%= username %>"></input><br><br>'
loginTemplateString += '<label>Password:</label>'
loginTemplateString += '<input type="password" name="password" value="<%= password %>"></input><br><br>'
loginTemplateString += '<center><button class="btn btn-primary" id="login-btn"> LOGIN</button></center>'
loginTemplateString += '</form>'
loginTemplateString += '<p><%= notification %></p>'

var LoginView = Backbone.View.extend({
  tagName: 'div',
  initialize: function() {
    this.listenTo(this.model, 'change', this.render)
  },
  template: _.template(loginTemplateString),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },
  events: {
    'change': 'updateModel',
    'click #login-btn': 'login',
    'keypress' : 'keyPress'
  },
  updateModel: function(e) {
    var u = $("[name='username']", e.currentTarget).val(),
    p = $("[name='password']", e.currentTarget).val();
    this.model.set('username', u);
    this.model.set('password', p);
    this.model.set('notification', '')
    // grabbing the value of text boxes with our login form
  },
  login: function(e) {
    e.preventDefault();
    $('#window-Login').css('opacity', '.1')
    $(e.currentTarget).prop('disabled', true)
    $.magnificPopup.open({
      items: {
        src: $('#loading'),
        type: 'inline'
      },
      modal:true
    });
    $('#loading').slideDown()
    this.model.login();
  },
  hide: function(x)
  {
    this.$el.hide('fade')
  },
  keyPress: function(x)
  {
    if(x.keyCode == 13)
    {
      x.preventDefault()
      this.model.set($(':focus').attr('name'), $(':focus').val())
      $('#login-btn').click()
    }
  }
});

var FriendsWindowModel = Backbone.Model.extend({});

models.roster = new FriendsWindowModel({
  friends: {}
});

var ChatWindowModel = Backbone.Model.extend({
  chat:function(name,text)
  {
    chats = this.get('chats')
    chats.push("<b>"+name+"</b>:"+text)
    console.log(name+":"+text)
    this.set('chats', chats)
  }
});

// this is the friends roster view
var FriendsWindowView = Backbone.View.extend({
  tagName: 'div',
  initialize: function () {
    this.listenTo(this.model, 'change', this.render)
  },
  template: _.template('<% Object.keys(this.model.get("friends")).forEach(function(friend) { %><p id="entry-<%= friend.remove("@").remove(".") %>" class="rosterEntry"><%= friend%><% if (models.roster.get("friends")[friend] === "available") { %><img class="status" src="../images/available.png"><% } else if(models.roster.get("friends")[friend] === "subscribe"){%><img class="status" src="../images/subscribe.svg"><% } else { %><img class="status" src="../images/offline.png"><% } %></p><% }); %><button id="addBuddy" class="glyphicon glyphicon-plus btn btn-success stackbutton">ADD A BUDDY</button>'),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },
  events: {
    'change': 'updateModel',
    'click .rosterEntry': 'chatWindow',
    'click #addBuddy' : 'addBuddy'
  },
  updateModel: function(friendsList) {
    this.model.set('friends', friendsList)
  },
  chatWindow: function(e) {
    friendChat = $(e.currentTarget).text().remove('@').remove('.')
    if(!$('#window-'+friendChat).length)
    {
        console.log(e.currentTarget);
        var chatModel = new ChatWindowModel({
          chats: [],
          mystatus:"",
          typed:"",
          status:"",
          friend:$(e.currentTarget).text()
        })
        views.im[friendChat] = new ChatWindowView({model:chatModel});
        console.log("Friend Selected For Chat: " + $(e.currentTarget).text());
        ui.newWindow(friendChat, $(e.currentTarget).text(), views.im[friendChat].el);
        views.im[friendChat].render();
    }
    else
    {
      $('.ui-window').not('#window-'+friendChat).css('z-index', '100');
      $('#window-'+friendChat).css('z-index', '1000');
    }
  },
  addBuddy: function(e)
  {
    buddyForm()
  }
});

var ChatWindowView = Backbone.View.extend({
  tagName: 'div',
  initialize: function () {
    this.listenTo(this.model, 'change', this.render)
  },
  template: _.template('<div class="chatwindow"><%= chats.join("<br>") %></div><p class="chatstatus"><%= status %></p><div><textarea><%= typed %></textarea><br><br><button style="margin-bottom:12px;" class="btn btn-primary button">SUBMIT</button></div>'),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },
  events: {
    'change': 'updateModel',
    'input' : 'typingNotice',
    'click .button': 'send'
  },
  updateModel:function(e){
    
  },
  send: function(e) {
    audio.send()
    this.model.chat(models.login.get('username'), $('textarea', this.el).val())
    client.send({eventName:'msg',user:this.model.get('friend'), message:$('textarea', this.el).val()})
    this.render()
  },
  typingNotice: function(e)
  {
    content = $('textarea', e.currentTarget).val()
    isEmpty = (content == '')
    if(!isEmpty && this.mystatus != 'typing')
    {
      
      this.mystatus = 'typing'
      //this.model.set('typed', content) 
      client.send({eventName:'chat_typing', user:this.model.get('friend')});
    }
    else if(isEmpty && this.mystatus == 'typing')
    {
      this.mystatus = 'empty'
      //this.model.set('typed', content)  
      console.log('empty')
      client.send({eventName:'chat_empty', user:this.model.get('friend')});
    }

    $('textarea', e.currentTarget).focus()
  },
  status: function(x)
  {
    this.model.set('status', x)
    this.render()
  }
});

views.login = new LoginView({model:models.login}),
views.roster = new FriendsWindowView({model:models.roster}),


showLogin = function() {
    ui.newWindow("Login","Login", views.login.el)
    views.login.render()
    
}

$(document).ready(showLogin)

var loadRoster = function() {
  ui.newWindow("FriendList", "Friends", views.roster.el)
  views.roster.render()
}

var buddyForm = function()
{
  els = [$('<label>').text('Buddy Username'),
  $('<br>'),
  $('<input>'),
  $('<br>')
  ]
  els = $('<center>').append(els)
  
  $form = [$('<form>').append(els), $('<button>').addClass('btn btn-primary stackbutton').text('ADD').click(function(x){
    client.send({eventName:'add', name:$('input',$(x.currentTarget).parent()).val()})
    
  })]
  ui.newWindow("add", "Add a Buddy", $form)
}


var debug = function() {
  client.send({eventName:'login', username: 'chattrtest@blah.im', password:'rubytest123'});
}
// event handler for websocket method called presence

client.on('auth.error', function(x) {
    $('#window-Login').css('opacity', '1')
    $.magnificPopup.close()
      models.login.flashMessage(x);
});

client.on('load.roster', function(x) {
  $('#window-Login').hide('fade');
  $.magnificPopup.close()
  loadRoster();
});

client.on('subscribe', function(x){
  console.log(x)
})


client.on('presence', function (x){

  
  var currentUser = models.login.get('username')
  //console.log(currentUser)

  //client.presence = x2js.xml_str2json(x).presence._from.split('/');
  var data = x2js.xml_str2json(x)
  //console.log(data)
  var presence = data.presence
  var type = data.presence._type
  console.log(type)
  if(type != 'subscribe')
  {
    var username = presence._from
    var status = presence._type

    if(!status)
      status = 'available'

    if(status == 'available')
      audio.login()
    if(status == 'unavailable')
      audio.logout()
    if(username.indexOf('/') != -1)
      username = username.split('/')[0]
    console.log(username+":"+status)

    friends = models.roster.get('friends')
    if (currentUser != username) {
      friends[username] = status
      models.roster.set('friends', friends)
    }
    views.roster.render()
  }
  else
  {
    //console.log('SUBSCRIBE')
    //console.log(presence._from+' requests add.')
    request = $('<div>').append(presence._from+" is requesting to add you to their friend list.")
    request.append('<br>')

    var buttons = [$('<button>').css('margin-right','4px').attr('id','accept-'+presence._from.remove('@').remove('.')).addClass('btn btn-success').text('ACCEPT'), $('<button>').css('margin-right','4px').attr('id','accept-add-'+presence._from.remove('@').remove('.')).addClass('btn btn-success').text('ACCEPT & ADD'), $('<button>').attr('id','decline-'+presence._from.remove('@').remove('.')).addClass('btn btn-danger').text('DECLINE')]
    request.append($('<center>').css('margin-top','2px').append(buttons))
    var $window =ui.newWindow(presence._from.remove('@').remove('.'), 'Friend Request',request)
    audio.request()
    //console.log($('button', DEBUG))
    $($window).ready(function(){

      if(Object.keys(models.roster.get('friends')).indexOf( presence._from) != -1)
      {
        console.log($('button', $window)[2])
        $($('button', $window)[2]).attr('disabled', true)
      }
      console.log($('button', $window))

      $($('button', $window)[2]).click(function(){
        friends = models.roster.get('friends')
        //friends[presence._from] = 'unavailable'
        models.roster.set('friends', friends)
        views.roster.render()
        client.send({eventName:'accept_add', name:presence._from})
        $($window).hide()

      })

      $($('button', $window)[1]).click(function(){
        console.log('accept')
        views.roster.render()
        client.send({eventName:'accept', name:presence._from})
        $($window).hide()

      })

      $($('button', $window)[3]).click(function(){
        console.log('decline!')
        client.send({eventName:'decline', name:presence._from})
        $($window).hide()
      })


    })
  }
})

client.on('server.error', function(x){
  console.error("Server Error:"+x)

})

client.on('console.log', function(x){
  console.log("Message Recieved:"+x)
})


client.on('load.roster', function(x){
  client.roster = x2js.xml_str2json(x).iq.query.item
  // models.roster.friends = client.roster


  $('.titlebar').append($('<button>').addClass('btn btn-danger').text('LOGOUT').css('float','right').attr('id','logout'))

  $('#logout').click(function(){ 
      location.reload();
  })
})
client.on('msg', function(x){

  msg = x2js.xml_str2json(x).message
  if(msg._from.indexOf('/'))
        from = msg._from.split('/')[0]
      else
        from = msg._from
  if(from != models.login.get('username'))
  {

    
    views.im[from.remove('.').remove('@')].model.set('typed',$('textarea', views.im[from.remove('.').remove('@')].el).val())
    if(msg.body != undefined)
    {
      if(!views.im[from.remove('.').remove('@')])
        $('#entry-'+from.remove('.').remove('@')).click()
      views.im[from.remove('.').remove('@')].model.chat(from, msg.body)
      views.im[from.remove('.').remove('@')].render()


    }
    else
    {
      from = msg._from.split('/')[0]
      console.log(msg)
      if(msg.active)
        newStatus = ""
      if(msg.composing)
        newStatus = from.split('@')[0] +" is typing."
      if(msg.paused)
        newStatus = from.split('@')[0] +" has entered text."

      if(views.im[from.remove('.').remove('@')])
      {
        views.im[from.remove('.').remove('@')].status(newStatus)
      }
    }
  }
})