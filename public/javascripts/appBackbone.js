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
    console.log('sending login info')
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
      //console.log($(':focus').attr('name'))
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
  template: _.template('<% Object.keys(this.model.get("friends")).forEach(function(friend) { %><p class="rosterEntry"><%= friend%><% if (models.roster.get("friends")[friend] === "available") { %><img class="status" src="../images/available.png"><% } else { %><img class="status" src="../images/offline.png"><% } %></p><% }); %>'),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },
  events: {
    'change': 'updateModel',
    'click .rosterEntry': 'chatWindow'
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
          friend:$(e.currentTarget).text()
        })
        views.im = {}
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
  }
});

var ChatWindowView = Backbone.View.extend({
  tagName: 'div',
  initialize: function () {
    this.listenTo(this.model, 'change', this.render)
  },
  template: _.template('<div class="chatwindow"><%= chats.join("<br>") %></div><br><div><textarea></textarea><br><br><button style="margin-bottom:12px;" class="btn btn-primary button">SUBMIT</button></div>'),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },
  events: {
    'change': 'updateModel',
    'click .button': 'send'
  },
  send: function(e) {
    audio.send()
    console.log(e)
    this.model.chat(models.login.get('username'), $('textarea', this.el).val())
    console.log(this.model.get('friend'))
    client.send({eventName:'msg',user:this.model.get('friend'), message:$('textarea', this.el).val()})
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

var sampleFriendRoster = function() {
  ui.newWindow("FriendList", "Friends", views.roster.el)
  views.roster.render()
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
  console.log(x);
  $('#window-Login').hide('fade');
  $.magnificPopup.close()
  sampleFriendRoster();
});
