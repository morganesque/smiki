$(document).on("ready",function(e)
{
    $('#add_link').on("click",function(e)
    {
        console.log("on add_link click");        
        e.preventDefault();
        page_editor.current_page.textarea = $('.editor');  
        var sel = page_editor.current_page.textarea.textrange('get').text;
        if (!sel)
        {
            alert('You need to select some text to turn into a link. – 0w12');
            return false;
        }
        page_editor.showOverlay();
    });

    $('#view_page').on("click",function(e)
    {        
        e.preventDefault();
        var id = page_editor.current_page.model.get('id');
        page_editor.current_page.model.save("id",id,{success:function()
        {
             window.location.href = SITEURL+'view/#'+id;
        }})
    });

    $('#delete_page').on("click",function(e)
    {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this page?'))
        {
            page_editor.current_page.model.destroy();
            // current_page.remove();
            // the_pages.on('remove',function(model)
            // {
            //     console.log('removed');        
            //     var r = model.destroy(model); console.log(r);        
            // });
            // var r = the_pages.remove(current_page.model); //console.log(r);        

            // current_page.model.destroy();
            $('#label').val('').focus();
        }
    });
});