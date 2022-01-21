function changeBackground()
{

   document.querySelector('#main-display-div').setAttribute("style", "background-color: lightBlue;");
   console.log('ran func');
}


window.addEventListener('load', (event) => {
  console.log('page is fully loaded');
  changeBackground();
});
