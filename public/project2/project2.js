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

function horizontalTranslation(n) {
    var tip = document.getElementById('tip');
    var tipPosition = tip.getBoundingClientRect();
    
    var tip2 = document.createElement("div");
    tip2.className = "tip2";
    tip2.id = "tip2";
    tip2.style.position = "fixed";

    var position = $(document.getElementById('tip')).offset();
    $(tip2).css({
        top: tipPosition.y,
        left: tipPosition.x+n
    });

    document.getElementById("window").appendChild(tip2);

    inverseKinematics();
}

function inverseKinematics() {
    var found = false;
    var tip = document.getElementById('tip');
    var tip2 = document.getElementById('tip2');
    var current_coord = 0;
    var target = tip2.getBoundingClientRect();

    var l1 = document.getElementById("link1").clientWidth;
    var l2 = document.getElementById("link2").clientWidth;
    var l3 = document.getElementById("link3").clientWidth;

    var theta1 = 0;
    var theta2 = 0;
    var theta3 = 0;


    for(theta1 = 0; theta1 <= 90; theta1++) {
        for(theta2 = 0; theta2 <= 90; theta2++) {
            for(theta3 = -90; theta3 <= 90; theta3++) {
                console.log(l1*Math.cos(theta1)+l2*Math.cos(l2)+l3*Math.cos(l3));
            }
        }
    }

    // while(found == false) {
    //     while(found == false) {
    //         while(found == false) {
    //             current_coord = tip.getBoundingClientRect();
    //             if(current_coord.x === target.x && current_coord.y === target.y) {
    //                 found = true;
    //             }
    //             theta3++;
    //         }
    //         theta2++;
    //     }
    //     theta1++;
    // }
}

// function verticalTranslation(n) {
//     var tip = document.getElementById('tip');
//     var tipPosition = tip.getBoundingClientRect();
    
//     if(n < 0) {
//         offsetVert += 1;
//     } else {
//         offsetVert -= 1;
//     }

//     var newTop = tipPosition.top + n;    
//     tip.style.top = newTop-(tipPosition.top+offsetVert)+6+"px";

//     var tipPosition = tip.getBoundingClientRect();
// }

// function horizontalTranslation(n) {
//     var tip = document.getElementById('tip');
//     var tipPosition = tip.getBoundingClientRect();
    
//     if(n < 0) {
//         offsetHor += 1;
//     } else {
//         offsetHor -= 1;
//     }

//     var newLeft = tipPosition.left + n;    
//     tip.style.left = newLeft-(tipPosition.left+offsetHor)+75+"px";
    
//     var tipPosition = tip.getBoundingClientRect();

//     inverseKinematics(tipPosition.x, tipPosition.y);
// }

// function stopTranslation() {

// }

// function inverseKinematics(x_tip, y_tip) {
    
//     var found = false;
    
//     //Length of each links
//     var link1 = document.getElementById("link1").clientWidth;
//     var link2 = document.getElementById("link2").clientWidth;
//     var link3 = document.getElementById("link3").clientWidth;

//     //The X and Y location of the base
//     var base = document.getElementById("base-pos");
//     var basePosition = base.getBoundingClientRect();
//     var x_base = basePosition.x;
//     var y_base = basePosition.y;

    

//     // while(found == false) {
//     //     while(found == false) {
//     //         while(found == false) {

//     //         }
//     //     }
//     // }
// }

/********************************************************************* RESOURCES
    https://css-tricks.com/almanac/properties/t/transform-origin/
    https://css-tricks.com/get-value-of-css-rotation-through-javascript/
    https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
    https://stackoverflow.com/questions/15505272/javascript-while-mousedown
    https://stackoverflow.com/questions/19574171/how-to-get-css-transform-rotation-value-in-degrees-with-javascript
    https://www.useragentman.com/blog/2011/01/07/css3-matrix-transform-for-the-mathematically-challenged/
    https://www.w3schools.com/jsref/event_onkeypress.asp
*/