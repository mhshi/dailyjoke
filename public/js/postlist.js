var posts_start = 0;
var posts_limit = 5;

function dj_generate_posts_list(list_div_id, disable_menu) {
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
            dj_add_post_to_list(result.data[i], list_div_id, disable_menu);
        }
        return result.data.length;
    } else {
        alert(result.error);
        return 0;
    }
}

function dj_add_post_to_list(post, list_div_id, disable_menu) {
    var list = $('#'+list_div_id),
        post_qr_btn_id = 'post_qr_btn_' + post._id,
        post_del_btn_id = 'post_del_btn_' + post._id;

    var ppanel = $('<div></div>');
    ppanel.attr('id', 'post_' + post._id);
    var html =  '<div class="post_header"><div class="post_title">'+post.title+'</div>';
    if (disable_menu !== true) {
        html +=   '<div class="post_menu" post_id="'+post._id+'">';
        html +=     '<div class="post_menu_item" id="'+post_qr_btn_id+'">Q</div>';
        html +=     '<div class="post_menu_item" id="'+post_del_btn_id+'">D</div>';
        html +=   '</div>';
    }
    html +=     '</div>';
    html += post.content;
    ppanel.html(html);

    list.append(ppanel);

    if (disable_menu !== true) {
        $('#'+post_qr_btn_id).click(dj_generate_qr);
        $('#'+post_del_btn_id).click(dj_delete_post);
    }
}
