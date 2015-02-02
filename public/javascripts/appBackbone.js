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
var loginTemplateString = '<form>';
loginTemplateString += '<label>Username:</label>'
loginTemplateString += '<input type="text" name="username" value="<%= username %>"></input><br><br>'
loginTemplateString += '<label>Password:</label>'
loginTemplateString += '<input type="text" name="password" value="<%= password %>"></input><br><br>'
loginTemplateString += '<button class="btn btn-primary" id="login-btn"> LOGIN</button>'
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
    console.log(u);
    this.model.set('username', u);
    this.model.set('password', p);
    this.model.set('notification', '')
    // grabbing the value of text boxes with our login form
  },
  login: function(e) {
    e.preventDefault();
    this.model.login();
  },
  hide: function(x)
  {
    this.$el.hide('fade')
  }
});

var FriendWindow = Backbone.Model.extend({});

var friendsRoster = new FriendWindow({});



// this is the friends roster view
var FriendsRosterView = Backbone.View.extend({
  tagName: 'div',
  initialize: function () {
    this.listenTo(this.model, 'change', this.render)
  },
  template: _.template('<h1>Friends Go Here</h1>'),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },
  events: {
    'change': 'updateModel'
  },
  updateModel: function(friendsList) {
    this.model.set('rosterObject', friendsList)
  }
});

var loginView = new LoginView({model:loginWindow}),
friendsRosterView = new FriendsRosterView({model:friendsRoster});


var sampleLogin = function() {
    ui.newWindow("Login","Login", loginView.el)
    loginView.render()
    client.on('auth.error', function(x) {
      loginWindow.flashMessage(x);
    });
    client.on('load.roster', function(x) {
      console.log(x);
      $('#window-Login').hide('fade');
      sampleFriendRoster();
    });
};

var sampleFriendRoster = function() {
  ui.newWindow("FriendList", "Friends", friendsRosterView.el)
  friendsRosterView.render()
}