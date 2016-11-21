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
4)
*/

 /* -------------------- INIT VARIABLES ---------------------*/
var /*--------------------- ### DOM elements ### ---------------------*/
    /*--- TO DO HERE:
        set these to native selectors and fix wrapper offset
     ---*/
    $console = $( "#console" ),
    // $mouseListener = $( "#mouse-listener" ),
    // $chipWrapper = $( '#chip-wrapper' ),
    $mouseListener = document.getElementById( 'mouse-listener' ),
    $chipWrapper = document.getElementById( 'chip-wrapper' ),
    $console = document.getElementById( 'console' ),
    $wrapper = document.getElementById( 'wrapper' ),
    // $wrapper = $( "#wrapper" ),
    //wrapperOffset = $wrapper.offset(),
    wrapperOffset = 0,
    $wrapperWidth,
    //$activeChip = $( '#init-chip' ), /* This prevents first call from failing, saves having to do that logic everytime */

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
    // chipPositionalLeftAdjustments = [-chipSize,0,chipSize,-chipSize,0,chipSize,-chipSize,0,chipSize],
    // chipPositionalTopAdjustments = [-chipSize,-chipSize,-chipSize,0,0,0,chipSize,chipSize,chipSize],

    /* CLOSE INIT VARIABLES */

    setPixelDimensions = function( event ) {
        /* -------------------- ### TO DO HERE: pass raw (not calculated) values into each assigment ### ---------------------*/
        $wrapperWidth = $wrapper.style.width;
        console.log("$wrapperWidth: " + $wrapperWidth);
        $wrapperWidth = 480;
        // $wrapper.height( Math.round( $wrapperWidth * 0.56 ));
        // $mouseListener.height( Math.round( $wrapperWidth * 0.56 ));
        $wrapper.style.height = ( Math.round( $wrapperWidth * 0.56 )) + 'px';
        $mouseListener.style.height = ( Math.round( $wrapperWidth * 0.56 )) + 'px';
        canvasChipXCount = 50; /* The number of columns in the Color Wall */
        smallChipSize = Math.round( $wrapperWidth / canvasChipXCount );
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


        /*--- TO DO HERE:
            handle when throttling has cuased us to skip a chip and we need to wind donw the last location, using thse params:
            newLocation - lastLocation
        ---*/
        var thisTransform,
            currentPositionalIndex;

        for (var i = 0; i < chipPositionalIndexAdjustments.length; i++) {
            currentPositionalIndex = newLocation + chipPositionalIndexAdjustments[i];
            console.log("chipPositionalIndexAdjustments[i]: " + chipPositionalIndexAdjustments[i]);

            if ( i === 4) {
                thisTransform = "matrix3d( 2, 0, 0.00, 0, 0.00, 2, 0.00, 0, 0, 0, 1, 0, " + chipPositionalLeftAdjustments[ i ] + ", " + chipPositionalTopAdjustments[ i ] + ", 0, 1)";
            } else
                thisTransform = "matrix3d( 4, 0, 0.00, 0, 0.00, 4, 0.00, 0, 0, 0, 1, 0, " + chipPositionalLeftAdjustments[ i ] + ", " + chipPositionalTopAdjustments[ i ] + ", 0, 1)";
            }

            console.log("thisTransform: " + thisTransform);

            // matrix3d( 4, 0, 0.00, 0, 0.00, 4, 0.00, 0, 0, 0, 1, 0, -10px, 0px, 0, 1)

            if ( locationHistory.indexOf( currentPositionalIndex ) >= 0 ) {
                //console.log("it IS in the locationHistory. currentPositionalIndex: " + currentPositionalIndex);
                document.getElementById( 'chip' + currentPositionalIndex ).style.transform = thisTransform;
            } else {
                //console.log("it's NOT in the locationHistory currentPositionalIndex: " + currentPositionalIndex);
                var newChip = '<div class="chip" id="chip' + currentPositionalIndex +'" style="transition:transform 5s;transform:matrix3d( 1, 0, 0.00, 0, 0.00, 1, 0.00, 0, 0, 0, 1, 0, 0, 0, 0, 1);left:' + window.currentChipColumn * smallChipSize + 'px;top:' + window.currentChipRow * smallChipSize + 'px;"></div>';
                $chipWrapper.innerHTML += newChip;
                locationHistory.push( currentPositionalIndex );
                var timeoutID = window.setTimeout(function( currentPositionalIndex ){
                    var thisChip = currentPositionalIndex;
                    //document.getElementById( 'chip' + currentPositionalIndex ).style.transform = thisChip;
                }, 100);
                //document.getElementById( 'chip' + currentPositionalIndex ).style.transform = thisTransform;
            }
        }
    };

    /* CLOSE updateAnimationChangeQueue() */
    /* END Var declarations */

    setPixelDimensions();

    /* ------------------ ### BEGIN TESTING ### ------------------ */
    handleGridCursorMove(300, 100);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(285, 100);
    }, 100);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(270, 100);
    }, 5000);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(255, 100);
    }, 10000);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(240, 100);
    }, 15000);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(235, 100);
    }, 20000);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(220, 100);
    }, 25000);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(205, 100);
    }, 30000);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(190, 100);
    }, 3500);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(210, 100);
    }, 4000);
    /* ------------------ ### END TESTING ### --------------------*/

    $mouseListener.on( "mousemove",_.throttle( handleGridCursorMove,100 ) );

} ); /* CLOSE $( document ).ready */


/* ------------------ ### GENERAL STUFF ### ------------------
     newLocation: Create a unique 2D location index, will only work if there are less than 100 columns

thisTransform = "matrix3d( X scale, 0, 0.00, 0, 0.00, Y scale, 0.00, 0, 0, 0, 1, 0, X translate, Y translate, 0, 1);
                // 'translate3d(' + thisHorizTransform + 'px, ' + thisVertTransform  + 'px, 0px)'
                // var newChip = $( '<div class="chip" id="chip' + currentChipPositionalIndex +'" style="transform: translate3d(' + thisHorizTransform + 'px, ' + thisVertTransform  + 'px, 0px);left:' + window.currentChipColumn * smallChipSize + 'px;top:' + window.currentChipRow * smallChipSize + 'px;"></div>' );

     ------------------ ###### ---------------------*/