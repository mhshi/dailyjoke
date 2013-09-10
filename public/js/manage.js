$(function(){
    $('#savebtn').click(dj_save_post);

    do {
       var num = dj_generate_posts_list();
       if (num == 0 || num < posts_limit) {
           break;
       }
    }while($(document).height() == $(window).height())

    $(window).scroll(function() {
        if($(window).scrollTop() == $(document).height() - $(window).height()) {
           // ajax call get data from server and append to the div
           dj_generate_posts_list();
        }
    });

});

var posts_start = 0;
var posts_limit = 5;

function dj_save_post() {
    var post_title = $('#posttitle').val();
    var post_body = $('#postbody').val();

    if (post_body != ''){
        var para = {
            post_title: post_title,
            post_body: post_body
        };

        var result = $.ajax({
            type: 'POST',
            url: '/mposts/save',
            data: para,
            async: false
        }).responseText;

        dj_clear_posts_list();
        posts_start = 0;
        dj_generate_posts_list();
    }
}

function dj_generate_posts_list() {
    var para = {
        start: posts_start,
        limit: posts_limit
    };

    var result = $.ajax({
        type: 'GET',
        url: '/mposts/list',
        data: para,
        async: false
    }).responseText;

    result = $.parseJSON(result);
    if (result.success) {
        posts_start += result.data.length;
        for (var i=0, length=result.data.length; i<length; i++) {
            dj_add_post_to_list(result.data[i]);
        }
        return result.data.length;
    } else {
        alert(result.error);
        return 0;
    }
}

function dj_clear_posts_list() {
    $('#postslist').empty();
}

function dj_add_post_to_list(post) {
    var list = $('#postslist');

    var ppanel = $('<div></div>');
    var html = '<h4>'+post.title+'</h4>';
    html += post.content;
    ppanel.html(html);

    list.append(ppanel);
}
