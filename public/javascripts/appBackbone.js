var LoginWindow = Backbone.Model.extend({
	flashMessage: function(msg) {
		this.set('notification', msg)
    // flash a message to say your password is wrong and put into the view
    // other portions of this view will not need to be changed dynamically
	},
  login: function() {
    client.send({command:'login', username: this.get('username'), password: this.get('password')});
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
loginTemplateString += '<label>Username</label>'
loginTemplateString += '<input type="text" name="username" value="<%= username %>"></input><br><br>'
loginTemplateString += '<label>Password</label>'
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
    // grabbing the value of text boxes with our login form
  },
  login: function(e) {
    e.preventDefault();
    this.model.login();
  }
});

myView = new LoginView({model:loginWindow})

var sampletable = function() {
    client.ui.newWindow("testwindow2","Another", myView.el)
    myView.render()
};