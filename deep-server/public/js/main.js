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
var opponent = ""
var nickname;
var chatIndexCount;
var count = 0;
var userCount = [];

$(window).load(function(){
  nickname = $('.profile_name').text().trim();
  reset();
  /*SOCKET CODE!!!!*/
  socket.emit('join', nickname)
  $('form').submit(function(){
    if($('#m').val().trim() != "" && opponent != "")
    {
      socket.emit('msg', {
        msg : $('#m').val(),
        nickname : nickname,
        opp : opponent
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
      $('.chatIndex_'+opponent).append(t)
    }
    else if (data.opp == nickname){
      t += "<div class='chatMessage you'>"
      t += "<div class='chatValue'>"+data.msg+"</div>"
      t += "</div>"
      $('.chatIndex_'+data.nickname).append(t)
      if(opponent != data.nickname)
      {
        var j = data.userList.indexOf(data.nickname);
        if(userCount[j] == undefined)
        {
          userCount[j] = 0;
        }
        userCount[j] += 1;
        fnUpdateUserList(data.userList)
      }
    }
    $(".chatIndex").scrollTop($(".chatIndex")[0].scrollHeight);
  });

  socket.on('join', function(data){
    // 입장 알림
    var t = " "
    t += "<div class='chatMessage you'>"
    t += "  <div class='chatValue'>"+data.nickname+"님이 입장하셨습니다</div>"
    t += "</div>"
    $('.chatIndexStatic').append(t)
    $('.chatIndexBOX').append('<div class="chatIndex chatIndex_'+data.nickname+'"></div>');
    $(".chatIndex").scrollTop($(".chatIndex")[0].scrollHeight);
    // 유저리스트 업데이트
    fnUpdateUserList(data.userList);
  });
  socket.on('welcome', function(data){
    // 유저리스트 업데이트
    console.log(data.userList);
    initUpdateUserList(data.userList);
    fnUpdateUserList(data.userList);


    var t = " "
    t += "<div class='chatMessage you'>"
    t += "  <div class='chatValue'>"+nickname+"님 환영합니다</div>"
    t += "</div>"
    $('.chatIndexStatic').append(t)
    $(".chatIndex").scrollTop($(".chatIndex")[0].scrollHeight);
  });
  socket.on('left', function(data){
    // 종료 알림
    var t = " "
    t += "<div class='chatMessage you'>"
    t += "  <div class='chatValue'>"+data.nickname+"님이 퇴장하셨습니다</div>"
    t += "</div>"
    $('.chatIndexStatic').append(t)
    $('chatIndex_'+data.nickname).remove();
    var j = data.tmpUserList.indexOf(nickname);
    userCount.splice(j,1);
    $(".chatIndex").scrollTop($(".chatIndex")[0].scrollHeight);
    // 유저리스트 업데이트
    fnUpdateUserList(data.userList);
  });

  /*END SOCKET CODE!!!*/

  $('.openSideBar_img').click(function(){
    $(this).attr('src', '/img/icon/menu2.png');
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
  $(document).on('click','.usersBox', function(){
    opponent = $(this).find('.usersName').text().trim();
    if (opponent != nickname)
    {
      $('.partnerView').text(opponent);
      chatIndex_num = ".chatIndex_"+opponent+"";
      chatIndexCount = $('.chatIndex').length;
      $(this).find('.usersAlarmBOX').hide();
      console.log(chatIndexCount);
      for(var i=0; i<chatIndexCount; i++){
        if($('.chatIndex').eq(i).css('display') != 'none')
        {
          count = 0;
          $('.chatIndex').eq(i).hide()
        }
      }
      $(chatIndex_num).show();
    }

  });
  $('.nav_profile').click(function(){
    window.location.href = '/profile'
  });
  $('.nav_settings').click(function(){
    window.location.href = '/settings'
  });
  $('.nav_messages').click(function(){
    window.location.href = '/messages'
  });
});

$(window).resize(function() {
   reset();
});

function reset(){
  $('.dropDownProfile li').hide();
  $('.sideBar').css('height',window.innerHeight - 80);
  $('.sidebar_cover').css('height', window.innerHeight)
  $('.container').css('height', window.innerHeight);
  $('.friendList').css('height', window.innerHeight - 140)
  $('.setBox_1').css('height', window.innerHeight - 75);
  $('.setBox_2').css('height', window.innerHeight - 75);
}
function fnUpdateUserList(userList)
{
  $('.usersList').empty();
  console.log(userList)
  for (var i = 0; i<userList.length; i++)
  {
    if(userList[i] != nickname)
    {
      var li = " "
      li += '<li class="usersBox">'
      li += '     <div class="usersProfile">'
      li += '       <img src="" alt="" />'
      li += '     </div>'
      li += '     <div class="usersIndex">'
      li += '       <div class="usersName">'+userList[i]+'</div>'
      li += '       <div class="usersCountry">KOREA</div>'
      li += '     </div>'
      li += '    <div class="usersOther">'
      li += '      <div class="usersTime">'
      li += '         오후 5:41'
      li += '      </div>'
      li += '      <div class="usersAlarm">'
      li += '        <div class="usersAlarmBOX">'
      li += '          '+userCount[i]+''
      li += '        </div>'
      li += '      </div>'
      li += '    </div>'
      li += '   </li>'
      $('.usersList').append(li)
      $('.chatIndex_'+userList[i]).hide();
      if (userCount[i] == undefined)
      {
        // console.log($('usersIndex').eq(i).html());
        $('.usersBox').eq(i - 1).find('.usersAlarmBOX').hide();
      }
      else{
        $('.usersBox').eq(i - 1).find('.usersAlarmBOX').show();
      }
    }
  }
  if (opponent != "")
  {
    $('chatIndex_'+opponent).show();
  }
}

function initUpdateUserList(userList){
  for (var i = 0; i<userList.length; i++)
  {
    if(userList[i] != nickname)
    {
      $('.chatIndexBOX').append('<div class="chatIndex chatIndex_'+userList[i]+'"></div>');
    }
  }
}
