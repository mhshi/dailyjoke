$(function(){
    $('#savebtn').click(dj_save_post);

    do {
       var num = dj_generate_posts_list('postslist', false);
       if (num == 0 || num < posts_limit) {
           break;
       }
    }while($(document).height() == $(window).height());

    $(window).scroll(function() {
        if($(window).scrollTop() == $(document).height() - $(window).height()) {
           // ajax call get data from server and append to the div
           dj_generate_posts_list('postslist', false);
        }
    });

});

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
        do {
            var num = dj_generate_posts_list('postslist', false);
            if (num == 0 || num < posts_limit) {
                break;
            }
        }while($(document).height() == $(window).height());
    }
}

function dj_clear_posts_list() {
    $('#postslist').empty();
}

function dj_delete_post(event) {
    var post_id = $(this).parent().attr('post_id');
    var para = {
        post_id: post_id
    };

    var result = $.ajax({
        type: 'POST',
        url: '/mposts/delete',
        data: para,
        async: false
    }).responseText;

    result = $.parseJSON(result);
    if (result.success) {
        $('#post_'+post_id).remove();
    } else {
        alert(result.error);
    }
}

function dj_generate_qr(event){
    alert('QR');
}
