

var timer;

// Make sure your container is set to flex and justify-content-center for this to look right!
function createPopup( message, targetID='popup-container', color='#19E412', fontSize = 30, decreaseOpacity=.03)
{
  $('.fading-popup').remove(); // remove old popups.

  clearInterval(timer); // remove old timers.

  var opacity = 1;

  $(`#${targetID}`).append(`<div class="fading-popup w-75" style="background-color: ${color}; font-size: ${fontSize}px; padding:10px; display: flex; justify-content: center; border-radius: 10px;"> <div><strong>${message}</strong> </div> </div>`);

  timer = setInterval( ()=>{
        if( opacity > 0)
        {
          console.log(`Adjusting opacity`);
          opacity -= decreaseOpacity;
          $('.fading-popup').css('opacity', opacity);
        }
        else
        {
          console.log(`Killing timer`);
          $('.fading-popup').remove();
          clearInterval(timer)
        }
      }, 100 );

}



var warningTimer;

// Make sure your container is set to flex and justify-content-center for this to look right!
function createWarningPopup( message, targetID='warning-popup-container', color='#BC1F43', fontSize = 30)
{
  $('.warning-popup').remove(); // remove old popups.

  

  $(`#${targetID}`).append(`<div class="warning-popup w-100" style="background-color: ${color}; font-size: ${fontSize}px; padding:10px; display: flex; justify-content: center; border-radius: 10px;"> <div><strong>${message}</strong> </div> </div>`);

  // Animation library
  anime({
    targets: '.warning-popup',
    rotate: '3',
    duration: 100,
    easing: 'cubicBezier(.5, .05, .1, .3)',
    complete: function(val){
      anime({
        targets: '.warning-popup',
        rotate: '-3',
        duration: 100,
        easing: 'cubicBezier(.5, .05, .1, .3)',
        complete:(val=>{
          anime({
            targets: '.warning-popup',
            //background: color,
            rotate: '0',
            duration: 100,
            easing: 'cubicBezier(.5, .05, .1, .3)'})
        })
      })
    }
  });

  anime({
    targets: '.warning-popup',
    duration: 2000,
    background: ['#FFF7FA', color ]
  });


}