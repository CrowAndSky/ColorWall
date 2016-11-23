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
3) The handleGridCursorMove function determines if we've moved to a new node. If we have:
4)


TO DO:
Why active immediately goes full size
All currently active need higher z-index
Previous not being shrunk
Old not being removed

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
    // largeChipOffset,
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
    defaultElementTransform = "matrix3d( 1, 0, 0.00, 0, 0.00, 1, 0.00, 0, 0, 0, 1, 0, 0, 0, 0, 1 )",

    /* CLOSE INIT VARIABLES */

    setPixelDimensions = function( event ) {
        /* -------------------- ### TO DO HERE: pass raw (not calculated) values into each assigment ### ---------------------*/
        $wrapperWidth = $( $wrapper ).width();
        $( $wrapper ).height( Math.round( $wrapperWidth * 0.56 ));
        $( $mouseListener ).height( Math.round( $wrapperWidth * 0.56 ));
        canvasChipXCount = 50; /* The number of columns in the Color Wall */
        smallChipSize = Math.round( $wrapperWidth / canvasChipXCount );
        // mediumChipSize = Math.round( smallChipSize * 2.5 );
        // mediumChipLeftOffset = Math.round( smallChipSize *  0.95238 );
        // mediumChipTopOffset = Math.round( smallChipSize * 0.95238 );
        // largeChipSize = Math.round( smallChipSize * 5 );
        // largeChipOffset = Math.round( smallChipSize * 1.25 );
        // largeChipLeftOffset = Math.round( smallChipSize * 1.25 );
        // largeChipTopOffset = Math.round( smallChipSize * 1.25 );
        mediumChipSize = Math.round( $wrapperWidth / canvasChipXCount * 2 );
        // mediumChipLeftOffset = Math.round( $wrapperWidth / canvasChipXCount *  2 );
        // mediumChipTopOffset = Math.round( $wrapperWidth / canvasChipXCount * 2 );
        mediumChipLeftOffset = Math.round( $wrapperWidth / canvasChipXCount * 1.3 );
        mediumChipTopOffset = Math.round( $wrapperWidth / canvasChipXCount * 1.3 );
        largeChipSize = Math.round( $wrapperWidth / canvasChipXCount * 4 );
        // largeChipLeftOffset = Math.round( $wrapperWidth / canvasChipXCount * 1.5 );
        largeChipLeftOffset = Math.round( $wrapperWidth / canvasChipXCount * 0.375 );
        largeChipTopOffset = Math.round( $wrapperWidth / canvasChipXCount * 0.375 );

        /* Chip positonal arrays are ordered as such: 'nw', 'n', 'ne', 'w', 'active', 'e', 'sw', 's', 'se' */
        // chipPositionalLeftAdjustments = [ -mediumChipLeftOffset, 0, mediumChipLeftOffset, -mediumChipLeftOffset, -largeChipLeftOffset, mediumChipLeftOffset, -mediumChipLeftOffset, 0, mediumChipLeftOffset, 0 ];
        // chipPositionalTopAdjustments = [ -mediumChipTopOffset, -mediumChipTopOffset, -mediumChipTopOffset, 0, -largeChipLeftOffset, 0, mediumChipTopOffset, mediumChipTopOffset, mediumChipTopOffset, 0 ];
        chipPositionalLeftAdjustments = [ -mediumChipLeftOffset, -mediumChipLeftOffset / 4, mediumChipLeftOffset, -mediumChipLeftOffset, -largeChipLeftOffset, mediumChipLeftOffset, -mediumChipLeftOffset, -mediumChipLeftOffset / 4, mediumChipLeftOffset ];
        chipPositionalTopAdjustments = [ -mediumChipTopOffset, -mediumChipTopOffset, -mediumChipTopOffset, -mediumChipTopOffset / 4, -largeChipLeftOffset, -mediumChipTopOffset / 4, mediumChipTopOffset, mediumChipTopOffset, mediumChipTopOffset ];

        // console.log("#### 1");
        // console.log(chipPositionalLeftAdjustments);
        // console.log(chipPositionalTopAdjustments);
    },

    /* ------------------ ### Handling Cursor Movement ### ------------------ */
    handleGridCursorMove = function( event ) { //Xpos, Ypos
        currentChipRow = Math.floor( ( event.pageY - wrapperOffset.top ) / smallChipSize );
        currentChipColumn = Math.floor( ( event.pageX - wrapperOffset.left ) / smallChipSize );
        // currentChipRow = Math.floor( Ypos / smallChipSize );
        // currentChipColumn = Math.floor( Xpos / smallChipSize );
        newLocation = currentChipRow * 100 + currentChipColumn;

        if ( newLocation !== lastLocation ) { /*--- Only update everything if we have moved enough to have gone from one chip to another. ---*/
            processLocationChange( newLocation , lastLocation );

            /*--------------------- ### Once per location update ### ---------------------
                Remove 'expired' members of the JS object and DOM tree that we consider collectively to be the app cache.
                Essentially, we allow about 12 moves in the color wall before we beginning expiring the original elements
            */
            lastLocation = newLocation;  /* -- So that we're ready for the next new location --*/
            var locationsToExpireCount = locationHistory.length - 120;
            if ( locationsToExpireCount > 0 ) {
                for ( var i = locationsToExpireCount; i > 0; i-- ) {
                    console.log("removing chip: " + locationHistory[ 0 ]);
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
        var chipTransform,
            currentPositionalIndex,
            prevActiveIndex,
            chipSizeClass,
            previouslyActiveChipsLength,
            i,
            x;

        if ( prevActiveIndex >= 0 ) {
            document.getElementsByClassName("chip-large")[0].classList.remove( "chip-large" );
        }

        for ( i = 0; i < chipPositionalIndexAdjustments.length; i++ ) {
            currentPositionalIndex = newLocation + chipPositionalIndexAdjustments[i];

            currentlyActiveChips.push( currentPositionalIndex );

            console.log("###############################################");

            prevActiveIndex = previouslyActiveChips.indexOf( currentPositionalIndex );
            console.log("prevActiveIndex: " + prevActiveIndex);
            if ( prevActiveIndex >= 0 ) {
                previouslyActiveChips.splice( prevActiveIndex, 1 );
            }

            if ( i === 4) {
                //document.getElementById( 'chip' + currentPositionalIndex ).classList.add( "chip-large" );
                chipSizeClass = "chip-large";
                chipTransform = "matrix3d( 4, 0, 0.00, 0, 0.00, 4, 0.00, 0, 0, 0, 1, 0, " + chipPositionalLeftAdjustments[ i ] + ", " + chipPositionalTopAdjustments[ i ] + ", 0, 1)";
            } else {
                chipSizeClass = "";
                chipTransform = "matrix3d( 2, 0, 0.00, 0, 0.00, 2, 0.00, 0, 0, 0, 1, 0, " + chipPositionalLeftAdjustments[ i ] + ", " + chipPositionalTopAdjustments[ i ] + ", 0, 1)";
            }

            if ( locationHistory.indexOf( currentPositionalIndex ) >= 0 ) {
                //console.log("it IS in the locationHistory: " + currentPositionalIndex);
                document.getElementById( 'chip' + currentPositionalIndex ).style.transform = chipTransform;
                if ( i === 4) {
                    document.getElementById( 'chip' + currentPositionalIndex ).classList.add( "chip-large" );
                }
            } else {
                //console.log("it's NOT in the locationHistory: " + currentPositionalIndex);
                var newChip = '<div class="chip ' + chipSizeClass + '" id="chip' + currentPositionalIndex +'" style="' + defaultElementTransform + ';left:' + ( currentChipColumn + chipPositionalColumnAdjustments[ i ] ) * smallChipSize + 'px;top:' + ( currentChipRow + chipPositionalRowAdjustments[ i ] ) * smallChipSize + 'px;"></div>';
                $chipWrapper.innerHTML += newChip;
                locationHistory.push( currentPositionalIndex );

                window.setTimeout( function( thisChipPositionalIndex, thisTransform ) {
                    return function() {
                        document.getElementById( 'chip' + thisChipPositionalIndex ).style.transform = thisTransform;
                        //console.log("thisTransform: " + thisTransform);
                }; }( currentPositionalIndex, chipTransform ), 50);
            }
        }

        console.log("previouslyActiveChips before:");
        console.log(previouslyActiveChips);

        previouslyActiveChipsLength = previouslyActiveChips.length;

        if ( previouslyActiveChipsLength > 0 ) {
            for ( x = 0; x < previouslyActiveChips.length; x++ ) {
                console.log("shriking down: " + previouslyActiveChips[ x ]);
                document.getElementById( 'chip' + previouslyActiveChips[ x ] ).style.transform = defaultElementTransform;
            }
        }

        previouslyActiveChips = currentlyActiveChips;

        console.log("currentlyActiveChips after:");
        console.log(currentlyActiveChips);

        console.log("previouslyActiveChips after:");
        console.log(previouslyActiveChips);
    }; /* CLOSE processLocationChange() */

    /* END Var declarations */

    setPixelDimensions();

    $( $mouseListener ).on( "mousemove", _.throttle( handleGridCursorMove, 100 ) );
    //$( $mouseListener ).on( "mousemove", handleGridCursorMove);

} ); /* CLOSE $( document ).ready */


/* ------------------ ### GENERAL STUFF ### ------------------
     newLocation: Create a unique 2D location index, will only work if there are less than 100 columns

//var newChip = '<div class="chip" id="chip' + currentPositionalIndex +'" style="transform:' + thisTransform + ';left:' + ( currentChipColumn + chipPositionalColumnAdjustments[ i ] ) * smallChipSize + 'px;top:' + ( currentChipRow + chipPositionalRowAdjustments[ i ] ) * smallChipSize + 'px;"></div>';

thisTransform = "matrix3d( X scale, 0, 0.00, 0, 0.00, Y scale, 0.00, 0, 0, 0, 1, 0, X translate, Y translate, 0, 1);
                // 'translate3d(' + thisHorizTransform + 'px, ' + thisVertTransform  + 'px, 0px)'
                // var newChip = $( '<div class="chip" id="chip' + currentChipPositionalIndex +'" style="transform: translate3d(' + thisHorizTransform + 'px, ' + thisVertTransform  + 'px, 0px);left:' + window.currentChipColumn * smallChipSize + 'px;top:' + window.currentChipRow * smallChipSize + 'px;"></div>' );

     ------------------ ###### ---------------------*/