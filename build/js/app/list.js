require(["jquery","render","getRequest","text!listTpl","lazyload"],function(t,n,o,l,a){t("body").append(l);var e=o.type,i=t(".list-content");function c(){t.ajax({url:"/api/list?type="+e,dataType:"json",success:function(o){console.log(o),1===o.code&&(n("#list-tpl",".list-wrap",o.data.items),t("img[data-original]").lazyload({container:i}),i.on("scroll",s))},error:function(o){console.warn(o)}})}c();var r=i.height();function s(){var o=t(".list-wrap").height()-r;i.scrollTop()>o-40&&(i.off("scroll"),c())}t(".icon-back").on("click",function(){location.href="/"})});