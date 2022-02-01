




function pageLoad()
{
    $('#new-user-first-name').css('background-color', 'blue');

    console.log( "IN USER LOGIN JS FILE ");    
}


window.addEventListener('load', (event) => {
    console.log('page is fully loaded');
    pageLoad();
  });
  