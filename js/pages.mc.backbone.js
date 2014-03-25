var Page = Backbone.Model.extend(
{
    localStorage: new Backbone.LocalStorage("Pages"),                
    story:'',
    name:'',
    url_name:'',
    label:function()
    {
        return this.get('name');
    }
});

var Pages = Backbone.Collection.extend({
    model:Page,
    localStorage: new Backbone.LocalStorage("Pages")
});