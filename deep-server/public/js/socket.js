var socket = io();
var opponent = ""
var nickname;

var chatIndexCount;
var userCount = [];
var users = [];
document.getElementById('id');

$(window).load(function() {
    console.log('socket online!');
    nickname = $('.profile_name').text().trim();
    var room_id = "main";
    socket.emit('addUser', { name: nickname });
    socket.emit('change ', 'main');

    $('form').submit(function() {
        if ($('#m').val().trim() != "" && opponent) {
            socket.emit('chat message', {
                msg: $('#m').val(),
                user: nickname
            });
            $('#m').val('');
        }
        return false;
    });

    $('.partnerView').on('click',function() {
      alert(room_id);
    })

    socket.on('my message', function(data) {
        console.log("my message", data);

          console.log("chat messag", data);
          var t =""
          t += "<div class='chatMessage me'>"
          t += "  <div class='chatValue'>" + data + "</div>"
          t += "</div>"
          $('.chatIndexBOX').append(t)
          // $(".chatIndex").scrollTop($(".chatIndex")[0].scrollHeight);

    });

    socket.on('chat message', (data) => {
      console.log("ㅁㄴㅇㄹㅁㄹ", data);
      var t =""
      t += "<div class='chatMessage you'>"
      t += "  <div class='chatValue'>" + data.name + " : "+ data.msg + "</div>"
      t += "</div>"
      $('.chatIndexBOX').append(t)
      // $(".chatIndex").scrollTop($(".chatIndex")[0].scrollHeight);

    })

    socket.on('user state', function(datas) {
        // 입장 알림
        console.log(datas);
        var t = " "
        t += "<div class='chatMessage you'>"
        t += "  <div class='chatValue'>" + datas.nickname + "님이 입장하셨습니다</div>"
        t += "</div>"
        $('.chatIndexStatic').append(t)
        for(data of datas.users){
          $('.chatIndexBOX').append('<div class="chatIndex chatIndex_' + data.user_id + '"></div>');
          $(".chatIndexBOX").scrollTop($(".chatIndex")[0].scrollHeight);
        }
        fnUpdateUserList(datas.users);
        // 유저리스트 업데이트
    });

    socket.on('loading message', (data) =>{
      console.log(data);
      // $('.chatIndexStatic').empty()
      var t = " "
      for(des of data.des){
        if(!des.indexOf(nickname)){
          t += "<div class='chatMessage me'>"
          t += "  <div class='chatValue'>" + des + "</div>"
          t += "</div>"
        }else{
          t += "<div class='chatMessage you'>"
          t += "  <div class='chatValue'>" + des + "</div>"
          t += "</div>"
        }
      }
      $('.chatIndexBOX').append(t)
      // $(".chatIndex").scrollTop($(".chatIndex")[0].scrollHeight);
    })

    // socket.on('user state', function(data) {
    //     // 유저리스트 업데이트
    //     console.log(data.users);
    //     initUpdateUserList(data.users); // 유저 리스트 초기값 설정
    //     fnUpdateUserList(data.users); // 유저리스트 업데이트
    //     var t = "";
    //     t += "<div class='chatMessage you'>"
    //     t += "  <div class='chatValue welcome'>" + nickname + "님 환영합니다</div>"
    //     t += "</div>"
    //     $('.chatIndexStatic').append(t)
    //     $(".chatIndex").scrollTop($(".chatIndex")[0].scrollHeight);
    // });

    socket.on('left', function(data) {
        // 종료 알림
        var t = " "
        t += "<div class='chatMessage you'>"
        t += "  <div class='chatValue'>" + data.nickname + "님이 퇴장하셨습니다</div>"
        t += "</div>"
        $('.chatIndexStatic').append(t)
        $('chatIndex_' + data.nickname).remove();
        var j = data.tmpUserList.indexOf(data.nickname);
        userCount.splice(j, 1);
        console.log('left user!')
        $(".chatIndexBOX").scrollTop($(".chatIndex")[0].scrollHeight);
        // 유저리스트 업데이트
        fnUpdateUserList(data.users);
    });

    $(document).on('click', '.usersBox', function() {
        opponent = $(this).find('.usersName').text().trim(); // 지정한 사람 변수에 저장
        chatIndexCount = $('.chatIndex').length; // 총 몇개의 채팅방이 개설되었는지 계산

        $('.usersBox').css('background-color', 'rgb(241, 239, 239)') // 배경색 변경 초기화
        $(this).css('background-color', 'rgb(102, 168, 207)') // 선택한 div 색 강조색으로 변경
        $(this).css('color', 'white');
        $('.partnerView').text(opponent); // chatHeaderView 에 추가

        // $(this).find('.usersAlarmBOX').hide(); // 알람값 초기화
        // for (var i = 0; i < chatIndexCount; i++) {
        //     if ($('.chatIndex').eq(i).css('display') != 'none') {
        //         userCount[i].count = 0;
        //         $('.chatIndex').eq(i).hide()
        //     }
        // }
        // $('.chatIndex_' + opponent).show();
        $.post("http://iwin247.net:7727/chat",
                {
                  a : nickname,
                  b : opponent
                },function(data, status){
                    // alert(data)
                    room_id = data
                    $('.chatIndexBOX').empty();
                    $('.chatIndexBOX').append($('<li>').text("Now token : "+data));
                    $('.chatIndexBOX').append($('<li>').text("My Name : "+nickname));
                     socket.emit('change room', data)
                });
    });
});

function fnUpdateUserList(userList) {
    $('.usersList').empty();
    console.log(userList);
    var li = " "

    for (var i = 0; i < userList.length; i++) {
        if(userList[i].user_id == nickname) continue;
        li += '<li class="usersBox">'
        li += '     <div class="usersProfile">'
        li += '       <img src="" alt="" />'
        li += '     </div>'
        li += '     <div class="usersIndex">'
        li += '       <div class="usersName">' + userList[i].user_id + '</div>'
        li += '       <div class="usersCountry">KOREA</div>'
        li += '     </div>'
        li += '    <div class="usersOther">'
        li += '      <div class="usersTime">'
        li += '         오후 5:41'
        li += '      </div>'
        li += '    </div>'
        li += '   </li>'
    }

    $('.usersList').append(li)
}
