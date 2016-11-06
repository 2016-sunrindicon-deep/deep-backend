var open;
var bodyChecked;
var language_code = 1;
var user = {}
$(window).load(function(){
  user = {hobby : []}
  setLanguage();
  open = true;
  bodyChecked = false;
  reset();
  $('#home').click(function(){
    location.href = "/home"
    setLanguage();
  });
  $('#profile').click(function(){
    location.href = "/profile"
    setLanguage();
  });
  $('#message').click(function(){
    location.href = "/message"
    setLanguage();
  });
  $('#setting').click(function(){
    location.href = "/settings"
    setLanguage();
  });
  // $(document).click('.nav_app a', function(event){
  //
  //     console.log(event.target.id);
  //
  //     if(event.target.id == "home")
  //     {
  //       var className =  $('body').attr('class')
  //       $('body').removeClass(className)
  //       $('body').toggleClass('homePage')
  //     }
  //     else if (event.target.id == "profile")
  //     {
  //       var className =  $('body').attr('class')
  //       $('body').removeClass(className)
  //       $('body').toggleClass('profilePage')
  //     }
  //     else if (event.target.id == "message")
  //     {
  //       var className =  $('body').attr('class')
  //       $('body').removeClass(className)
  //       $('body').toggleClass('messagesPage')
  //     }
  //     else if (event.target.id == "setting")
  //     {
  //       var className =  $('body').attr('class')
  //       $('body').removeClass(className)
  //       $('body').toggleClass('settingsPage')
  //     }
  //     history.pushState(null, null, event.target.href);
  //     $('article').load(event.target.href+' article>.main', function(){
  //       setLanguage();
  //     });
  //     event.preventDefault();
  // });

  // $(window).on('popstate', function(event){
  //   console.log(location);
  //   var className =  $('body').attr('class')
  //   var addClass = location.pathname;
  //   addClass = addClass.replace('/', '');
  //   $('body').removeClass(className);
  //   $('body').toggleClass(addClass + 'Page');
  //   $('article').load(location.href+' article>.main');
  //
  // });
  $(document).on('click', '.setBtn', function(){
    $('.setBtn').css('background-color', 'white');
    $('.setBtn').css('color', 'black')
    $(this).css('background-color', '#66A8CF');
    $(this).css('color', 'white');
    if($(this).attr('name') == "Japanese")
    {
      alert("일본어는 현재 지원 준비중입니다\n[日本語は準備中]");
      return false;
    }
    $.post("http://iwin247.net:7727/auth/setting",{
              user_id : $('.profile_name').text().trim(),
              country : $(this).attr('name').trim()
            },function(data, status){
                // alert(data)
                console.log("response:" + data);
            });
    if($(this).attr('name') == "korean")
    {
      user.language = "ko"
      language_code = 0;
      setLanguage();
    }
    if($(this).attr('name') == "English")
    {
      user.language = "en"
      language_code = 1;
      setLanguage();
    }
    // if($(this).attr('name') == "Japanese")
    // {
    //   user.language = "jp"
    //   language_code = 2;
    //   setLanguage();
    // }
  });
  $(document).on('click','.box',function(){
    var boxlength = $('.box').length;
    var count = 0;
    for(var i=0; i<boxlength; i++)
    {
      if ($('.box').eq(i).children('img').css('display') != 'none')
      {
        ++count;
      }
    }
    console.log(count);
    // console.log($('.box').eq().children('img').css('display'));
      if($(this).children('img').css('display') == 'none' && count < 4){
        $(this).children('img').show();
        user.hobby.push($(this).attr('id'))
        console.log(user.hobby);
      }
      else if ($(this).children('img').css('display') != 'none' && count <= 4){
        var index = user.hobby.indexOf($(this).id);
        user.hobby.splice(index, 1)
        $(this).children('img').hide();
        console.log(user.hobby);
      }
  });
  $('.openSideBar_img').click(function(){
    if($('.header').css('display') == 'none')
    {
      $(this).attr('src', '/img/icon/menu_M.png');
    }
    else{
      $(this).attr('src', '/img/icon/menu2.png');
    }
    console.log(open);
    if(open == true)
    {
      $('.content').removeClass('open');
      $('.content').toggleClass('close');
      open = false;
    }
    else if(open == false){
      $('.content').toggleClass('open');
      $('.content').removeClass('close');
      open = true;
      bodyChecked = false;
    }
  });
  $('body').click(function(e){
    var tmp = $('.sideBar').css('position')
    if(open && bodyChecked &&  tmp =='absolute'){
      if(!$('.sideBar').has(e.target).length){
        $('.content').removeClass('open');
        $('.content').toggleClass('close');
        open = false;
      }
    }
    bodyChecked = true;
  });
  $('.topSearch').click(function(){
    jQuery.ajax({
          type:"GET",
          url:"/home",
          dataType:"JSON", // 옵션이므로 JSON으로 받을게 아니면 안써도 됨
          success : function(data) {
                // 통신이 성공적으로 이루어졌을 때 이 함수를 타게 된다.
                // TODO
          },
          error : function(xhr, status, error) {
                alert("에러발생");
          }
    });
    $(document).on('click', '.profile_img', function(){
      alert("dkkd");
    })
  });
});



$(window).resize(function() {
   reset();
});

function reset(){
  $('.sideBar').css('height',window.innerHeight - 70);
  $('.sidebar_cover').css('height', window.innerHeight)
  $('.container').css('height', window.innerHeight);
  $('.friendList').css('height', window.innerHeight - 140)
  $('.setBox_1').css('height', window.innerHeight - 75);
  $('.setBox_2').css('height', window.innerHeight - 75);
  if($('.header').css('display') == 'none'){
    $('.article').css('height', window.innerHeight);
  }
  else{
    $('.article').css('height', window.innerHeight - 70);
    // $('.main')css('height', window.innerHeight - 70;)
  }

}
function setLanguage(){
  console.log("test")
  if(language_code == 0)
  {
    $('.ko').css('background-color', '#66A8CF');
    $('.ko').css('color', 'white');
    $('.mailView').text('메일');
    $('.nameView').text('이름');
    $('.languageView').text('언어');
    $('.basic').text('기본설정');
    $('.secessionBtn button').html("계정 삭제");
    $('.helpText').text('도움');
    $('.aboutText').text('설명');
    $('.devText').text('개발자');
    $('.setProfileImgView').text('프로필사진');
    $('#music').children('p').text('음악');
    $('#sport').children('p').text('스포츠');
    $('#game').children('p').text('게임');
    $('#party').children('p').text('파티');
    $('#study').children('p').text('독서');
    $('#art').children('p').text('미술');
    $('#movie').children('p').text('영화');
    $('#fashion').children('p').text('페션');
    $('main_text').text('당신의 취미는 무엇인가요?');
    $('#saveBtn').text('저장');
    $('#sendBtn').html('전송');

  }
  else if (language_code == 1)
  {
    $('.en').css('background-color', '#66A8CF');
    $('.en').css('color', 'white');
    console.log("set 영어");
    $('.mailView').text('Mail');
    $('.nameView').text('Name');
    $('.languageView').text('Language');
    $('.basic').text('Basic Setting');
    $('.secessionBtn button').html("Delete account");
    $('.helpText').text('Help');
    $('.aboutText').text('About');
    $('.devText').text('Developer');
    $('.setProfileImgView').text('Set Profile');
    $('#music').children('p').text('Music');
    $('#sport').children('p').text('Sport');
    $('#game').children('p').text('Game');
    $('#party').children('p').text('Party');
    $('#study').children('p').text('Study');
    $('#art').children('p').text('Art');
    $('#movie').children('p').text('Movie');
    $('#fashion').children('p').text('Fashion');
    $('.main_text').text('What is your hobby?');
    $('#saveBtn').text('save');
    $('#sendBtn').html('Send');
  }
  else if (language_code == 2)
  {
    $('.jp').css('background-color', '#66A8CF');
    $('.jp').css('color', 'white');
    $('.mailView').text('郵便物');
    $('.nameView').text('名前');
    $('.languageView').text('言語');
    $('.basic').text('デフォルトの設定');
    $('.secessionBtn button').html("脱退");
    $('.helpText').text('ヘルプ');
    $('.aboutText').text('について');
    $('.devText').text('開発者');
    $('.setProfileImgView').text('プロフィール');
    $('#music').children('p').text('音楽');
    $('#sport').children('p').text('スポーツ');
    $('#game').children('p').text('ゲーム');
    $('#party').children('p').text('パーティー');
    $('#study').children('p').text('調査');
    $('#art').children('p').text('アート');
    $('#movie').children('p').text('映画');
    $('#fashion').children('p').text('ファッション');
    $('.main_text').text('貴方の趣味は何ですか？')
    $('#saveBtn').text('セーブ');
    $('#sendBtn').html('送信');

  }
}
