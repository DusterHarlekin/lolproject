var circle = document.getElementById('progress-ring');
var radius = circle.r.baseVal.value;
var circumference = radius * 2 * Math.PI;
var winPercent = 80;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;





    setTimeout(function(){
       
        setProgress(winPercent);
 
        
    }, 1000);



function setProgress(percent) {
  const offset = circumference - percent / 100 * circumference;
  circle.style.strokeDashoffset = offset;
}