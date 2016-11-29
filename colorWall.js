'use strict';

$( document ).ready(  function(){
/* ------------------ ### Important Objects ### ------------------
newLocation, currentPositionalIndex: Unique 2D location indexes calculated by row number * 100 + column number
    This will only work, of course, if there are less than 100 columns
Chip positonal arrays are ordered as such: 'nw', 'n', 'ne', 'w', 'active', 'e', 'sw', 's', 'se', 'default Chip'
    and the positional index adjustments are: -101, -100, -99, -1, 0, 1, 99, 100, 101
*/

/* ------------------ ### How the Whole Thing Works ( at a glance ) ### ------------------
1) Call setPixelDimensions() sets JS vars based on DOM dimensions
2) Attach mousemove listener on the transparent, top level EL which exists just for that purpose, call back function is handleGridCursorMove()

TO DO:
* Fix coordinate positioning to be even
* Prefill next DOM els from any position?
* Handling for jumping
* Add colors for testing
* Add delays for each chip
*/

 /* -------------------- INIT VARIABLES ---------------------*/
var /*--------------------- ### DOM elements ### ---------------------*/
    $mouseListener = document.getElementById( 'mouse-listener' ),
    $chipWrapper = document.getElementById( 'chip-wrapper' ),
    $console = document.getElementById( 'console' ),
    $wrapper = document.getElementById( 'wrapper' ),
    wrapperOffset = $( $wrapper ).offset(),
    $wrapperWidth,

    /*--------------------- ### Initially Empty ### ---------------------*/
    locationHistory = [],
    currentlyActiveChips = [],
    previouslyActiveChips = [],
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
    mediumChipMultiplier = 2,
    largeChipSize,
    largeChipLeftOffset,
    largeChipTopOffset,
    largeChipMultiplier = 4,

    /*--------------------- ### Arrays of Constants ### ---------------------*/
    /* Chip positonal arrays are ordered as such: 'nw', 'n', 'ne', 'w', 'active', 'e', 'sw', 's', 'se' */
    chipPositionalLeftAdjustments = [],
    chipPositionalTopAdjustments = [],
    chipPositionalIndexAdjustments = [-101,-100,-99,-1,0,1,99,100,101],
    chipPositionalRowAdjustments = [ -1, -1, -1, 0, 0, 0, 1, 1, 1 ],
    chipPositionalColumnAdjustments = [ -1, 0, 1, -1, 0, 1, -1, 0, 1 ],
    // chipPositionalIndexAdjustments = [-202,-201,-200,-199,-198,-102,-101,-100,-99,-98,-2,-1,0,1,2,98,99,100,101,102],
    // chipPositionalRowAdjustments = [ -2, -2, -2, -2, -2, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2 ],
    // chipPositionalColumnAdjustments = [ -2, -1, 0, 1, 2, -2, -1, 0, 1, 2, -2, -1, 0, 1, 2, -2, -1, 0, 1, 2, -2, -1, 0, 1, 2 ],
    bufferChipPositionalIndexAdjustments = [-202, -201, -200, -199, -198, -102, -98, -2, 2, 98, 102, 198, 199, 200, 201, 202],
    bufferChipPositionalRowAdjustments = [ -2, -2, -2, -2, -2, -1, -1, 0, 0, 1, 1, 2, 2, 2, 2, 2 ],
    bufferChipPositionalColumnAdjustments = [ -2, -1, 0, 1, 2, -2, 2, -2, 2, -2, 2, -2, -1, 0, 1, 2 ],
    // defaultElementTransform = "matrix3d( 1, 0, 0.00, 0, 0.00, 1, 0.00, 0, 0, 0, 1, 0, 0, 0, 0, 1 )",
    defaultElementTransform = "translate3d(0, 0, 0) scale3d(1, 1, 0)",

    /* CLOSE INIT VARIABLES */

    setPixelDimensions = function( event ) {
        var chipStyleSheet = document.styleSheets[0];
        $wrapperWidth = $( $wrapper ).width();
        $( $wrapper ).height( Math.round( $wrapperWidth * 0.56 ));
        $( $mouseListener ).height( Math.round( $wrapperWidth * 0.56 ));
        canvasChipXCount = 50; /* The number of columns in the Color Wall */
        smallChipSize = Math.round( $wrapperWidth / canvasChipXCount );
        mediumChipSize = Math.round( $wrapperWidth / canvasChipXCount * 2 );
        mediumChipLeftOffset = Math.round( $wrapperWidth / canvasChipXCount * 1.3 );
        mediumChipTopOffset = Math.round( $wrapperWidth / canvasChipXCount * 1.3 ); // should be 2?
        largeChipSize = Math.round( $wrapperWidth / canvasChipXCount * 4 );
        largeChipLeftOffset = Math.round( $wrapperWidth / canvasChipXCount * 0.375 ); // should be 1.5?
        largeChipTopOffset = Math.round( $wrapperWidth / canvasChipXCount * 0.375 );
        chipStyleSheet.insertRule( ".chip { height: " + smallChipSize + "px; width: " + smallChipSize + "px; }", 1 );

        /* Chip positonal arrays are ordered as such: 'nw', 'n', 'ne', 'w', 'active', 'e', 'sw', 's', 'se' */
        chipPositionalLeftAdjustments = [ -mediumChipLeftOffset, -mediumChipLeftOffset / 4, mediumChipLeftOffset, -mediumChipLeftOffset, -largeChipLeftOffset, mediumChipLeftOffset, -mediumChipLeftOffset, -mediumChipLeftOffset / 4, mediumChipLeftOffset ];
        chipPositionalTopAdjustments = [ -mediumChipTopOffset, -mediumChipTopOffset, -mediumChipTopOffset, -mediumChipTopOffset / 4, -largeChipLeftOffset, -mediumChipTopOffset / 4, mediumChipTopOffset, mediumChipTopOffset, mediumChipTopOffset ];

    },

    /* ------------------ ### Handling Cursor Movement ### ------------------ */
    handleGridCursorMove = function( event ) {
        currentChipRow = Math.floor( ( event.pageY - wrapperOffset.top ) / smallChipSize );
        currentChipColumn = Math.floor( ( event.pageX - wrapperOffset.left ) / smallChipSize );
        newLocation = currentChipRow * 100 + currentChipColumn;
        //console.log("newLocation: " + newLocation);

        if ( newLocation !== lastLocation ) { /*--- Only update everything if we have moved enough to have gone from one chip to another. ---*/
            processLocationChange( newLocation , lastLocation );

            /*--------------------- ### Once per location update ### ---------------------
                Remove 'expired' members of the JS object and DOM tree that we consider collectively to be the app cache.
                Essentially, we allow about 12 moves in the color wall before we beginning expiring the original elements
            */
            lastLocation = newLocation;  /* -- So that we're ready for the next new location --*/
            var locationsToExpireCount = locationHistory.length - 150;
            if ( locationsToExpireCount > 0 ) {
                for ( var i = locationsToExpireCount; i > 0; i-- ) {
                    //console.log("removing chip: " + locationHistory[ 0 ]);
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

            remove manual z-index setting
        ---*/
        //console.log("###############################################");

        var chipTransform,
            currentPositionalIndex,
            prevActiveIndex,
            deactivatedChip,
            chipClass,
            chipZindex,
            previouslyActiveChipsLength,
            i,
            x;

        if ( prevActiveIndex >= 0 ) {
            document.getElementsByClassName("chip-large")[0].classList.remove( "chip-large" );
        }

        for ( i = 0; i < 16; i++ ) {
            currentPositionalIndex = newLocation + bufferChipPositionalIndexAdjustments[i];

            if ( locationHistory.indexOf( currentPositionalIndex ) === -1 ) {
                //var newChip = '<div class="chip" id="chip' + currentPositionalIndex +'" style="transform:' + defaultElementTransform + ';left:' + ( currentChipColumn + bufferChipPositionalColumnAdjustments[ i ] ) * smallChipSize + 'px;top:' + ( currentChipRow + bufferChipPositionalRowAdjustments[ i ] ) * smallChipSize + 'px;"></div>';
                var newChip = '<div class="chip" id="chip' + currentPositionalIndex +'" style="left:' + ( currentChipColumn + bufferChipPositionalColumnAdjustments[ i ] ) * smallChipSize + 'px;top:' + ( currentChipRow + bufferChipPositionalRowAdjustments[ i ] ) * smallChipSize + 'px;"></div>';
                $chipWrapper.innerHTML += newChip;
                locationHistory.push( currentPositionalIndex );
            }
        }

        for ( i = 0; i < 9; i++ ) {
            currentPositionalIndex = newLocation + chipPositionalIndexAdjustments[i];
            // console.log("currentlyActiveChips before: ");
            // console.log(currentlyActiveChips);

            currentlyActiveChips.push( currentPositionalIndex );
            // console.log("currentlyActiveChips adding: " + currentPositionalIndex);
            // console.log(currentlyActiveChips);

            if ( i === 4) {
                chipZindex = "3";
                chipClass = "chip chip-large";
                // chipTransform = "matrix3d( 4, 0, 0.00, 0, 0.00, 4, 0.00, 0, 0, 0, 1, 0, " + chipPositionalLeftAdjustments[ i ] + ", " + chipPositionalTopAdjustments[ i ] + ", 0, 1)";
                chipTransform = "translate3d(" + chipPositionalLeftAdjustments[ i ] + "px, " + chipPositionalTopAdjustments[ i ] + "px, 0) scale3d(4, 4, 0) ";
            } else {
                chipZindex = "2";
                chipClass = "chip chip-medium";
                chipTransform = "translate3d(" + chipPositionalLeftAdjustments[ i ] + "px, " + chipPositionalTopAdjustments[ i ] + "px, 0) scale3d(2, 2, 0)";
                // chipTransform = "matrix3d( 2, 0, 0.00, 0, 0.00, 2, 0.00, 0, 0, 0, 1, 0, " + chipPositionalLeftAdjustments[ i ] + ", " + chipPositionalTopAdjustments[ i ] + ", 0, 1)";
            }

            console.log("chipTransform: " + chipTransform);

            if ( locationHistory.indexOf( currentPositionalIndex ) >= 0 ) {
                //console.log("it IS in the locationHistory: " + currentPositionalIndex);
                // var thisHereChip = document.getElementById( 'chip' + currentPositionalIndex ).style.transform = chipTransform;
                var thisHereChip = document.getElementById( 'chip' + currentPositionalIndex );

                thisHereChip.style.transform = chipTransform;
                thisHereChip.className = chipClass;
                //thisHereChip.style.zIndex = chipZindex;

                // if ( i === 4) {
                //     thisHereChip.style.transform = chipTransform;
                //     thisHereChip.style.z-index = chipTransform;
                //     document.getElementById( 'chip' + currentPositionalIndex ).style.transform = chipTransform;
                //     // document.getElementById( 'chip' + currentPositionalIndex ).classList.remove( "chip-medium" );
                //     // document.getElementById( 'chip' + currentPositionalIndex ).classList.add( "chip-large" );
                // } else {
                //     document.getElementById( 'chip' + currentPositionalIndex ).classList.add( "chip-medium" );
                //     document.getElementById( 'chip' + currentPositionalIndex ).classList.remove( "chip-large" );
                //}
            } else {
                //console.log("it's NOT in the locationHistory: " + currentPositionalIndex);
                // var newChip = '<div class="chip" id="chip' + currentPositionalIndex +'" style="z-index:' + chipZindex + ';transform:' + defaultElementTransform + ';left:' + ( currentChipColumn + chipPositionalColumnAdjustments[ i ] ) * smallChipSize + 'px;top:' + ( currentChipRow + chipPositionalRowAdjustments[ i ] ) * smallChipSize + 'px;"></div>';
                var newChip = '<div class="' + chipClass + '" id="chip' + currentPositionalIndex +'" style="transform:' + defaultElementTransform + ';left:' + ( currentChipColumn + chipPositionalColumnAdjustments[ i ] ) * smallChipSize + 'px;top:' + ( currentChipRow + chipPositionalRowAdjustments[ i ] ) * smallChipSize + 'px;"></div>';
                $chipWrapper.innerHTML += newChip;
                locationHistory.push( currentPositionalIndex );

                window.setTimeout( function( thisChipPositionalIndex, thisTransform ) {
                    return function() {
                        document.getElementById( 'chip' + thisChipPositionalIndex ).style.transform = thisTransform;
                }; }( currentPositionalIndex, chipTransform ), 100);
            }

            prevActiveIndex = previouslyActiveChips.indexOf( currentPositionalIndex );
            //console.log("prevActiveIndex: " + prevActiveIndex);
            if ( prevActiveIndex >= 0 ) {
                previouslyActiveChips.splice( prevActiveIndex, 1 );
            }
        } /* END loop to handle newly active chips */

        // console.log("currentlyActiveChips before:");
        // console.log(currentlyActiveChips);
        previouslyActiveChipsLength = previouslyActiveChips.length;

        if ( previouslyActiveChipsLength > 0 ) {
            for ( x = 0; x < previouslyActiveChips.length; x++ ) {
                //console.log("shriking down: " + previouslyActiveChips[ x ]);
                //document.getElementById( 'chip' + previouslyActiveChips[ x ] ).style.transform = defaultElementTransform;
                deactivatedChip = document.getElementById( 'chip' + previouslyActiveChips[ x ] );
                //deactivatedChip.style.zIndex = "1";
                deactivatedChip.style.transform = defaultElementTransform;
                deactivatedChip.className = "chip";
                // document.getElementById( 'chip' + currentPositionalIndex ).classList.remove( "chip-medium" );
                // document.getElementById( 'chip' + currentPositionalIndex ).classList.remove( "chip-large" );
            }
        }

        previouslyActiveChips.length = 0;
        previouslyActiveChips = currentlyActiveChips.slice();
        currentlyActiveChips.length = 0;
        // console.log("currentlyActiveChips after:");
        // console.log(currentlyActiveChips);
        // console.log("previouslyActiveChips after:");
        // console.log(previouslyActiveChips);
    }; /* CLOSE processLocationChange() */

    /* END Var declarations */

    setPixelDimensions();

    $( $mouseListener ).on( "mousemove", _.throttle( handleGridCursorMove, 200 ) );
    //$( $mouseListener ).on( "mousemove", handleGridCursorMove);

} ); /* CLOSE $( document ).ready */


/* ------------------ ### GENERAL STUFF ### ------------------
     newLocation: Create a unique 2D location index, will only work if there are less than 100 columns

//var newChip = '<div class="chip" id="chip' + currentPositionalIndex +'" style="transform:' + thisTransform + ';left:' + ( currentChipColumn + chipPositionalColumnAdjustments[ i ] ) * smallChipSize + 'px;top:' + ( currentChipRow + chipPositionalRowAdjustments[ i ] ) * smallChipSize + 'px;"></div>';

thisTransform = "matrix3d( X scale, 0, 0.00, 0, 0.00, Y scale, 0.00, 0, 0, 0, 1, 0, X translate, Y translate, 0, 1);
                // 'translate3d(' + thisHorizTransform + 'px, ' + thisVertTransform  + 'px, 0px)'
                // var newChip = $( '<div class="chip" id="chip' + currentChipPositionalIndex +'" style="transform: translate3d(' + thisHorizTransform + 'px, ' + thisVertTransform  + 'px, 0px);left:' + window.currentChipColumn * smallChipSize + 'px;top:' + window.currentChipRow * smallChipSize + 'px;"></div>' );

     ------------------ ###### ---------------------*/