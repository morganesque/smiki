var EditorView = Backbone.View.extend({

    model:Pages,
    current_page: null,
    current_textarea: null, 
    linkRange:null,  

    initialize: function()
    {
        console.log('v13');        

        this.pageNamer = new AutoCompleteView({
            input: $("#label"),              // your input field
            model: this.model,              // your collection
            onSelect: _.bind(this.namerSelect,this),
        }).render();

        this.pageLinker = new AutoCompleteView({
            itemView:LinkAutoCompleteItemView,
            input: $("#new_page__name"),     // your input field
            model: this.model,              // your collection
            onSelect: _.bind(this.linkerSelect,this),
        }).render();

        this.pageLinker.on('hide',_.bind(function(e)
        {     
            $('.overlay').fadeOut();       
            this.current_page.textarea.textrange('set',linkRange.start, linkRange.length);
        },this));
    },

    getNewId: function()
    {
        var id;
        if (!this.model.length) id  = 1;
        else id = _.max(this.model.pluck("id"))+1;        
        return id;
    }, 

    showOverlay:function()
    {
        $('.overlay').fadeIn();
        linkRange = this.current_page.textarea.textrange('get');
        $('#new_page__name').focus().val(linkRange.text).textrange('set');                 
    },

    newPage:function(model)
    {
        var m = model;
        var id = this.getNewId();                
        m.set({'new':false,'time':_.now(),"id":id});
        this.model.push(m)
        m.save();
    },

    namerSelect:function(model)
    {      
        var m = model;

        /*
            If it's new create it new.
        */
        if (m.get('new') == true) this.newPage(m);

        /*
            Display a page into the editting screen.
        */
        this.current_page = new PageEditView({model:m}); 
        this.current_page.on('wrapLink',_.bind(this.startAddingLink,this)); // listen for CMD + L
        $('#content').html(this.current_page.el).fadeIn();  

        /*
            Put the cursor at the end of the textarea.
        */
        this.current_page.textarea.focus().textrange('setcursor',this.current_page.textarea.val().length);  
        $('#controls').fadeIn();                
    },

    startAddingLink:function(a)
    {
        // this.current_page.textarea = a; no need anymore.  
        var sel = this.current_page.textarea.textrange('get').text;
        if (!sel)
        {
            alert('You need to select some text to turn into a link. – 0w67');
            return false;
        }
        this.showOverlay();
    },

    linkerSelect:function(model)
    {       
        var m = model;

        /*
            If it's new create it new.
        */        
        if (m.get('new') == true) this.newPage(m);

        /*
            grab the selected text and create a URL for linking.
        */        
        var sel = this.current_page.textarea.textrange('get').text;
        var url = SITEURL+'view/#'+m.get('id');

        /*
            replace the text with a link, update the preview, go back to editing.
        */        
        this.current_page.textarea.textrange('replace','['+ sel +']('+ url +')');
        this.current_page.processMarkdown();
        $('.overlay').fadeOut();       
    },

    });