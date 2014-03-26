var PageEditView = Backbone.View.extend(
{
    tagName: 'div',
    pressedKeys: [],
    listenToKeys: false,
    preview: $('#preview'),
    timer: null,

    events: {
        "focus textarea": "onfocus",
        "blur textarea": "onblur",
        "keydown textarea": 'onkeydown',
        "keyup textarea": 'onkeyup',
    },

    onkeyup: function(e)
    {      
        this.pressedKeys = [];
        this.processMarkdown();
    },

    onkeydown: function (e) 
    {               
        if (!this.listenToKeys) return;

        // CMD  = 91
        // CTRL = 17
        // L    = 76
        // K    = 75
        var pk = this.pressedKeys;

        pk[e.keyCode] = true;

        if ((pk[91] && pk[76]) || (pk[17] && pk[76])) // (CTRL|CMD) + L
        {
            e.preventDefault();
            this.pressedKeys = [];        
            this.trigger('wrapLink',this.textarea);
        }

        if ((pk[91] && pk[75]) || (pk[17] && pk[75])) // CMD + K
        {
            this.pressedKeys = [];
            $("#label").focus().textrange('set');
        }
    },

    onfocus:function()
    {
        this.listenToKeys = true;
    },

    onblur: function()
    {
        this.listenToKeys = false;
    },

    initialize: function() 
    {
        // this.nameLabel  = $('<p class="editor_label"></p>');
        this.textarea   = $('<textarea class="editor"></textarea>');

        // this.$el.append(this.nameLabel);
        this.$el.append(this.textarea);
        // this.$el.append(this.preview); // already appended.

        // this._processMarkdown = _.throttle(this.processMarkdown, 1000);

        this.listenTo(this.model, "change", this.render);
        this.listenTo(this.model, "destroy", this.explode);

        this.render();
        this.processMarkdown();

        this.timer = setInterval(this.saveModel.bind(this), 3000);
    },

    explode: function()
    {
        this.remove();       
        clearInterval(this.timer);
    },

    render: function() 
    {
        // this.nameLabel.html("editing: <span>"+this.model.get('name')+"</span>");
        this.textarea.val(this.model.get('story'));
    },
    /*
    Function to convert textarea content into HTML
    */        
    processMarkdown: _.throttle(function()
    {
        var t = this.textarea.val();
        this.model.set({"story":t});
        
        var md = markdown.toHTML(t);
        var hh = '<h1>'+this.model.get('name')+'</h1>';
        this.preview.html(hh+md).fadeIn();
        
    },1000),

    saveModel:function()
    {
        this.model.save();
    },                        
});