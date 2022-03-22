
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