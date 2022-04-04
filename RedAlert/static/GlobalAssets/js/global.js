

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
function createClosablePopup( message="No msg provided", targetID='closable-popup-container', color='#BC1F43', fontSize = 30)
{
  $('.closable-popup').remove(); // remove old popups.

  console.log(`Creating popup target id is ${targetID}`);

  $(`#${targetID}`).append(`<div class="closable-popup w-100" style="background-color: ${color}; font-size: ${fontSize}px; padding:10px; display: flex; justify-content: center; border-radius: 10px;"> <div><strong>${message}</strong> </div> </div>`);

  // Animation library
  anime({
    targets: '.closable-popup',
    rotate: '3',
    duration: 100,
    easing: 'cubicBezier(.5, .05, .1, .3)',
    complete: function(val){
      anime({
        targets: '.closable-popup',
        rotate: '-3',
        duration: 100,
        easing: 'cubicBezier(.5, .05, .1, .3)',
        complete:(val=>{
          anime({
            targets: '.closable-popup',
            //background: color,
            rotate: '0',
            duration: 100,
            easing: 'cubicBezier(.5, .05, .1, .3)'})
        })
      })
    }
  });

  anime({
    targets: '.closable-popup',
    duration: 2000,
    background: ['#FCFCFC', color ]
  });


}