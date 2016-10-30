// (function($) {
//   $(document).ready(function() {
//      $.slidebars({
//          siteClose: true // true or false
//          disableOver: 480 // integer or false
//          hideControlClasses: true // true or false
//       });
//   });
// }) (jQuery);
var socket = io();
var checked = false;
var bodyChecked = false;

$(window).load(function(){
  var nickname = $('.profile_name').text().trim();
  reset();
  /*SOCKET CODE!!!!*/
  $('form').submit(function(){
    if($('#m').val().trim() != "")
    {
      socket.emit('msg', {
        msg : $('#m').val(),
        nickname : nickname
      });
      $('#m').val('');
    }
    return false;
  });
  socket.on('msg', function(data){
    var t = " "
    if(data.nickname == nickname)
    {
      t += "<div class='chatMessage me'>"
      t += "<div class='chatValue'>"+data.msg+"</div>"
      t += "</div>"
    }
    else{
      t += "<div class='chatMessage you'>"
      t += "<div class='chatValue'>"+data.msg+"</div>"
      t += "</div>"
    }

    $('.chatIndex').append(t)
    $(".chatIndex").scrollTop($(".chatIndex")[0].scrollHeight);
  });

  /*END SOCKET CODE!!!*/

  $('.openSideBar_img').click(function(){
    $(this).attr('src', '/img/icon/menu.png');
    $('.content').toggleClass('open')
    // alert("dkdk")
    // $('.sideBar').show();
    $('.sideBar').css('left', 0);
    // $('.sidebar_cover').show();
    checked = true;
    bodyChecked = false;
  });
  $('body').click(function(e){
    if(checked && bodyChecked){
      if(!$('.sideBar').has(e.target).length){
        $('.sideBar').css('left', -203);
        checked = false;
      }
    }
    bodyChecked = true;
  });

  $('.person_right').click(function(){
    if($('.dropDownProfile li').css('display') == 'none')
    {
      $('.downImg').attr('src', '/img/icon/up.png');
      $('.dropDownProfile li').show();

    }
    else{
      $('.downImg').attr('src', '/img/icon/down.png');
      $('.dropDownProfile li').hide();

    }
  });

});

$(window).resize(function() {
   reset();
});

function reset(){
  $('.dropDownProfile li').hide();
  // $('.sideBar').css('height',window.innerHeight - 63);
  $('.sidebar_cover').css('height', window.innerHeight)
  $('.container').css('height', window.innerHeight);
  $('.friendList').css('height', window.innerHeight - 140)
}
