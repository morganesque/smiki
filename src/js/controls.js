$(document).on("ready",function(e)
{
    $('#add_link').on("click",function(e)
    {
        console.log("on add_link click");        
        e.preventDefault();
        current_textarea = $('.editor');  
        var sel = current_textarea.textrange('get').text;
        if (!sel)
        {
            alert('You need to select some text to turn into a link.');
            return false;
        }
        showOverlay();
    });

    $('#view_page').on("click",function(e)
    {        
        e.preventDefault();
        var id = current_page.model.get('id');
        current_page.model.save("id",id,{success:function()
        {
             window.location.href = SITEURL+'view/#'+id;
        }})
    });

    $('#delete_page').on("click",function(e)
    {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this page?'))
        {
            current_page.model.destroy();
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