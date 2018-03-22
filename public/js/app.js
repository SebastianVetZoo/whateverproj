var app = new Backbone.Marionette.Application();

var Post = Backbone.Model.extend({
	text: '',
	author: '',
	date: ''
});
var Posts = Backbone.Collection.extend({
	model: Post
});

//Mono views
var ViewPicker = Backbone.Marionette.ItemView.extend({
	template: '#viewPicker',
	events: {
		'click #viewNew': 'showNewPost',
		'click #viewPosts': 'showPosts'
	},
	showNewPost: function(){
		app.mainRegion.show(new NewPostView({collection: app.allPosts}));
		//app.posts.hide(new PostsView({collection: app.allPosts}));
	},
	showPosts: function(){
		app.mainRegion.show(new PostsView({collection: app.allPosts}));
	}
});

var PostView = Backbone.Marionette.ItemView.extend({
	template: '#post',
	events: {
		'click #delete': 'deletePost'
	},
	deletePost: function(){
		this.model.destroy();
	}
});

var NewPostView = Backbone.Marionette.ItemView.extend({
	template: '#newPost',
	events: {
		'click #send': 'addNewPost'
	},
	ui: {
		author: '#postAuthorInput',
		text: '#postTextInput'
	},
	addNewPost: function(){
		if (this.ui.text.val() != ''){
			var tempAuth = 'Anonymous';
			if (this.ui.author.val() != '')
				tempAuth = this.ui.author.val();
			this.collection.add({
				author: tempAuth,
				text: this.ui.text.val()
			});
			this.ui.author.val('');
			this.ui.text.val('');
		}
	}
});

var NoPosts = Backbone.Marionette.ItemView.extend({
	template: '#emptyView'
});

//Multi views
var PostsView = Backbone.Marionette.CompositeView.extend({
	childView: PostView,
	emptyView: NoPosts,
	childViewContainer: '#childSpace',
	template: '#posts'
});

app.addInitializer(function(){
	app.addRegions({
		viewPicker: '#viewPickerRegion',
		//newPost: '#newPostRegion',
		//posts: '#postsRegion'
		mainRegion: '#mainRegion'
	});
	app.allPosts = new Posts();

	app.viewPicker.show(new ViewPicker());
	//app.newPost.show(new NewPostView({collection: app.allPosts}));
	//app.posts.show(new PostsView({collection: app.allPosts}));
});

app.start();