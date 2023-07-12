var root = document.querySelector(':root');

var rootStyles = getComputedStyle(root);
var projects = document.querySelector("html");
var snapMandatory = true; // gate to remove hard snapping between sections
var lerpGate=false; //gate incomplete lerping so that it only triggers scrolling down

const rgb1=rootStyles.getPropertyValue('--gradient1');
const rgb2=rootStyles.getPropertyValue('--gradient2');
const rgb3=rootStyles.getPropertyValue('--gradient3');
const rgb1x=rootStyles.getPropertyValue('--gradient1x');
const rgb2x=rootStyles.getPropertyValue('--gradient2x');
const rgb3x=rootStyles.getPropertyValue('--gradient3x');
const rgb1x2=rootStyles.getPropertyValue('--gradient1x2');
const rgb2x2=rootStyles.getPropertyValue('--gradient2x2');
const rgb3x2=rootStyles.getPropertyValue('--gradient3x2');
const rgb1x3=rootStyles.getPropertyValue('--gradient1x3');
const rgb2x3=rootStyles.getPropertyValue('--gradient2x3');
const rgb3x3=rootStyles.getPropertyValue('--gradient3x3');


const accent=rootStyles.getPropertyValue('--accent');
const text1=rootStyles.getPropertyValue('--text1');
const text2=rootStyles.getPropertyValue('--text2');
const accentx=rootStyles.getPropertyValue('--accentx');
const text1x=rootStyles.getPropertyValue('--text1x');
const text2x=rootStyles.getPropertyValue('--text2x');
const accentx2=rootStyles.getPropertyValue('--accentx2');
const text1x2=rootStyles.getPropertyValue('--text1x2');
const text2x2=rootStyles.getPropertyValue('--text2x2');

//turn on snap mandatory after initial page transition
setTimeout(() => {
    if(snapMandatory) projects.style.setProperty("scroll-snap-type", "y mandatory");
}, "1000")

window.addEventListener('scroll', () =>{
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    var gradientAngle;

    if (scrolled <= (window.innerHeight-45))
    {
        lerpGate=false;

        // change css degree property for background
        gradientAngle=(45+(Math.ceil(scrolled)/5))+'deg';
        root.style.setProperty('--degree', gradientAngle);
  

        //set time to amount scrolled within top windowheight 
        t=1-(scrolled/window.innerHeight); 
 
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

        if(scrolled >= (scrollable-(2*window.innerHeight))){
            lerpGate=true;
            t=((scrollable-scrolled)/(2*window.innerHeight));
            

            //lerp gradient 1
            root.style.setProperty('--gradient1', 
            lerpColors(rgb1x, rgb1x3, t));

            
            if(scrolled >= (scrollable-window.innerHeight)){

                //lerp change 3 
                t=((scrollable-scrolled)/window.innerHeight);

                //lerp background colors
                root.style.setProperty('--gradient2', 
                lerpColors(rgb2x2, rgb1x3, t));
    
                root.style.setProperty('--gradient3', 
                lerpColors(rgb3x2, rgb1x3, t));

                 //lerp text
                 root.style.setProperty('--text1', text1x);

                 root.style.setProperty('--text2', text2x);

                 root.style.setProperty('--accent', accentx);

                var dis=2;

                if(scrolled >= (scrollable-(window.innerHeight/dis))){
                    
                    t=((scrollable-scrolled)/(window.innerHeight/dis));

                    //lerp text
                    root.style.setProperty('--text1', 
                    lerpColors(text1x, text1x2, t));

                    root.style.setProperty('--text2', 
                    lerpColors(text2x, text2x2, t));

                    root.style.setProperty('--accent', 
                    lerpColors(accentx, accentx2, t));
                }   
            }

            else if(scrolled >= (scrollable-(window.innerHeight*2))){
                //lerp change 2 
                t=((scrollable-scrolled)/(window.innerHeight))-1;

                //lerp background colors     
                root.style.setProperty('--gradient2', 
                lerpColors(rgb2x, rgb2x2, t));
    
                root.style.setProperty('--gradient3', 
                lerpColors(rgb3x, rgb3x2, t));
            }  
        } 
        //complete 1st incomplete lerps to avoid awkward jump
        else{
            if(t>0 && lerpGate==false)
            {
                root.style.setProperty('--gradient1', 
                lerpColors(rgb1, rgb1x, t));

                root.style.setProperty('--gradient2', 
                lerpColors(rgb2, rgb2x, t));

                root.style.setProperty('--gradient3', 
                lerpColors(rgb3, rgb3x, t));
                t=t-0.005;
            }
        }
    }
    
    //update background
    document.body.style.background = rootStyles.getPropertyValue('--gradient') + 'fixed';
        
    //update text
    document.body.style.color = rootStyles.getPropertyValue('--text1');

})


// lerp colors B*t+A(1-t)
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


// observe area for elements awaiting to transition in
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting)
            entry.target.classList.add('show');
        else {
            //remove 'hero_content from transitions list'
            if(entry.target.className === "hero_content hidden show")
                entry.target.classList.remove('hidden');
            
            entry.target.classList.remove('show');
        }
    });
});

// Trigger transition effects on hidden elements
const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));


// start page on top after refresh
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }