require(['jquery', 'storage'], function($, storage) {
    $('#btn').on('click', function() {
        var username = $('#username').val();

        var pwd = $('#pwd').val();

        if (!username) {
            alert('用户名不能为空');
        } else if (!pwd) {
            alert('密码不能为空');
        } else {
            $.ajax({
                url: '/api/login',
                data: {
                    username: username,
                    pwd: pwd
                },
                dataType: 'json',
                type: 'post',
                success: function(res) {
                    if (res.code === 1) {
                        storage.set('code', res.code);
                        history.go(-1);
                    } else {
                        alert(res.msg);
                    }
                },
                error: function(error) {
                    console.warn(error);
                }
            })
        }
    })
})