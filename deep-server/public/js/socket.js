var socket = io();
var opponent = ""
var nickname;
var chatIndexCount;
var userCount = [];
document.getElementById('id')
$(window).load(function(){
  console.log('socket online!');
  nickname = $('.profile_name').text().trim();
  socket.emit('join', nickname)
  $('form').submit(function(){
    if($('#m').val().trim() != "" && opponent)
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
        userCount[j].count += 1;

        console.log(userCount[j]);
        fnUpdateUserList(data.userList)
      }
    }
    $(".chatIndexBOX").scrollTop($(".chatIndexBOX")[0].scrollHeight);

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
    initUpdateUserList(data.userList); // 유저 리스트 초기값 설정
    fnUpdateUserList(data.userList); // 유저리스트 업데이트
    var t = "";
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
    var j = data.tmpUserList.indexOf(data.nickname);
    userCount.splice(j,1);
    console.log('left user!')
    $(".chatIndex").scrollTop($(".chatIndex")[0].scrollHeight);
    // 유저리스트 업데이트
    fnUpdateUserList(data.userList);
  });
  $(document).on('click','.usersBox', function(){
    opponent = $(this).find('.usersName').text().trim();// 지정한 사람 변수에 저장
    chatIndexCount = $('.chatIndex').length; // 총 몇개의 채팅방이 개설되었는지 계산

    $('.usersBox').css('background-color', 'rgb(241, 239, 239)') // 배경색 변경 초기화
    $(this).css('background-color', 'rgb(102, 168, 207)') // 선택한 div 색 강조색으로 변경
    $('.partnerView').text(opponent); // chatHeaderView 에 추가

    $(this).find('.usersAlarmBOX').hide(); // 알람값 초기화
    for(var i=0; i<chatIndexCount; i++){
      if($('.chatIndex').eq(i).css('display') != 'none')
      {
        userCount[i].count = 0;
        $('.chatIndex').eq(i).hide()
      }
    }
    $('.chatIndex_'+opponent).show();
  });
});
function fnUpdateUserList(userList)
{
  $('.usersList').empty();
  console.log(userList)
  for (var i = 0; i<userList.length; i++)
  {
    if(userList[i].count == undefined)
    {
      userCount.push({name : userList[i], count : 0});
    }
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
    li += '          '+userCount[i].count+''
    li += '        </div>'
    li += '      </div>'
    li += '    </div>'
    li += '   </li>'
    $('.usersList').append(li)
    $('.chatIndex_'+userList[i]).hide();
    if(userList[i] == nickname)
    {
      $('.usersBox').eq(i).hide();
    }
  }

  if (opponent != "")
  {
    $('chatIndex_'+opponent).show();
  }

  for(var i=0; i<userList.length; i++)
  {
    if (userCount[i].count == 0)
    {
      $('.usersBox').eq(i).find('.usersAlarmBOX').hide();
    }
    else{
      $('.usersBox').eq(i).find('.usersAlarmBOX').show();
    }
  }

}

function initUpdateUserList(userList){
  for (var i = 0; i<userList.length; i++)
  {
    if(userList[i] != nickname)
    {
      $('.chatIndexBOX').append('<div class="chatIndex chatIndex_'+userList[i]+'"></div>');
      userCount.push({name : userList[i], count : 0});
      $('.usersBox').eq(i).find('.usersAlarmBOX').hide();
    }
  }
}
