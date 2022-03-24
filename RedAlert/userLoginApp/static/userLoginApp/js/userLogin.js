




function pageLoad()
{
    $('.label-input-cont > input').addClass('form-control');

    console.log( "IN USER LOGIN JS FILE "); 
    
    $("#logout-button").remove();
}


window.addEventListener('load', (event) => {
    console.log('page is fully loaded');
    pageLoad();
  });
  