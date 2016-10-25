'use strict';
/* ------------------ ###### ---------------------*/
/* -- ###### --*/

$( document ).ready(  function(){
/* ------------------ ### Important Objects ### ------------------
animationChangeQueue: Array of DOM adjustments that should be made with the next animation loop
newLocation, currentPositionalIndex: Unique 2D location indexes calculated by row number * 100 + column number
    This will only work, of course, if there are less than 100 columns
Chip positonal arrays are ordered as such: 'nw', 'n', 'ne', 'w', 'active', 'e', 'sw', 's', 'se', 'default Chip'
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
When a chip location is added, do we add the chip to the DOM in updateAnimationChangeQueue() at the same time that we add it to the queue
    so that we don't have to check for whether it's new every time that we run chipAnimation()?
------------------ ###### ---------------------*/


 /* -------------------- INIT VARIABLES ---------------------*/
var /*--------------------- ### DOM elements ### ---------------------*/
    $console = $( "#console" ),
    $mouseListener = $( "#mouse-listener" ),
    $chipWrapper = $( '#chip-wrapper' ),
    $wrapper = $( "#wrapper" ),
    wrapperOffset = $wrapper.offset(),
    $activeChip = $( '#init-chip' ), /* This prevents first call from failing, saves having to do that logic everytime */
    $allChips = $( '#init-chip' ), /* This prevents first call from failing, saves having to do that logic everytime */

    /*--------------------- ### Initially Empty ### ---------------------*/
    locationHistory = [], /* WWWWW */
    chipHistory = {},
    currentChipRow = 0,
    currentChipColumn = 0,
    newLocation = 0,
    lastLocation = 0,
    isAnimating = false,
    animationLoopCount = 400,
    animationRequest, /* Will have requestAnimationFrames assigned to it */

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
    mediumSizeStep,
    mediumLeftStep,
    mediumTopStep,
    largeSizeStep,
    largeLeftStep,
    largeTopStep,

    /*--------------------- ### Temporary ### ---------------------*/
    // $testChip = $( '#testChip' ),
    // testChipDelta = 1,
    // testChipLeft = 1,

    /*--------------------- ### Arrays of Constants ### ---------------------*/
    /* NOTE HERE: I don'[t think that I need these next two arrays] */
    chipPositionalClasses = [ 'nw', 'n', 'ne', 'w', 'active', 'e', 'sw', 's', 'se' ],
    chipPositionalIndexAdjustments = [ -101, -100, -99, -1, 0, 1, 99, 100, 101 ],
    chipPositionalLeftAdjustments,
    chipPositionalTopAdjustments,

    /*--------------------- ### Arrays of Changing Values ### ---------------------*/
    animationChangeQueue = [],
    /* VALUES WILL BE: Chip ID, Current Left, Current Top, Current Size, Target Size, Delta Left, Delta Top, Delta Size, Current Compass Index */

    // newPositions = [],  DON'T NEED?
    /* VALUES WILL BE: Chip ID, Compass Index */

    /* CLOSE INIT VARIABLES */

    setPixelDimensions = function( event ) {
        /* -------------------- ### TO DO HERE: pass raw (not calculated) values into each assigment ### ---------------------*/
        $wrapper.height( Math.round( $wrapper.width() * 0.56 ));
        $mouseListener.height( Math.round( $wrapper.width() * 0.56 ));
        canvasChipXCount = 50, /* The number of columns in the Color Wall */
        smallChipSize = Math.round( $wrapper.width() / canvasChipXCount ),
        mediumChipSize = Math.round( smallChipSize * 2.5 ),
        mediumChipLeftOffset = Math.round( smallChipSize *  0.95238 ),
        mediumChipTopOffset = Math.round( smallChipSize * 0.95238 ),
        largeChipSize = Math.round( smallChipSize * 5 ),
        largeChipOffset = Math.round( smallChipSize * 1.25 ),
        largeChipLeftOffset = Math.round( smallChipSize * 1.25 ),
        largeChipTopOffset = Math.round( smallChipSize * 1.25 ),
        mediumSizeStep = Math.round( mediumChipSize / animationLoopCount ),
        mediumLeftStep = Math.round( mediumChipLeftOffset / animationLoopCount ),
        mediumTopStep = Math.round( mediumChipTopOffset / animationLoopCount ),
        largeSizeStep = Math.round( largeChipSize / animationLoopCount ),
        largeLeftStep = Math.round( largeChipLeftOffset / animationLoopCount ),
        largeTopStep = Math.round( largeChipTopOffset / animationLoopCount ),

        /* Chip positonal arrays are ordered as such: 'nw', 'n', 'ne', 'w', 'active', 'e', 'sw', 's', 'se', 'default Chip' */
        /* NOTE HERE: I expect that I'll need to have an additional, smaller offset for the cardinal directions, we'll see */
        chipPositionalLeftAdjustments = [ -mediumChipLeftOffset, 0, mediumChipLeftOffset, -mediumChipLeftOffset, -largeChipLeftOffset, mediumChipLeftOffset, -mediumChipLeftOffset, 0, mediumChipLeftOffset, 0 ],
        chipPositionalTopAdjustments = [ -mediumChipTopOffset, -mediumChipTopOffset, -mediumChipTopOffset, 0, -largeChipLeftOffset, 0, mediumChipTopOffset, mediumChipTopOffset, mediumChipTopOffset, 0 ]
    },

    /* ------------------ ### Handling Cursor Movement ### ------------------ */
    handleGridCursorMove = function( Xpos, Ypos ) {
        /* Will need to roll back to these when I'm done passing explicit coordiantes during testing */
        // currentChipRow = Math.floor( ( event.pageY - wrapperOffset.top ) / smallChipSize );
        // currentChipColumn = Math.floor( ( event.pageX - wrapperOffset.left ) / smallChipSize );
        currentChipRow = Math.floor( ( Ypos ) / smallChipSize );
        currentChipColumn = Math.floor( ( Xpos ) / smallChipSize );
        newLocation = currentChipRow * 100 + currentChipColumn;
        //console.log("newLocation: " + newLocation);

        if ( newLocation !== lastLocation ) { /*--- Only update everything if we have moved enough to have gone from one chip to another. ---*/
            /* ------------------ ### Start an animation loop or update chip related data ### ------------------
            /* ------------------ ###### ---------------------*/
            processLocationChange( newLocation , lastLocation );

            if ( !isAnimating ) { /* -- Kick off a requestAnimation loop if one isn't already running --*/
                isAnimating = true;
                animationRequest = window.requestAnimationFrame( chipAnimation );
            }

            /*--------------------- ### START Once per location update ### ---------------------*/
            lastLocation = newLocation;  /* -- So that we're ready for the next new location --*/

            /*--- Remove 'expired' members of the JS object and DOM tree that we consider collectively to be the app cache.
                Essentially, we allow about 6 moves in the color wall before we beginning expiring the original elements

                TO DO HERE:
                Remove reference to chipHistory array
                Delete expiring Els with native methods
                ---*/
            var locationsToExpireCount = locationHistory.length - 120;
            if ( locationsToExpireCount > 0 ) {
                for ( var i = locationsToExpireCount; i > 0; i-- ) {
                    var expiredChipID = 'chip' + locationHistory[ 0 ];
                    delete chipHistory[ expiredChipID ];
                    $( '#' + expiredChipID ).remove();
                    locationHistory.shift();
                }
            }
        } /* END if ( newLocation !== lastLocation ) */
    }, /* END handleGridCursorMove() */

    processLocationChange = function( newLocation, lastLocation ) {
        /* ------------------ ### Start an animation loop or update chip related data ### ------------------
        mediumSizeStep mediumLeftStep mediumTopStep largeSizeStep largeLeftStep largeTopStep
        mediumChipSize mediumChipLeftOffset mediumChipTopOffset largeChipSize largeChipLeftOffset largeChipTopOffset
        */

        var chipIndexDelta = newLocation - lastLocation; /* -- Expresses the direction we moved in --*/

        switch ( chipIndexDelta ) {
            /* For each chip affected by the cursor move, we pass:
                Chip ID of all the affected chip, calcualted from the difference to the previous active chip;
                left offset, top offset, size */
            case -1 : /* -- moved to the West --*/
                updateAnimationChangeQueue( [
                    lastLocation - 102, chipPositionalLeftAdjustments[0], chipPositionalTopAdjustments[0], mediumChipSize,
                    lastLocation - 101, chipPositionalLeftAdjustments[1], chipPositionalTopAdjustments[1], mediumChipSize,
                    lastLocation - 100, chipPositionalLeftAdjustments[2], chipPositionalTopAdjustments[2], mediumChipSize,
                    lastLocation - 2, chipPositionalLeftAdjustments[3], chipPositionalTopAdjustments[3], mediumChipSize,
                    lastLocation - 1, chipPositionalLeftAdjustments[4], chipPositionalTopAdjustments[4], largeChipSize,
                    lastLocation - 0, chipPositionalLeftAdjustments[5], chipPositionalTopAdjustments[5], mediumChipSize,
                    lastLocation + 98, chipPositionalLeftAdjustments[6], chipPositionalTopAdjustments[6], mediumChipSize,
                    lastLocation + 99, chipPositionalLeftAdjustments[7], chipPositionalTopAdjustments[7], mediumChipSize,
                    lastLocation + 100, chipPositionalLeftAdjustments[8], chipPositionalTopAdjustments[8], mediumChipSize,

                    lastLocation - 99, chipPositionalLeftAdjustments[9], chipPositionalTopAdjustments[9], mediumChipSize,
                    lastLocation + 1, chipPositionalLeftAdjustments[9], chipPositionalTopAdjustments[9], mediumChipSize,
                    lastLocation + 101, chipPositionalLeftAdjustments[9], chipPositionalTopAdjustments[9], mediumChipSize,
                ] );

                /* TO DO HERE: create case switches for all 8 possible directional move */

                break;
            default:
                break;
        }
    },

    updateAnimationChangeQueue = function( chipUpdateArray ) {
        /* ------------------ ### Start an animation loop or update chip related data ### ------------------
            IMPORTANT THING TO REMEMBER HERE: In this function we're just making updates to the animation queue, there may still
                be chips animating out (if the cursor is moving quickly) which are in the animation queue but which aren't passed here.
        /* ------------------ ###### ---------------------*/

        var x = 0,
            i,
            animationChangeQueueIndex,
            chipNotInUpdateQueue,
            chipNotLocationHistory,
            currentChipPositionalIndex,
            thisChipLeft,
            thisChipTop,
            thisChipSize,
            thisChipLeftDelta,
            thisChipTopDelta,
            thisChipSizeDelta,
            thisChipCompassIndex;

        while ( x < chipUpdateArray.length ) {
            /* -- Assume that the currently updating chip isn't in the update array, set the outer loop index --*/
            chipNotInUpdateQueue = true;
            currentChipPositionalIndex = chipUpdateArray[ x ];
            i = 0;

            while ( i < animationChangeQueue.length ) {  /* -- ###### --*/
                if ( animationChangeQueue[ i ] === currentChipPositionalIndex ) { /* -- This chip already exists in the animationChangeQueue --*/
                    console.log("This chip already exists in the animationChangeQueue");

                    /* -- TEMP REFRENCE
                        chipUpdateArray: chipID, mediumChipLeftOffset, mediumChipTopOffset, mediumChipSize
                        animationChangeQueue: Chip ID, Current Left, Current Top, Current Size, Target Size, Delta Left, Delta Top, Delta Size, Current Compass Index
                     --*/

                    /* -- Find the absolute difference between the current leftOffset and topOffset targets and the new ones being passed in the update array --*/
                    var absLeftDelta = Math.abs( animationChangeQueue[ i + 1 ] - chipUpdateArray[ x + 1 ] );
                    var absTopDelta = Math.abs( animationChangeQueue[ i + 2 ] - chipUpdateArray[ x + 2 ] );

                    /* -- Determine the left delta for the chip after the current update  --*/
                    if ( animationChangeQueue[ i + 1 ] < chipUpdateArray[ x + 1 ] ) { /* -- The current leftOffset is smaller than the update --*/
                        if ( chipUpdateArray[ x + 1 ] < 0 ) { /* -- Is the new offset target negative  --*/
                            animationChangeQueue[ x + 5 ] =  - absLeftDelta / animationLoopCount; /* -- ###### --*/
                        } else {
                            animationChangeQueue[ x + 5 ] =  absLeftDelta / animationLoopCount; /* -- ###### --*/
                        }
                    } else {
                        if ( chipUpdateArray[ x + 1 ] < 0 ) { /* -- Is the new offset target negative  --*/
                            animationChangeQueue[ x + 5 ] =  absLeftDelta / animationLoopCount; /* -- ###### --*/
                        } else {
                            animationChangeQueue[ x + 5 ] =  - absLeftDelta / animationLoopCount; /* -- ###### --*/
                        }
                    }

                    /* -- Determine the top delta for the chip after the current update --*/
                    if ( animationChangeQueue[ i + 2 ] < chipUpdateArray[ x + 2 ] ) { /* -- The current leftOffset is smaller than the update --*/
                        if ( chipUpdateArray[ x + 2 ] < 0 ) { /* -- Is the new offset target negative  --*/
                            animationChangeQueue[ i + 6 ] =  - absTopDelta / animationLoopCount; /* -- ###### --*/
                        } else {
                            animationChangeQueue[ i + 6 ] =  absTopDelta / animationLoopCount; /* -- ###### --*/
                        }
                    } else {
                        if ( chipUpdateArray[ x + 2 ] < 0 ) { /* -- Is the new offset target negative  --*/
                            animationChangeQueue[ i + 6 ] =  absTopDelta / animationLoopCount; /* -- ###### --*/
                        } else {
                            animationChangeQueue[ i + 6 ] =  - absTopDelta / animationLoopCount; /* -- ###### --*/
                        }
                    }

                    chipNotInUpdateQueue = false;

                    /* --------- TO DO HERE:
                        Set other values of the animationChangeQueue? Are there any more to set?
                    ------------*/

                    break; /* -- Found a match of the current updated chip in the animationChangeQueue, so stop looking for it there --*/
                }

                i = i + 9; /* -- advance the loop index --*/
            } /* -- Close looping through animationChangeQueue while comparing the current chipUpdateArray item --*/

            /* --------- TO DO HERE:
                Empty the chipUpdateArray array
             ------------*/

            /* -- TEMP REFRENCE
                chipUpdateArray: chipID, mediumChipLeftOffset, mediumChipTopOffset, mediumChipSize
                animationChangeQueue: Chip ID, Current Left, Current Top, Current Size, Target Size, Delta Left, Delta Top, Delta Size, Current Compass Index
            --*/

            if ( chipNotInUpdateQueue ) {
                console.log("it's NOT in the animationChangeQueue");
                /* -- We know that the chip isn't currently animating. This tells us that the chip can only be going from small to medium
                    IF the chip IS in the location cache:
                        Compare the location cache item left and top attributes to the updated Array attributes (remember that left and top dimensions will come in signed)
                            to determine deltas and target attributes.
                        Use those values along with the appropriate ones from the location cache item to add the item to the animationChangeQueue
                    ELSE the chip IS NOT in the location cache:
                        Calculate all attributes using defaults and updated Array attributes (remember that left and top dimensions will come in signed).
                        Use those values to create the DOM string for the new chip. Add that chip to the locationHistory array
                        Use those values to create the DOM string for the new chip. Add that chip to the chipHistory array
                        Use those values to add the item to the animationChangeQueue


                    A BIG QUESTIONS:
                        If I drop the queu of DOM Els, then is there anything worth saving in the location history aside from locationIndex, left, and top?
                            It does serve as a faster way tp know if it's in the DOM, as well, so that serves as a reason to keep it
                        Should I keep cardinal arrays of default top and left postions and deltas?

                        currentChipPositionalIndex,
                --*/

                /* TO DO HERE:
                    Set these vars, which will come from defaults and the chipUpdateArray regardless of whether or not the chip is currently in the locationHistory

                    thisChipLeftDelta,
                    thisChipTopDelta,
                    thisChipSizeDelta,
                    thisChipCompassIndex;
                --*/

                chipNotLocationHistory = true;

                for ( var animationChangeQueueIndex = 0; animationChangeQueue.length; animationChangeQueueIndex +9 ) { /*--- wwwww ---*/
                    if ( currentChipPositionalIndex === animationChangeQueue[ animationChangeQueueIndex ]) {
                        chipNotLocationHistory = false;

                        /* --------- TO DO HERE:
                            thisChipLeft,
                            thisChipTop,
                            thisChipSize =
                         ------------*/
                    }
                }

                if ( chipNotLocationHistory ) {  /*--- This chip does NOT exist in our app cache ---*/
                    console.log("it's NOT in the locationHistory");
                    /* --------- TO DO HERE:
                        these vars aren't being set correctly
                         ------------*/
                    thisChipLeft = currentChipColumn * smallChipSize + chipUpdateArray[ x + 1 ];
                    thisChipTop = currentChipColumn * smallChipSize + chipUpdateArray[ x + 1 ];
                    thisChipSize = currentChipColumn * smallChipSize + chipUpdateArray[ x + 1 ];
                    thisChipLeftDelta = ( chipUpdateArray[ x + 3 ] - smallChipSize ) / animationLoopCount;

                    var newChip = $( '<div class="chip" id="chip' + currentChipPositionalIndex +'" style="left:' + chipUpdateArray[ x + 1 ] + 'px;top:' + chipUpdateArray[ x + 2 ] + 'px;height' + chipUpdateArray[ x + 3 ] + 'px;width:' + chipUpdateArray[ x + 3 ] + 'px;"></div>' );
                    //chipHistory[ 'chip' + currentChipPositionalIndex ] = newChip; /*--- wwwww ---*/
                    locationHistory.push( currentChipPositionalIndex ); /*--- wwwww ---*/
                    $chipWrapper.append( newChip );
                    //newChip.addClass( 'chip-' + chipPositionalClasses[ i ] );
                }

                /* TO DO HERE:

                    Write the update to animationChangeQueue.
                --*/
            }

            x = x + 4; /* -- advance the chipUpdateArray loop index --*/
        } /* -- Close looping through chipUpdateArray --*/
    },

    /* ------------------ ### CHIP ANIMATION LOOP ### ------------------
     ------------------ ###### ---------------------*/
    chipAnimation = function() {
        /* ------------------ ### wwwwwww ### ------------------

        VALUES WILL BE: Chip ID, Current Left, Current Top, Current Size, Target Size, Delta Left, Delta Top, Delta Size, Current Compass Index */
        for ( var i = 0; i < animationChangeQueue.length; i + 9 ) {
            var currentPositionalIndex = newLocation + chipPositionalIndexAdjustments[ i ];
            console.log("running animLoop on: " + currentPositionalIndex);

            /* ------------------ ### wwwwwww ### ------------------
            TO DO HERE:
            Instead of accessing the chips by a jQuery selector, should I just use native selectbyID? Likewise, should I use native, el.style to set left and toop?
            But if I do so, do I even need that collection of jQuery objects?
            document.getElementById("box")
            ).style.backgroundColor="salmon";

            If the chip has reached target location, remove the item from the animation queue
        /* ------------------ ###### ---------------------*/
                var currentLoopChip = chipHistory.filter( "#" + animationChangeQueue[ i ] );
                var newLeft = animationChangeQueue[ i + 1 ] + animationChangeQueue[ i + 5 ];
                animationChangeQueue[ i + 1 ] = newLeft;
                var newTop = animationChangeQueue[ i + 1 ] + animationChangeQueue[ i + 5 ];
                animationChangeQueue[ i + 1 ] = newLeft;
                var newSize = animationChangeQueue[ i + 1 ] + animationChangeQueue[ i + 5 ];
                animationChangeQueue[ i + 1 ] = newLeft;
                currentLoopChip.css( "left", newLeft + "px" );
                currentLoopChip.css( "top", newLeft + "px" );
                currentLoopChip.css( "height", newLeft + "px" );
                currentLoopChip.css( "width", newLeft + "px" );
            //}
        }

        if ( animationLoopCount < 1 ) {  /* -- Cancel RA loop if done with it, otherwise, call it again --*/
            window.cancelAnimationFrame( animationRequest );
        } else {
            animationLoopCount--;
            animationRequest = window.requestAnimationFrame( chipAnimation );
        }
    }; /* END chipAnimation( ) */
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
