$(function(){
    do {
       var num = dj_generate_posts_list('postslist', true);
       if (num == 0 || num < posts_limit) {
           break;
       }
    }while($(document).height() == $(window).height());

    $(window).scroll(function() {
        if($(window).scrollTop() == $(document).height() - $(window).height()) {
           // ajax call get data from server and append to the div
           dj_generate_posts_list('postslist', true);
        }
    });

});
