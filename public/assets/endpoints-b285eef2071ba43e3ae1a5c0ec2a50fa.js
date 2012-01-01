/**
 * @fileOverview This file contains functions for handling the user's location,
 * registering endpoints, and creating web sockets.
 * @author <a href="mailto:jim@jh-lim.com">Jiunn Haur Lim</a>
 */
/**
 * @namespace Contains functions for registering endpoints and creating web
 * sockets.
 */
var Loader=function(){const a="/endpoints",b="/endpoints",c="http://beam-node.nodester.com/",d="endpoint_uuid",e={expires:365,path:"/"};var f=function(a){var b=$.cookie(d);null==b?h(a,function(a){$.cookie(d,a,e),j(a)}):i(b,a,function(a){j(a)})},g=function(a){a=a||""},h=function(b,c){$.ajax(a,{type:"post",data:{lat:b.coords.latitude,lon:b.coords.longitude},dataType:"json",success:function(a,b,d){c(a.uuid)}})},i=function(a,c,g,h){h=h||0,$.ajax(b+"/"+a,{type:"put",data:{lat:c.coords.latitude,lon:c.coords.longitude},dataType:"json",success:function(b,c,d){g(a)},error:function(b,j,k){if(h<4&&(null==j||"timeout"==j||"abort"==j)){i(a,c,g,h++);return}$.cookie(d,null,e),f(c)}})},j=function(a){var b=io.connect(c);b.on("connect",function(c){b.emit("set uuid",a)})};return{init:f,no_location:g}}();$(function(){geo_position_js.init()?geo_position_js.getCurrentPosition(Loader.init,Loader.no_location):Loader.no_location()})