var AppEmber = Ember.Application.Create({
	LOG_TRANSITIONS: true
});

AppEmber.Router.map(function() {
  this.route('index');
})