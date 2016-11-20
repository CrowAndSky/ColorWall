'use strict';
/* ------------------ ###### ---------------------*/
/* -- ###### --*/

$( document ).ready(  function(){
/* ------------------ ### Important Objects ### ------------------
animationChangeQueue: Array of DOM adjustments that should be made with the next animation loop
newLocation, currentPositionalIndex: Unique 2D location indexes calculated by row number * 100 + column number
    This will only work, of course, if there are less than 100 columns
Chip positonal arrays are ordered as such: 'nw', 'n', 'ne', 'w', 'active', 'e', 'sw', 's', 'se', 'default Chip'
    and the positional index adjustments are: -101, -100, -99, -1, 0, 1, 99, 100, 101
*/

/* ------------------ ### How the Whole Thing Works ( at a glance ) ### ------------------
1) Call setPixelDimensions() sets JS vars based on DOM dimensions
2) Attach mousemove listener on the transparent, top level EL which exists just for that purpose, call back function is handleGridCursorMove()
3) The handleGridCursorMove function determines if we've moved to a new node. If we have:
    a) Call processLocationChange()
    b) Begin a RA animation loop if one isn't already running
    c) Expire stale JS chip objects and remove stale DOM chips
4) The processLocationChange function determines which compass direction we have moved to and calls updateAnimationChangeQueue() with the
    appropriate array of changes to make to the animationChangeQueue based on the change direction
5) Once per RA loop, the chipAnimation function goes through the animationChangeQueue array and makes DOM updates from it
*/

/* ------------------ ### TO DO NEXT ### ------------------
Will it be faster to set a 3D transform on elements, instead of top, left, and size?

* Break out step delta calculation into a separate function (from line 2011)
* Clean up adding new locationHistory for new chips ( line 339 )
------------------ ###### ---------------------*/


 /* -------------------- INIT VARIABLES ---------------------*/
var /*--------------------- ### DOM elements ### ---------------------*/
    /*--- TO DO HERE:
        set these to native selectors and fix wrapper offset
        document.getElementById(  );
     ---*/
    $console = $( "#console" ),
    $mouseListener = $( "#mouse-listener" ),
    $chipWrapper = $( '#chip-wrapper' ),
    $wrapper = $( "#wrapper" ),
    //wrapperOffset = $wrapper.offset(),
    wrapperOffset = 0;
    $activeChip = $( '#init-chip' ), /* This prevents first call from failing, saves having to do that logic everytime */

    /*--------------------- ### Initially Empty ### ---------------------*/
    locationHistory = [], /* VALUES: chipID, Natural Left, Current Left, Natural Top, Current Top, Current Size */
    currentChipRow = 0,
    currentChipColumn = 0,
    newLocation = 0,
    lastLocation = 0,

    /*--------------------- ### Layout Related ### ---------------------*/
    canvasChipXCount = 50, /* WWWWW */
    smallChipSize,
    mediumChipSize,
    mediumChipLeftOffset,
    mediumChipTopOffset,
    largeChipSize,
    largeChipOffset,
    largeChipLeftOffset,
    largeChipTopOffset,

    /*--------------------- ### Arrays of Constants ### ---------------------*/
    /* Chip positonal arrays are ordered as such: 'nw', 'n', 'ne', 'w', 'active', 'e', 'sw', 's', 'se', 'default Chip'
        and the positional index adjustments are: -101, -100, -99, -1, 0, 1, 99, 100, 101 */
    // chipPositionalClasses = ['nw','n','ne','w','active','e','sw','s','se'],
    // chipPositionalIndexAdjustments = [-101,-100,-99,-1,0,1,99,100,101],
    chipPositionalLeftAdjustments = [],
    chipPositionalTopAdjustments = [],
    chipPositionalIndexAdjustments = [-101,-100,-99,-1,0,1,99,100,101],
    chipPositionalLeftAdjustments = [-chipSize,0,chipSize,-chipSize,0,chipSize,-chipSize,0,chipSize],
    chipPositionalTopAdjustments = [-chipSize,-chipSize,-chipSize,0,0,0,chipSize,chipSize,chipSize],

    /* CLOSE INIT VARIABLES */

    setPixelDimensions = function( event ) {
        /* -------------------- ### TO DO HERE: pass raw (not calculated) values into each assigment ### ---------------------*/
        $wrapper.height( Math.round( $wrapper.width() * 0.56 ));
        $mouseListener.height( Math.round( $wrapper.width() * 0.56 ));
        canvasChipXCount = 50; /* The number of columns in the Color Wall */
        smallChipSize = Math.round( $wrapper.width() / canvasChipXCount );
        mediumChipSize = Math.round( smallChipSize * 2.5 );
        mediumChipLeftOffset = Math.round( smallChipSize *  0.95238 );
        mediumChipTopOffset = Math.round( smallChipSize * 0.95238 );
        largeChipSize = Math.round( smallChipSize * 5 );
        largeChipOffset = Math.round( smallChipSize * 1.25 );
        largeChipLeftOffset = Math.round( smallChipSize * 1.25 );
        largeChipTopOffset = Math.round( smallChipSize * 1.25 );

        /* Chip positonal arrays are ordered as such: 'nw', 'n', 'ne', 'w', 'active', 'e', 'sw', 's', 'se', 'default Chip' */
        chipPositionalLeftAdjustments = [ -mediumChipLeftOffset, 0, mediumChipLeftOffset, -mediumChipLeftOffset, -largeChipLeftOffset, mediumChipLeftOffset, -mediumChipLeftOffset, 0, mediumChipLeftOffset, 0 ];
        chipPositionalTopAdjustments = [ -mediumChipTopOffset, -mediumChipTopOffset, -mediumChipTopOffset, 0, -largeChipLeftOffset, 0, mediumChipTopOffset, mediumChipTopOffset, mediumChipTopOffset, 0 ];
    },

    /* ------------------ ### Handling Cursor Movement ### ------------------ */
    handleGridCursorMove = function( Xpos, Ypos ) {
        /* Will need to roll back to these when I'm done passing explicit coordiantes during testing */
        // currentChipRow = Math.floor( ( event.pageY - wrapperOffset.top ) / smallChipSize );
        // currentChipColumn = Math.floor( ( event.pageX - wrapperOffset.left ) / smallChipSize );
        window.currentChipRow = Math.floor( ( Ypos ) / smallChipSize );
        window.currentChipColumn = Math.floor( ( Xpos ) / smallChipSize );
        newLocation = window.currentChipRow * 100 + window.currentChipColumn;

        if ( newLocation !== lastLocation ) { /*--- Only update everything if we have moved enough to have gone from one chip to another. ---*/
            processLocationChange( newLocation , lastLocation );

            /*--------------------- ### START Once per location update ### ---------------------
                Remove 'expired' members of the JS object and DOM tree that we consider collectively to be the app cache.
                Essentially, we allow about 12 moves in the color wall before we beginning expiring the original elements
            */
            lastLocation = newLocation;  /* -- So that we're ready for the next new location --*/

            var locationsToExpireCount = locationHistory.length - 120;
            if ( locationsToExpireCount > 0 ) {
                for ( var i = locationsToExpireCount; i > 0; i-- ) {
                    var element = document.getElementById( 'chip' + locationHistory[ 0 ] );
                    element.parentNode.removeChild(element);
                    locationHistory.shift();
                }
            }
        } /* END if ( newLocation !== lastLocation ) */
    }, /* END handleGridCursorMove() */

    processLocationChange = function( newLocation, lastLocation ) {
        /* ------------------ ### Start an animation loop or update chip related data ### ------------------*/
        //var chipIndexDelta = newLocation - lastLocation; /* -- Expresses the direction we moved in --*/

        // switch ( chipIndexDelta ) {
        //     /* For each chip affected by the cursor move, we pass:
        //         Chip ID of all the affected chip, calculated from the difference to the previous active chip;
        //         new left offset, new top offset, new size, new cardinal position index */
        //     case -1 : /* -- moved to the West --*/ /*--- wwwww ---*/
        //         updateAnimationChangeQueue( [
        //             lastLocation - 102, chipPositionalLeftAdjustments[0], chipPositionalTopAdjustments[0], mediumChipSize, 0,
        //             lastLocation - 101, chipPositionalLeftAdjustments[1], chipPositionalTopAdjustments[1], mediumChipSize, 1,
        //             lastLocation - 100, chipPositionalLeftAdjustments[2], chipPositionalTopAdjustments[2], mediumChipSize, 2,
        //             lastLocation - 2, chipPositionalLeftAdjustments[3], chipPositionalTopAdjustments[3], mediumChipSize, 3,
        //             lastLocation - 1, chipPositionalLeftAdjustments[4], chipPositionalTopAdjustments[4], largeChipSize, 4,
        //             lastLocation - 0, chipPositionalLeftAdjustments[5], chipPositionalTopAdjustments[5], mediumChipSize, 5,
        //             lastLocation + 98, chipPositionalLeftAdjustments[6], chipPositionalTopAdjustments[6], mediumChipSize, 6,
        //             lastLocation + 99, chipPositionalLeftAdjustments[7], chipPositionalTopAdjustments[7], mediumChipSize, 7,
        //             lastLocation + 100, chipPositionalLeftAdjustments[8], chipPositionalTopAdjustments[8], mediumChipSize, 8,
        //             lastLocation - 99, chipPositionalLeftAdjustments[9], chipPositionalTopAdjustments[9], mediumChipSize, 9,
        //             lastLocation + 1, chipPositionalLeftAdjustments[9], chipPositionalTopAdjustments[9], mediumChipSize, 9,
        //             lastLocation + 101, chipPositionalLeftAdjustments[9], chipPositionalTopAdjustments[9], mediumChipSize, 9
        //         ] );
        //         break;

        //     default:
        //         break;
        // }

        /*--- TO DO HERE:
            handle when throttling has cuased us to skip a chip and we need to wind donw the last location, using thse params:
            newLocation - lastLocation
        ---*/

        var thisHorizTransform,
            thisVertTransform,
            thisSizeTransform;



        for (var i = 0; i < chipPositionalClasses.length; i++) {
            var currentPositionalIndex = newLocation + chipPositionalIndexAdjustments[i],
                /* REFerence thisTransform = "matrix3d( X scale, 0, 0.00, 0, 0.00, Y scale, 0.00, 0, 0, 0, 1, 0, X translate, Y translate, 0, 1);  */
                thisTransform = "matrix3d( X scale, 0, 0.00, 0, 0.00, Y scale, 0.00, 0, 0, 0, 1, 0, X translate, Y translate, 0, 1);
            // thisHorizTransform = chipPositionalLeftAdjustments[ i ],
            // thisVertTransform = chipPositionalTopAdjustments[ i ];
            // thisTransform = chipPositionalLeftAdjustments[ i ],
            // thisVertTransform = chipPositionalTopAdjustments[ i ];
            // thisSizeTransform = [ i ];

            if ( i = 4) {
                //mediumChipSize
                // 'translate3d(' + thisHorizTransform + 'px, ' + thisVertTransform  + 'px, 0px)'
                // var newChip = $( '<div class="chip" id="chip' + currentChipPositionalIndex +'" style="transform: translate3d(' + thisHorizTransform + 'px, ' + thisVertTransform  + 'px, 0px);left:' + window.currentChipColumn * smallChipSize + 'px;top:' + window.currentChipRow * smallChipSize + 'px;"></div>' );
                thisTransform = "matrix3d( 2, 0, 0.00, 0, 0.00, 2, 0.00, 0, 0, 0, 1, 0, " + chipPositionalLeftAdjustments[ i ] + ", " + thisVertTransform = chipPositionalTopAdjustments[ i ] + ", 0, 1);
            } else {
                thisTransform = "matrix3d( 4, 0, 0.00, 0, 0.00, 4, 0.00, 0, 0, 0, 1, 0, " + chipPositionalLeftAdjustments[ i ] + ", " + thisVertTransform = chipPositionalTopAdjustments[ i ] + ", 0, 1);
            }

            if ( locationHistory.indexOf( currentChipPositionalIndex ) >= 0 ) {
                console.log("it IS in the locationHistory");
                document.getElementById( 'chip' + currentChipPositionalIndex ).style.transform = thisTransform;
            } else {
                console.log("it's NOT in the locationHistory");
                var newChip = $( '<div class="chip" id="chip' + currentChipPositionalIndex +'" style="transform: ' + thisTransform  + ';left:' + window.currentChipColumn * smallChipSize + 'px;top:' + window.currentChipRow * smallChipSize + 'px;"></div>' );
                $chipWrapper.innerHTML += newChip;
                locationHistory.push( currentChipPositionalIndex );
            }
        }
    },

    // updateAnimationChangeQueue = function( chipUpdateArray ) {
    //     /* ------------------ ### Start an animation loop or update chip related data ### ------------------
    //         wwwwwwww
    //     /* ------------------ ###### ---------------------*/
    //     var chipNotLocationHistory,
    //         currentChipPositionalIndex,
    //         x = 0;

    //     for ( var i = 0; i < chipUpdateArray.length; i++) {
    //         currentChipPositionalIndex = chipUpdateArray[ x ];
    //         /* -- chipUpdateArray: chipID, mediumChipLeftOffset, mediumChipTopOffset, mediumChipSize
    //         chipUpdateArray[ x ]
    //         transform: translate3d(0px, 0px, 0px);


    //         --*/

    //         if ( locationHistory.indexOf( currentChipPositionalIndex ) >= 0 ) {
    //             console.log("it IS in the locationHistory");
    //             --- TO DO HERE:
    //             Set style attributes for existing EL
    //             document.getElementById("block1").style.transform = "translateY(50px)";
    //             ---
    //         } else {
    //             console.log("it's NOT in the locationHistory");
    //             /*--- TO DO HERE:
    //                 set the appropriate style attr to el, including transform
    //                 thisChipLeft = currentChipColumn * smallChipSize;
    //              ---*/

    //             var newChip = $( '<div class="chip" id="chip' + currentChipPositionalIndex +'" style="left:' + window.currentChipColumn * smallChipSize + 'px;top:' + window.currentChipRow * smallChipSize + 'px;"></div>' );
    //             $chipWrapper.innerHTML += newChip;
    //             locationHistory.push( currentChipPositionalIndex );
    //         }
    //         x = x + 4; /* -- advance the chipUpdateArray loop index --*/
    //     } /* -- Close looping through chipUpdateArray --*/

    //     chipUpdateArray.length = 0;
    // };
    /* CLOSE updateAnimationChangeQueue() */
    /* END Var declarations */

    setPixelDimensions();

    /* ------------------ ### BEGIN TESTING ### ------------------ */
    handleGridCursorMove(300, 100);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(290, 100);

        console.log("animationChangeQueue");
        console.log(animationChangeQueue);
    }, 100);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(280, 100);

        console.log("animationChangeQueue");
        console.log(animationChangeQueue);
    }, 300);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(270, 100);

        console.log("animationChangeQueue");
        console.log(animationChangeQueue);
    }, 500);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(260, 100);
    }, 700);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(250, 100);
    }, 900);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(240, 100);
    }, 1100);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(230, 100);
    }, 1300);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(220, 100);
    }, 1500);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(210, 100);
    }, 1700);
    /* ------------------ ### END TESTING ### --------------------*/

    $mouseListener.on( "mousemove",_.throttle( handleGridCursorMove,100 ) );

} ); /* CLOSE $( document ).ready */










/* ------------------ ### GENERAL STUFF ### ------------------
     newLocation: Create a unique 2D location index, will only work if there are less than 100 columns





     currentPositionalIndex:
     ------------------ ###### ---------------------*/
