'use strict';

$( document ).ready(  function(){
    /* ------------------ ### GENERAL STUFF ### ------------------
     newLocation: Create a unique 2D location index, will only work if there are less than 100 columns
     currentPositionalIndex:
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

        updateAnimationChangeQueue = function( chipUpdateArray ) {
            var isNewChip = true;

            /* -- TEMP REFRENCE
                medSizeStep medLeftStep medTopStep largeSizeStep largeLeftStep largeTopStep
                mediumChipSize mediumChipLeftOffset mediumChipTopOffset largeChipSize largeChipLeftOffset largeChipTopOffset
                lastLocation - 102, mediumChipLeftOffset, mediumChipTopOffset, mediumChipSize,
             --*/

            for( var i = 0; i < animationChangeQueue.length; i + 9 ) {
                if ( animationChangeQueue[ i ] === newLocation) { /* -- This chip already exists in the animationChangeQueue --*/
                    var absLeftDelta = Math.abs( animationChangeQueue[ i + 1 ] - chipUpdateArray[ 1 ] );
                    var absTopDelta = Math.abs( animationChangeQueue[ i + 2 ] - chipUpdateArray[ 2 ] )

                    if ( animationChangeQueue[ i + 1 ] < chipUpdateArray[ 1 ] ) {
                        if ( chipUpdateArray[ 1 ] < 0 ) {
                            wwww
                        } else {
                            vvvvvv
                        }
                        animationChangeQueue[ i + 1 ] = absLeftDelta /animationLoopCount; /* -- those  index values aren't corect --*/
                    } else {
                    animationChangeQueue[ i + 1 ] = -Math.abs( animationChangeQueue[ i + 1 ] - chipPositionalLeftAdjustments[ x ] ) /animationLoopCount;
                    }



                    // animationChangeQueue[ i + 1 ] = animationChangeQueue[ i + 1 ] - chipPositionalLeftAdjustments[ x ] /animationLoopCount;
                    // animationChangeQueue[ i + 2 ] = animationChangeQueue[ i + 2 ] - chipPositionalTopAdjustments[ x ] /animationLoopCount;
                    isNewChip = false;
                    break;
                }
            }
        },

        processLocationChange = function( newLocation, lastLocation ) {
            /* ------------------ ### Start an animation loop or update chip related data ### ------------------
                TO DO HERE:

            var chipIndexDelta = newLocation - lastLocation;
            medSizeStep medLeftStep medTopStep largeSizeStep largeLeftStep largeTopStep
            mediumChipSize mediumChipLeftOffset mediumChipTopOffset largeChipSize largeChipLeftOffset largeChipTopOffset

            /* ------------------ ###### ---------------------*/
            /* -- ###### --*/

            switch ( chipIndexDelta ) {
                case -1 : /* -- moved to the West --*/
                    /* chip ID, left offset, top offset, size */
                    updateAnimationChangeQueue( [
                        /* TO DO HERE: update the index values through 8 */
                        lastLocation - 102, chipPositionalLeftAdjustments[0], chipPositionalTopAdjustments[0], mediumChipSize,
                        lastLocation - 101, chipPositionalLeftAdjustments[0], chipPositionalTopAdjustments[0], mediumChipSize,
                        lastLocation - 100, chipPositionalLeftAdjustments[0], chipPositionalTopAdjustments[0], mediumChipSize,
                        lastLocation - 2, chipPositionalLeftAdjustments[0], chipPositionalTopAdjustments[0], mediumChipSize,
                        lastLocation - 1, chipPositionalLeftAdjustments[0], chipPositionalTopAdjustments[0], largeChipSize,
                        lastLocation - 0, chipPositionalLeftAdjustments[0], chipPositionalTopAdjustments[0], mediumChipSize,
                        lastLocation + 98, chipPositionalLeftAdjustments[0], chipPositionalTopAdjustments[0], mediumChipSize,
                        lastLocation + 99, chipPositionalLeftAdjustments[0], chipPositionalTopAdjustments[0], mediumChipSize,
                        lastLocation + 100, chipPositionalLeftAdjustments[0], chipPositionalTopAdjustments[0], mediumChipSize,

                        lastLocation - 99, chipPositionalLeftAdjustments[9], chipPositionalTopAdjustments[9], mediumChipSize,
                        lastLocation + 1, chipPositionalLeftAdjustments[9], chipPositionalTopAdjustments[9], mediumChipSize,
                        lastLocation + 101, chipPositionalLeftAdjustments[9], chipPositionalTopAdjustments[9], mediumChipSize,
                    ] );

                    /* TO DO HERE: repeat that for all 8 possible directional move */

                    break;
                default:
                    break;
            }
        },
        setPixelDimensions = function( event ) {
            /* -------------------- ###### ---------------------*/
            $wrapper.height( $wrapper.width() * 0.56 );
            $mouseListener.height( $wrapper.width() * 0.56 );
        };
    /* CLOSE INIT VARIABLES */

    /* ------------------ ### Handling Cursor Movement ### ------------------
     ------------------ ###### ---------------------*/
    // var handleGridCursorMove = function( event ) {
    var handleGridCursorMove = function( Xpos, Ypos ) {
        // currentChipRow = Math.floor( ( event.pageY - wrapperOffset.top ) / smallChipSize );
        // currentChipColumn = Math.floor( ( event.pageX - wrapperOffset.left ) / smallChipSize );
        currentChipRow = Math.floor( ( Ypos ) / smallChipSize );
        currentChipColumn = Math.floor( ( Xpos ) / smallChipSize );
        newLocation = currentChipRow * 100 + currentChipColumn;

        if ( newLocation !== lastLocation ) { /*--- Only update everything if we have moved enough to have gone from one chip to another. ---*/
            /* ------------------ ### Start an animation loop or update chip related data ### ------------------
                TO DO HERE: Popuklate changes array with new values
            /* ------------------ ###### ---------------------*/
            processLocationChange( newLocation , lastLocation );

            if ( !isAnimating ) {
                isAnimating = true;
                animationRequest = window.requestAnimationFrame( chipAnimation );
            } /* else {
                testChipDelta++;
                console.log("increasing testChipDelta to: " + testChipDelta);
            } */

            /*--------------------- ### START Once per location update ### ---------------------*/
            lastLocation = newLocation;

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
    }; /* END handleGridCursorMove() */


    /* ------------------ ### CHIP ANIMATION LOOP ### ------------------
     ------------------ ###### ---------------------*/
    function chipAnimation ( chipsToAnimate ) {
        /* ------------------ ### //TESTING ### ------------------
            TO DO HERE:
            Go through changes array
        /* ------------------ ###### ---------------------*/
        animationChangeQueue = [],
        /* VALUES WILL BE: Chip ID, Current Left, Current Top, Current Size, Target Size, Delta Left, Delta Top, Delta Size, Current Compass Index */
        for ( var i = 0; i < animationChangeQueue.length; i + 9 ) {
            var currentPositionalIndex = newLocation + chipPositionalIndexAdjustments[ i ];

            if ( locationHistory.indexOf( currentPositionalIndex ) < 0 ) {  /*--- This chip does NOT exist in our app cache ---*/

                /* ------------------ TO DO HERE: This code actually needs adjusted ---------------------*/
                var currentLeftPosition = currentChipColumn * smallChipSize + chipPositionalLeftAdjustments[ i ];
                var currentTopPosition = currentChipRow * smallChipSize + chipPositionalTopAdjustments[ i ];
                var newChip = $( '<div class="chip" id="chip' + currentPositionalIndex +'" style="top:' + currentTopPosition + 'px;left:' + currentLeftPosition + 'px;"></div>' );
                chipHistory[ 'chip' + currentPositionalIndex ] = newChip; /*--- wwwww ---*/
                locationHistory.push( currentPositionalIndex ); /*--- wwwww ---*/
                $chipWrapper.append( newChip );
                newChip.addClass( 'chip-' + chipPositionalClasses[ i ] );

            } else { /*--- This chip DOES exist in our app cache ---*/
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
            }
        }

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

        if ( animationLoopCount < 1 ) {
            window.cancelAnimationFrame( animationRequest );

        } else {
            animationLoopCount--;
            animationRequest = window.requestAnimationFrame( chipAnimation );
        }
    }; /* END chipAnimation( ) */

    setPixelDimensions();

    $mouseListener.on( "mousemove",_.throttle( handleGridCursorMove,100 ) );

} ); /* CLOSE $( document ).ready */










/* ------------------ ### GENERAL STUFF ### ------------------
     newLocation: Create a unique 2D location index, will only work if there are less than 100 columns
     currentPositionalIndex:
     ------------------ ###### ---------------------*/
