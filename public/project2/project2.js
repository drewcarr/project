var links;
var buttons;
var turn;
var paint;
var currentlyPainting;
var instructions;

var offsetVert = 0;
var offsetHor = 0;

window.onload = function(){
    links = document.getElementsByClassName("link");
    buttons = document.getElementsByClassName("b");
    instructions = document.getElementsByClassName("instructions");
    instructions[0].style.display = "block";
    instructions[1].style.display = "none";
    this.currentlyPainting = false;
}

function getCurrentAngle(link) {
    // Getting the the css style set of a specific link from the html document
    var styleSet = window.getComputedStyle(link);

    // Getting the the css value of "transform" from the styleSet
    var matrix = styleSet.getPropertyValue('transform');

    /*
        - Generating an array of values from matrix
            - matrix holds the value "matrix(i, j, k, l)"
            - We want it in the form of [i, j, k, l]
        - To do this, we treat the value of matrix as a string and split accordingly
            - split() creates an array that splits given a delimeter
        - The first split results in ["matrix", "i,j,l)"]
            - We only want to further split the values in the second index
        - The second split results in ["i,j,k,l"]
            - In this case, it will only be one index b/c there are no strings after ")"
        - The last split has the char "," as the delimeter
            - Resulting array is [i, j, k, l]
    */
    var splitting = matrix.split("(")[1];
        splitting = splitting.split(")")[0];
        splitting = splitting.split(",")

    /*
        To get the angle of the link, we need to calculate the value of arcsin(j)
        and multiply it with (180/Pi) to get the resulting answer in degrees
        instead of radians
    */  
    var angle = Math.round(Math.atan2(splitting[1],splitting[0]) * (180/Math.PI));

    return angle;

}

function incrementCurrentAngle(link, currentAngle, increment) {
    var deg = currentAngle + increment;
    var newCSS = "\
    -webkit-transform: rotate("+deg+"deg); \
    -moz-transform: rotate("+deg+"deg); \
    -ms-transform: rotate("+deg+"deg); \
    -o-transform: rotate("+deg+"deg); \
    transform: rotate("+deg+"deg); \
    ";

    link.style.cssText = newCSS;
}

function counterClockwise(n) {
    turn=setInterval(function() {
        var link = links[n];
        var angle = getCurrentAngle(link);
        incrementCurrentAngle(link, angle, -1);
    }, 20);
}

function clockwise(n) {
    turn=setInterval(function() {
        var link = links[n];
        var angle = getCurrentAngle(link);
        incrementCurrentAngle(link, angle, 1);
    }, 20);
}

function stopTurn() {
    if (turn) clearInterval(turn);
}

function bloop() {
    if(!currentlyPainting) {
        currentlyPainting = true;
        instructions[0].style.display = "none";
        instructions[1].style.display = "block";
        paint=setInterval(function() {
            var dot = document.createElement("div");
            dot.className = "circle";
            dot.style.position = "absolute";
        
            var position = $(document.getElementById('tip')).offset();
            var new_pos = $(dot).css(position)
        
            var x = new_pos.left;
            var y = new_pos.top;
        
            dot.style.top = y;
            dot.style.left = x;
        
            document.getElementById("window").appendChild(dot);
        }, 10);
    } else {
        currentlyPainting = false;
        instructions[0].style.display = "block";
        instructions[1].style.display = "none";
        clearInterval(paint);
    }
}

// function horizontalTranslation(n) {
//     var tip = document.getElementById('tip');
//     var tipPosition = tip.getBoundingClientRect();
    
//     var tip2 = document.createElement("div");
//     tip2.className = "tip2";
//     tip2.id = "tip2";
//     tip2.style.position = "fixed";

//     var tipPosition = $(document.getElementById('tip')).offset();
//     $(tip2).css({
//         top: tipPosition.y,
//         left: tipPosition.x+n
//     });

//     document.getElementById("window").appendChild(tip2);

//     inverseKinematics();
// }

// function inverseKinematics() {
//     var found = false;
//     var tip = document.getElementById('tip');
//     var tip2 = document.getElementById('tip2');
//     var current_coord = 0;
//     var target = tip2.getBoundingClientRect();

//     var l1 = document.getElementById("link1").clientWidth;
//     var l2 = document.getElementById("link2").clientWidth;
//     var l3 = document.getElementById("link3").clientWidth;

//     var theta1 = 0;
//     var theta2 = 0;
//     var theta3 = 0;
// }

function verticalTranslation(n) {
    var tip = document.getElementById('tip');
    var tipPosition = tip.getBoundingClientRect();
    
    if(n < 0){
        offsetVert+=1;
    } else {
        offsetVert-=1;
    }

    var newTop=tipPosition.top + n;
    tip.style.top=newTop-(tipPosition.top+offsetVert)+6+"px";
    var tipPosition=tip.getBoundingClientRect();
}

function horizontalTranslation(n) {
    var tip = document.getElementById('tip');
    var tipPosition = tip.getBoundingClientRect();
    
    if(n<0) {
        offsetHor += 1;
    } else {
        offsetHor -= 1;
    }
    
    var newLeft = tipPosition.left + n;
    tip.style.left = newLeft-(tipPosition.left+offsetHor)+75+"px";
    
    var tipPosition = tip.getBoundingClientRect();
    inverseKinematics(tipPosition.x, tipPosition.y);
}
    
function stopTranslation() {
    
}
    
function inverseKinematics(x_tip, y_tip) {

    //Length of each links
    var link1 = document.getElementById("link1").clientWidth;
    var link2 = document.getElementById("link2").clientWidth;
    var link3 = document.getElementById("link3").clientWidth;
    
    //The X and Y location of the base
    var base = document.getElementById("base-pos");
    var basePosition = base.getBoundingClientRect();
    var x_base = basePosition.x;
    var y_base = basePosition.y;
    
    console.log("x_base:", x_base, "y_base:", y_base, "x_tip:", x_tip, "y_tip:", y_tip);
    
    //Desired position of end effector
    var px = (Math.abs(x_base-x_tip)-8.8125);
    var py = (Math.abs(y_base-y_tip)- 4.1875);

    console.log(px);
    console.log(py);
    
    //Inverse Kinematics
    var count = 0;
    var phi = 0;
    var delta_x = 0;
    var delta_y = 0;
    var delta = 0;
    var c2 = 0;
    var list_of_phis = [];
    var list_of_c2s = [];
    
    while(count < 360) {
        count++;
        phi++;
        phi2 = phi*(Math.PI/180)
        delta_x = px - link3*Math.cos(phi2);
        delta_y = py - link3*Math.sin(phi2);
        delta = Math.pow(delta_x, 2) + Math.pow(delta_y, 2);
        
        c2 = (delta - Math.pow(link1, 2) - Math.pow(link2, 2)) / (2*link1*link2);
        
        if(c2 <= 1 && c2 > 0) {
            list_of_phis.push(phi);
            list_of_c2s.push(c2);
        }
    }
        
    var length_of_list_of_phis = list_of_phis.length;
    
    if(length_of_list_of_phis % 2 == 0) {
        phi = list_of_phis[(length_of_list_of_phis-1)/2];
        c2 = list_of_c2s[(length_of_list_of_phis-1)/2];
    } else {
        phi = list_of_phis[((length_of_list_of_phis+1)/2)-1];
        c2 = list_of_c2s[((length_of_list_of_phis+1)/2)-1];
    }
    
    delta_x = px - link3*Math.cos(phi);
    delta_y = py - link3*Math.sin(phi);
    delta = Math.pow(delta_x, 2) + Math.pow(delta_y, 2);
    
    console.log(list_of_phis);
    console.log(list_of_c2s);
    console.log(phi);
    console.log(c2);
    
    //console.log("delta_x:", delta_x, "delta_y:", delta_y, "delta:", delta);
    var s2 = Math.sqrt(1-Math.pow(c2, 2));
    var theta_2 = Math.atan2(s2, c2);
    
    //console.log("c2:",c2,"s2:",s2, "theta_2", theta_2);
    
    var s1 = ((link1+(link2*c2))*delta_y - link2*s2*delta_y) / delta;
    var c1 = ((link1+(link2*c2))*delta_x - link2*s2*delta_x) / delta;
    var theta_1 = Math.atan2(s1, c1);
    
    //console.log("s1:", s1, "c1:", c1, "theta_1", theta_1);
    var theta_3 = phi-theta_1-theta_2;
    
    theta_1 = theta_1 * (180/Math.PI);
    theta_2 = theta_2 * (180/Math.PI);
    theta_3 = theta_3 * (180/Math.PI);
    
    console.log("theta_1", theta_1, "theta_2", theta_2, "theta_3:", theta_3);
    
    changeAngles(theta_1, theta_2, theta_3);
}

function changeAngles(theta_1, theta_2, theta_3) {
    var joint1css = "\
    -webkit-transform: rotate("+theta_1+"deg); \
    -moz-transform: rotate("+theta_1+"deg); \
    -ms-transform: rotate("+theta_1+"deg); \
    -o-transform: rotate("+theta_1+"deg); \
    transform: rotate("+theta_1+"deg); \
    ";
    
    var joint2css = "\
    -webkit-transform: rotate("+theta_2+"deg); \
    -moz-transform: rotate("+theta_2+"deg); \
    -ms-transform: rotate("+theta_2+"deg); \
    -o-transform: rotate("+theta_2+"deg); \
    transform: rotate("+theta_2+"deg); \
    ";
    
    var joint3css = "\
    -webkit-transform: rotate("+theta_3+"deg); \
    -moz-transform: rotate("+theta_3+"deg); \
    -ms-transform: rotate("+theta_3+"deg); \
    -o-transform: rotate("+theta_3+"deg); \
    transform: rotate("+theta_3+"deg); \
    ";
    
    links[0].style.cssText = joint1css;
    links[1].style.cssText = joint2css;
    links[2].style.cssText = joint3css;
}
    
/********************************************************************* RESOURCES
    https://css-tricks.com/almanac/properties/t/transform-origin/
    https://css-tricks.com/get-value-of-css-rotation-through-javascript/
    https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
    https://stackoverflow.com/questions/15505272/javascript-while-mousedown
    https://stackoverflow.com/questions/19574171/how-to-get-css-transform-rotation-value-in-degrees-with-javascript
    https://www.useragentman.com/blog/2011/01/07/css3-matrix-transform-for-the-mathematically-challenged/
    https://www.w3schools.com/jsref/event_onkeypress.asp
************************************************************************/
