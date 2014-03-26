var AutoCompleteItemView = Backbone.View.extend({
    tagName: "li",
    template: _.template('<a href="#"><span class="icon icon-<%= type %> -left"></span><%= label %></a>'),

    edit_prefix:"Edit page: ",
    new_prefix:"New page: ",

    events: {
        "click": "select"
    },

    initialize: function(options) {
        this.options = options;
    },

    render: function () {

        var l = this.edit_prefix+this.model.label();
        var t = 'pencil';

        if (this.model.get('new') == true) 
        {
            l = this.new_prefix+this.model.label();
            t = "plus"
        }

        this.$el.html(this.template({"label": l, "type":t}));
        return this;
    },

    select: function () {
        this.options.parent.hide().select(this.model);
        return false;
    }
});

var LinkAutoCompleteItemView = AutoCompleteItemView.extend({
    edit_prefix:"Link to: ",
    new_prefix:"New page: ",
})

var AutoCompleteView = Backbone.View.extend(
{
    tagName: "ul",              // backbone normal
    className: "autocomplete",  // class name for el
    wait: 300,                  // wait time before doing anything.
    queryParameter: "query",    // 
    minKeywordLength: 0,
    currentText: "",
    itemView: AutoCompleteItemView,

    initialize: function (options) {
        _.extend(this, options);
        this.filter = _.debounce(this.filter, this.wait);
    },

    render: function () {
        // disable the native auto complete functionality
        this.input.attr("autocomplete", "off");

        this.$el.width(this.input.outerWidth());

        this.input
            .keyup(_.bind(this.keyup, this))
            .keydown(_.bind(this.keydown, this))
            .after(this.$el);

        return this;
    },

    keydown: function (event) 
    {
        if (event.keyCode == 38) return this.move(-1);  // up
        if (event.keyCode == 40) return this.move(+1);  // down
        if (event.keyCode == 13) return this.onEnter(); // enter
        if (event.keyCode == 27) return this.hide();    // escape
    },

    move: function (position) 
    {
        var current = this.$el.children(".active"),
            siblings = this.$el.children(),
            index = current.index() + position;

        // only take action if the prev or next element exists.
        if (siblings.eq(index).length) 
        {
            current.removeClass("active");
            siblings.eq(index).addClass("active");
        }

        return false;
    },   

    onEnter: function () {
        this.$el.children(".active").click();
        return false;
    },

    keyup: function () 
    {
        var keyword = this.input.val();

        if (this.isChanged(keyword)) 
        {    
            // console.log('changed');        
            if (this.isValid(keyword)) 
            {
                // console.log('valid');        
                this.filter(keyword);
            } else {
                // console.log('invalid');        
                this.hide()
            }
        }
    },

    isChanged: function (keyword) {
        var res = this.currentText === keyword;
        // console.log([this.currentText,keyword,!res]);        
        this.currentText = keyword;
        return !res;
    },   
    
    isValid: function (keyword) {
        return keyword.length > this.minKeywordLength
    },

    filter: function (keyword) {

        // convert to lower case.
    	var checkword = keyword.toLowerCase();
        
        // if we're going to back to the server for answers.
        if (this.model.url) {

            var parameters = {};
            parameters[this.queryParameter] = checkword;

            this.model.fetch({
                success: function () {
                    this.loadResult(this.model.models, keyword);
                }.bind(this),
                data: parameters
            });

        } else if (keyword == '?') {

            // console.log('got the ?');   
            this.model.models.sort('time');
            this.loadResult(this.model.models, keyword);
            
        // else we're just searching through the current collection.
        } else {

            var fileredModels = this.model.filter(function(model) 
            {
                return model.label().toLowerCase().indexOf(checkword) !== -1
            });
            this.loadResult(fileredModels, keyword);
        }
    },

    /*
        build the list of suggestions.
    */        
    loadResult: function (models, keyword) 
    {
        // load the keyword into currentText (why didn't you do this previously).
        this.currentText = keyword;
        // show and empty the list of suggestions.
        this.show().reset();      

        // only do anything if there are any suggestions. (change this to "nothing found" if else).
        if (models.length) 
        {
            // add all the suggestions to the list.
            _.forEach(models, this.addItem, this);
            this.show();
        } else { 

            var m = new Page();
            m.set({"new":true,"name":keyword}); // set the keyword option to indentify this further along.            
            this.addItem.call(this,m)
            this.show();
        }
    },

    /*
        Adding each item of the suggestions (each a View).
    */        
    addItem: function (model) 
    {
        this.$el.append(new this.itemView({
            model: model,
            parent: this
        }).render().$el);
    },

    select: function (model) {
        // console.log('select');        
        var label = model.label();
        this.input.val(label);
        this.currentText = label;
        this.onSelect(model);
        this.$el.hide();
    },

    reset: function () {
        this.$el.empty();
        return this;
    },

    hide: function () {
        this.$el.hide();
        this.trigger('hide');
        return this;
    },

    show: function () {
        this.$el.show();
        return this;
    },

    // callback definitions
    onSelect: function () {}
});
