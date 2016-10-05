'use strict';
/* ------------------ ###### ---------------------*/
/* -- ###### --*/

$( document ).ready(  function(){
/* ------------------ ### Important Objects ### ------------------
animationChangeQueue: Array of DOM adjustments that should be made with the next animation loop
newLocation, currentPositionalIndex: Unique 2D location indexes calculated by row number * 100 + column number
    This will only work, of course, if there are less than 100 columns
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
        smallChipSize = $wrapper.width() / canvasChipXCount,
        mediumChipSize = smallChipSize * 2.5,
        mediumChipOffset = smallChipSize * 0.95238,
        largeChipSize = smallChipSize * 5,
        largeChipOffset = smallChipSize * 1.25,
        // defaultSize = wwwww,
        mediumChipSize   largeChipSize
        medSizeStep = mediumChipSize / animationLoopCount,
        medLeftStep = mediumChipLeftOffset / animationLoopCount,
        medTopStep = mediumChipTopOffset / animationLoopCount,
        largeSizeStep = largeChipSize / animationLoopCount,
        largeLeftStep = largeChipLeftOffset / animationLoopCount,
        largeTopStep = largeChipTopOffset / animationLoopCount,

        /*--------------------- ### Temporary ### ---------------------*/
        $testChip = $( '#testChip' ),
        testChipDelta = 1,
        testChipLeft = 1,

        /*--------------------- ### Arrays of Constants ### ---------------------*/
        /* NOTE HERE: I don'[t think that I need these next two arrays] */
        chipPositionalClasses = [ 'nw','n','ne','w','active','e','sw','s','se' ],
        chipPositionalIndexAdjustments = [ -101,-100,-99,-1,0,1,99,100,101 ],

        /* NOTE HERE: I expect that I'll need to have an additional, smaller offset for the cardinal directions, we'll see */
        chipPositionalLeftAdjustments = [ -mediumChipOffset, 0, mediumChipOffset, -mediumChipOffset, 0, mediumChipOffset, -mediumChipOffset, 0, mediumChipOffset ],
        chipPositionalTopAdjustments = [ -mediumChipOffset, -mediumChipOffset, -mediumChipOffset, 0, 0, 0, mediumChipOffset, mediumChipOffset, mediumChipOffset ],
        // chipPositionalLeftAdjustments = [ -smallChipSize,0,smallChipSize,-smallChipSize,0,smallChipSize,-smallChipSize,0,smallChipSize ],
        // chipPositionalTopAdjustments = [ -smallChipSize,-smallChipSize,-smallChipSize,0,0,0,smallChipSize,smallChipSize,smallChipSize ],

        /*--------------------- ### Arrays of Changing Values ### ---------------------*/
        animationChangeQueue = [],
        /* VALUES WILL BE: Chip ID, Current Left, Current Top, Current Size, Target Size, Delta Left, Delta Top, Delta Size, Current Compass Index */

        newPositions = [],
        /* VALUES WILL BE: Chip ID, Compass Index */

        /* CLOSE INIT VARIABLES */

        setPixelDimensions = function( event ) {
            /* -------------------- ###### ---------------------*/
            $wrapper.height( $wrapper.width() * 0.56 );
            $mouseListener.height( $wrapper.width() * 0.56 );
        },

        /* ------------------ ### Handling Cursor Movement ### ------------------ */
        handleGridCursorMove = function( Xpos, Ypos ) {
            /* Will need to roll back to these when I'm done passing explicit coordiantes during testing */
            // currentChipRow = Math.floor( ( event.pageY - wrapperOffset.top ) / smallChipSize );
            // currentChipColumn = Math.floor( ( event.pageX - wrapperOffset.left ) / smallChipSize );
            currentChipRow = Math.floor( ( Ypos ) / smallChipSize );
            currentChipColumn = Math.floor( ( Xpos ) / smallChipSize );
            newLocation = currentChipRow * 100 + currentChipColumn;

            if ( newLocation !== lastLocation ) { /*--- Only update everything if we have moved enough to have gone from one chip to another. ---*/
                /* ------------------ ### Start an animation loop or update chip related data ### ------------------
                    TO DO HERE:
                /* ------------------ ###### ---------------------*/
                processLocationChange( newLocation , lastLocation );

                if ( !isAnimating ) { /* -- ###### --*/
                    isAnimating = true;
                    animationRequest = window.requestAnimationFrame( chipAnimation );
                }

                /*--------------------- ### START Once per location update ### ---------------------*/
                lastLocation = newLocation;  /* -- So that we're ready for the next new location --*/

                /*--- Remove 'expired' members of the JS object and DOM tree that we consider collectively to be the app cache.
                    Essentially, we allow about 6 moves in the color wall before we beginning expiring the original elements ---*/
                var locationsToExpireCount = locationHistory.length - 60;
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
                TO DO HERE:

            medSizeStep medLeftStep medTopStep largeSizeStep largeLeftStep largeTopStep
            mediumChipSize mediumChipLeftOffset mediumChipTopOffset largeChipSize largeChipLeftOffset largeChipTopOffset
            */

            var chipIndexDelta = newLocation - lastLocation; /* -- Expresses the direction we moved in --*/

            switch ( chipIndexDelta ) {
                case -1 : /* -- moved to the West --*/
                    /* chip ID, left offset, top offset, size */
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
                TO DO HERE:

                IMPORTANT THING TO REMEMBER HERE: In this function we're just making updates to the animation queue, there may still
                    be chips animating out (if the cursor is moving quickly) which are in the animation queue but which aren't passed here.
            /* ------------------ ###### ---------------------*/

            /* -- TEMP REFRENCE
                medSizeStep medLeftStep medTopStep largeSizeStep largeLeftStep largeTopStep
                mediumChipSize mediumChipLeftOffset mediumChipTopOffset largeChipSize largeChipLeftOffset largeChipTopOffset
                lastLocation - 102, mediumChipLeftOffset, mediumChipTopOffset, mediumChipSize,
             --*/

            for( var x = 0; x < chipUpdateArray.length; x + 4 ) {  /* -- ###### --*/
                var chipNotInUpdateQueue = true;

                for( var i = 0; i < animationChangeQueue.length; i + 9 ) {  /* -- ###### --*/
                    /* -- ###### --*/
                    if ( animationChangeQueue[ i ] === chipUpdateArray[ x ]) { /* -- This chip already exists in the animationChangeQueue --*/
                        var absLeftDelta = Math.abs( animationChangeQueue[ i + 1 ] - chipUpdateArray[ x + 1 ] );
                        var absTopDelta = Math.abs( animationChangeQueue[ i + 2 ] - chipUpdateArray[ x + 2 ] )

                        if ( animationChangeQueue[ i + 1 ] < chipUpdateArray[ x + 1 ] ) { /* -- ###### --*/
                            if ( chipUpdateArray[ x + 1 ] < 0 ) {
                                wwww
                            } else {
                                vvvvvv
                            }
                            animationChangeQueue[ i + 1 ] = absLeftDelta /animationLoopCount; /* -- those  index values aren't corect --*/
                        } else {
                            animationChangeQueue[ i + 1 ] = -Math.abs( animationChangeQueue[ i + 1 ] - chipPositionalLeftAdjustments[ x ] ) /animationLoopCount;
                        }

                        chipNotInUpdateQueue = false;
                        break;
                    }
                } /* -- Close looping through animationChangeQueue --*/

                if ( chipNotInUpdateQueue ) {
                    /* -- TO DO HERE: --*/
                    if ( locationHistory.indexOf( currentPositionalIndex ) < 0 ) {  /*--- This chip does NOT exist in our app cache ---*/
                        var currentLeftPosition = currentChipColumn * smallChipSize + chipPositionalLeftAdjustments[ i ];
                        var currentTopPosition = currentChipRow * smallChipSize + chipPositionalTopAdjustments[ i ];
                        var newChip = $( '<div class="chip" id="chip' + currentPositionalIndex +'" style="top:' + currentTopPosition + 'px;left:' + currentLeftPosition + 'px;"></div>' );
                        chipHistory[ 'chip' + currentPositionalIndex ] = newChip; /*--- wwwww ---*/
                        locationHistory.push( currentPositionalIndex ); /*--- wwwww ---*/
                        $chipWrapper.append( newChip );
                        newChip.addClass( 'chip-' + chipPositionalClasses[ i ] );
                    }
                }
            } /* -- Close looping through chipUpdateArray --*/
        },

        /* ------------------ ### CHIP ANIMATION LOOP ### ------------------
         ------------------ ###### ---------------------*/
        chipAnimation = function() {  /*--- why was I passing this:  chipsToAnimate, was it testing? ---*/
            /* ------------------ ### wwwwwww ### ------------------
                TO DO HERE:
            /* ------------------ ###### ---------------------*/
            //animationChangeQueue = [],  /*--- why am creating this here? ---*/
            /* VALUES WILL BE: Chip ID, Current Left, Current Top, Current Size, Target Size, Delta Left, Delta Top, Delta Size, Current Compass Index */
            for ( var i = 0; i < animationChangeQueue.length; i + 9 ) {
                var currentPositionalIndex = newLocation + chipPositionalIndexAdjustments[ i ];

                // if ( locationHistory.indexOf( currentPositionalIndex ) < 0 ) {  /*--- This chip does NOT exist in our app cache ---*/

                //     /* ------------------ TO DO HERE: This code actually needs adjusted ---------------------*/
                //     var currentLeftPosition = currentChipColumn * smallChipSize + chipPositionalLeftAdjustments[ i ];
                //     var currentTopPosition = currentChipRow * smallChipSize + chipPositionalTopAdjustments[ i ];
                //     var newChip = $( '<div class="chip" id="chip' + currentPositionalIndex +'" style="top:' + currentTopPosition + 'px;left:' + currentLeftPosition + 'px;"></div>' );
                //     chipHistory[ 'chip' + currentPositionalIndex ] = newChip; /*--- wwwww ---*/
                //     locationHistory.push( currentPositionalIndex ); /*--- wwwww ---*/
                //     $chipWrapper.append( newChip );
                //     newChip.addClass( 'chip-' + chipPositionalClasses[ i ] );

                //} else { /*--- This chip DOES exist in our app cache ---*/
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
        // console.log("testChipDelta: " + testChipDelta);
        // testChipLeft = testChipLeft + testChipDelta,
        // $testChip.css('left', testChipLeft + 'px');

    handleGridCursorMove(300, 100);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(275, 100);
    }, 800);

    var timeoutID = window.setTimeout(function(){
        handleGridCursorMove(250, 100);
    }, 1500);
    /* ------------------ ### END TESTING ### --------------------*/




    $mouseListener.on( "mousemove",_.throttle( handleGridCursorMove,100 ) );

} ); /* CLOSE $( document ).ready */










/* ------------------ ### GENERAL STUFF ### ------------------
     newLocation: Create a unique 2D location index, will only work if there are less than 100 columns





     currentPositionalIndex:
     ------------------ ###### ---------------------*/
