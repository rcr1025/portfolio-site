var root = document.querySelector(':root');
var rootStyles = getComputedStyle(root);
var projects = document.querySelector("html");
var snapMandatory = true;


const rgb1=rootStyles.getPropertyValue('--gradient1');
const rgb2=rootStyles.getPropertyValue('--gradient2');
const rgb3=rootStyles.getPropertyValue('--gradient3');
const rgb1x=rootStyles.getPropertyValue('--gradient1x');
const rgb2x=rootStyles.getPropertyValue('--gradient2x');
const rgb3x=rootStyles.getPropertyValue('--gradient3x');
const accent=rootStyles.getPropertyValue('--accent');
const accentx=rootStyles.getPropertyValue('--accentx');
const text1=rootStyles.getPropertyValue('--text1');
const text1x=rootStyles.getPropertyValue('--text1x');
const text2=rootStyles.getPropertyValue('--text2');
const text2x=rootStyles.getPropertyValue('--text2x');

console.log(text1x);

window.addEventListener('scroll', () =>{
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const gradientAngle=(45+(Math.ceil(scrolled)/5))+'deg';

    //lerp colors B*t+A(1-t)
    t=1-(scrolled/window.innerHeight);

    if (scrolled < (window.innerHeight-45))
    {
        // change css degree property for background
        root.style.setProperty('--degree', gradientAngle);

        //lerp background colors
        root.style.setProperty('--gradient1', 
        lerpColors(rgb1, rgb1x, t));

        root.style.setProperty('--gradient2', 
        lerpColors(rgb2, rgb2x, t));

        root.style.setProperty('--gradient3', 
        lerpColors(rgb3, rgb3x, t));

        //lerp text
        
        root.style.setProperty('--text1', 
        lerpColors(text1, text1x, t));

        root.style.setProperty('--text2', 
        lerpColors(text2, text2x, t));

        root.style.setProperty('--accent', 
        lerpColors(accent, accentx, t));
        


        //update background
        document.body.style.background = rootStyles.getPropertyValue('--gradient') + 'fixed';
        
        //update text
        document.body.style.color = rootStyles.getPropertyValue('--text1');

    }

    else if( scrolled >= (window.innerHeight-45)){

        // set scroll snap style to proximity style scroll-snapping if mandatory style
        if (snapMandatory == true){

            //stop scroll snap
            projects.style.setProperty("scroll-snap-type", "none");

            //timer to avoid jankyness when transitioning
            setTimeout(() => {
                projects.style.setProperty("scroll-snap-type", "y proximity");
            }, "1000")

            //gate style once applied
            snapMandatory = false;
        }
    }
})



function lerpColors(rgbB,rgbA, t) {
    //cast rgb values to int arrays 
    rgbB = rgbB.match(/\d+/g).map(Number);
    rgbA = rgbA.match(/\d+/g).map(Number);

    //lerp colors B*t+A(1-t)
    for(let i=0; i < rgbB.length; i++) {
        rgbB[i] = Math.ceil( rgbB[i]*t + rgbA[i]*(1-t) );
    }

    //convert array int back to rgb value
    rgbB = "rgb(" 
        + rgbB[0] + ", " 
        + rgbB[1] + ", " 
        + rgbB[2] + ")";
    
    //return rgb value
    return rgbB;
}












// start page on top after refresh
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }