//same code?
var LoginWindow = Backbone.Model.extend({
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
}),

loginWindow = new LoginWindow({
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
    'click #login-btn': 'login'
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
    console.log('login clicked')
    $(e.currentTarget).prop('disabled', true)

    this.model.login();
  },
  hide: function(x)
  {
    this.$el.hide('fade')
  }
});

var FriendsWindow = Backbone.Model.extend({});

var friendsRoster = new FriendsWindow({
  friends: []
});

var ChatWindowModel = Backbone.Model.extend({});




// this is the friends roster view
var FriendsRosterView = Backbone.View.extend({
  tagName: 'div',
  initialize: function () {
    this.listenTo(this.model, 'change', this.render)
  },
  template: _.template('<% client.roster.forEach(function(friend) { %><p id=friend><%= friend._jid %></p><% }); %>'),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },
  events: {
    'change': 'updateModel',
    'click #friend': 'chatWindow'
  },
  updateModel: function(friendsList) {
    this.model.set('rosterObject', friendsList)
  },
  chatWindow: function(e) {
    friendChat = $(e.currentTarget).text().remove('@').remove('.')
    if(!$('#window-'+friendChat).length)
    {
        console.log(e.currentTarget);
        var chatModel = new ChatWindowModel()
        chatView = new ChatWindowView({model:chatModel});
        console.log("Friend Selected For Chat: " + friendChat);
        ui.newWindow(friendChat, "Direct Chat with: " + friendChat, chatView.el);
        chatView.render();
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
  template: _.template('<h1>Individual Chat Here</h1>'),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },
  events: {
    'change': 'updateModel'
  },
  updateModel: function(chatHistory) {
    this.model.set('chatObject', chatHistory)
  }
});

var loginView = new LoginView({model:loginWindow}),
friendsRosterView = new FriendsRosterView({model:friendsRoster}),


showLogin = function() {
    ui.newWindow("Login","Login", loginView.el)
    loginView.render()
    
}

$(document).ready(showLogin)

var sampleFriendRoster = function() {
  ui.newWindow("FriendList", "Friends", friendsRosterView.el)
  friendsRosterView.render()
}

var debug = function() {
  client.send({eventName:'login', username: 'chattrtest@blah.im', password:'rubytest123'});
}
// event handler for websocket method called presence

client.on('auth.error', function(x) {
      loginWindow.flashMessage(x);
    });
    client.on('load.roster', function(x) {
      console.log(x);
      $('#window-Login').hide('fade');
      sampleFriendRoster();
    });