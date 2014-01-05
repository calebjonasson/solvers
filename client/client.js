var projectsHandle = Meteor.subscribe('projects');
Meteor.subscribe('comments');
Meteor.subscribe('tags');

Meteor.autosubscribe(function() {
	Meteor.subscribe("userData");
});

Template.header.rendered = function() {
	$('a[rel=tooltip]').tooltip() //initialize all tooltips in this template
	// initialise search typeahead
	var listOfTags = Meteor.tags.find().map(function (tag) {return tag.name});
	$(this.find('input')).typeahead({
		source: listOfTags,
		updater: function(item) {
			//TODO: set search input value with item..
			Router.go('/projects/tag/' + item);
		}
	});
};

Template.header.events({
	'click #logout': function(e) {
		Meteor.logout();
	}
})

Template.home.helpers({
	projects: function() {
	  var tag = Session.get('projects_tag');
	  if(tag)
			return Projects.find({tags: {$in: [tag]}});
		return Projects.find();
	},
	mayUpdate: function() {
		return roles.isAdmin() || this.owner === Meteor.userId();
	},
	loading: function() {
		return !projectsHandle.ready();
	},
	noUser: function() {
		return !Meteor.user();
	},
	formatDate: function(date) {
		if(!date)
			return '';
		return moment(date).format('MMM Do YYYY');
	}
});

Template.home.events({
	'click .deleteProject': function(e) {
		e.preventDefault();
		if(confirm("Are you sure you want to remove this project?")) {
			Meteor.call('deleteProject', this._id);
		}
	}
});

Template.landing.events({
	'click #mailing_btn': function(e) {
		e.preventDefault();
		Meteor.call('addToMailList', $('#mailing_email').val(), function(err) {
			if(err) {
				alert(err.reason);
			} else {
				alert("Thank you for signing up to our launch mailing list. Please check your email to confirm your subscription.")
			}
		});
	}
});

Accounts.ui.config({
  requestPermissions: {
    github: ['user:email']
  },
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

// Animated scrollto
$("#nav ul li a[href^='#']").on('click', function(e) {

   // prevent default anchor click behavior
   e.preventDefault();

   // store hash
   var hash = this.hash;

   // animate
   $('html, body').animate({
       scrollTop: $(this.hash).offset().top
     }, 300, function(){

       // when done, add hash to url
       // (default click behaviour)
       window.location.hash = hash;
     });

});
