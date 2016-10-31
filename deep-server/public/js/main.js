var open;
var bodyChecked;
$(window).load(function(){
  open = true;
  bodyChecked = false;
  reset();
  $(document).on('click', '.nav_app a', function(event){
      console.log(event.target.id);

      if(event.target.id == "home")
      {
        var className =  $('body').attr('class')
        $('body').removeClass(className)
        $('body').toggleClass('homePage')

      }
      else if (event.target.id == "profile")
      {
        var className =  $('body').attr('class')
        $('body').removeClass(className)
        $('body').toggleClass('profilePage')
      }
      else if (event.target.id == "message")
      {
        var className =  $('body').attr('class')
        $('body').removeClass(className)
        $('body').toggleClass('messagesPage')
      }
      else if (event.target.id == "setting")
      {
        var className =  $('body').attr('class')
        $('body').removeClass(className)
        $('body').toggleClass('settingsPage')
      }
      history.pushState(null, null, event.target.href);
      $('article').load(event.target.href+' article>.main');
      event.preventDefault();
  });
  $(window).on('popstate', function(event){
    console.log(location);
    var className =  $('body').attr('class')
    var addClass = location.pathname;
    addClass = addClass.replace('/', '');
    $('body').removeClass(className);
    $('body').toggleClass(addClass + 'Page')
    $('article').load(location.href+' article>.main');

  });
  $(document).on('click','.box',function(){
    if($(this).children('img').css('display') == 'none'){
      $(this).children('img').show();
    }
    else{
      $(this).children('img').hide();
    }
  })
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
  }

}
