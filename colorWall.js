'use strict';
$( document ).ready( function() {
/*
TO DO:
* use S-W colors from JSON
* add documensation
* correct main chip asize
* adjust an animate drop shadows
*/

 /* -------------------- INIT VARIABLES ---------------------*/
var /*--------------------- ### DOM elements ### ---------------------*/
    $mouseListener = document.getElementById( 'mouse-listener' ),
    // cwGridPattern = $('#smallGrid'),
    // cwGridPatternPath = $('#smallGrid path'),
    // SVGgridMultiplier,
    $chipWrapper = document.getElementById( 'chip-wrapper' ),
    $wrapper = document.getElementById( 'wrapper' ),
    wrapperOffset = $( $wrapper ).offset(),
    $wrapperWidth,
    chipStyleSheet = document.styleSheets[0],
    /*--------- ### Canvas EL ### ----------*/
    cwCanvas = document.getElementById("color-wall-canvas"),
    cwContex = cwCanvas.getContext( "2d" ),
    cwImageData = cwContex.getImageData( 0, 0, 1049, 587 ),
    cwData = cwImageData.data,
    pixelindex = 0,

    /*--------------------- ### Initially Empty ### ---------------------*/
    locationHistory = [],
    currentlyActiveChips = [],
    previouslyActiveChips = [],
    newChipsToAnimate = [],
    existingChipsToAnimate = [],
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
    allColorsLong = ["90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64"],
    chipPositionalLeftAdjustments = [],
    chipPositionalTopAdjustments = [],
    chipPositionalClasses = ['nw','n','ne','w','large','e','sw','s','se'],
    chipPositionalIndexAdjustments = [-51,-50,-49,-1,0,1,49,50,51],
    chipPositionalRowAdjustments = [ -1, -1, -1, 0, 0, 0, 1, 1, 1 ],
    chipPositionalColumnAdjustments = [ -1, 0, 1, -1, 0, 1, -1, 0, 1 ],

    /*--------------------- ### Animation Looping ### ---------------------*/
    //chipTransform,
    currentPositionalIndex,
    animLoopIndex,
    prevActiveIndex,
    deactivatedChip,
    chipClass,
    chipZindex,
    previouslyActiveChipsLength,
    lastUnProcessedLocation = '',
    buildingInnerDOM = false,
    lastNewChipWasAddedtoDOM = true,
    queuedCursorMoveTimeout,
    //updateLoopMax,
    DOMmutationObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        lastNewChipWasAddedtoDOM = true;
      });
    }),
    DOMmutationObserverConfig = { childList: true },
    i,
    x,
    requestAnimationID;

    var createCanvasImage = function() {
        _.each(allColorsLong, function(thisColor) {
            var i = pixelindex * 4,
                colorChannels = tinycolor(thisColor).toRgb();
            cwData[i] = colorChannels.r;
            cwData[i + 1]   = colorChannels.g;
            cwData[i + 2]   = colorChannels.b;
            cwData[i + 3]   = 255;
            pixelindex++;
        });
    };

    var updateInnerChipDOM = function() {
        if ( lastNewChipWasAddedtoDOM ) {
            if ( animLoopIndex >= newChipsToAnimate.length ) {
                for ( x = 0; x < existingChipsToAnimate.length; x += 2 ) {
                    try {
                        document.getElementById( 'chip' + existingChipsToAnimate[ x ] ).className = 'chip-' + existingChipsToAnimate[ x + 1 ];
                    } catch(e) {
                        console.error( "Failed to find chip " + previouslyActiveChips[ x ] );
                    }
                }

                for ( x = 0; x < newChipsToAnimate.length; x += 2 ) {
                    try {
                        document.getElementById( 'chip' + newChipsToAnimate[ x ] ).className = 'chip-' + chipPositionalClasses[ newChipsToAnimate[ x + 1 ] ];
                    } catch(e) {
                        console.error( "Failed to find chip " + previouslyActiveChips[ x ] );
                    }
                }

                previouslyActiveChipsLength = previouslyActiveChips.length;

                if ( previouslyActiveChipsLength > 0 ) {
                    for ( x = 0; x < previouslyActiveChipsLength; x++ ) {
                        try {
                            document.getElementById( 'chip' + previouslyActiveChips[ x ] ).className = "";
                        } catch(e) {
                            console.error( "Failed to find chip " + previouslyActiveChips[ x ] );
                        }
                    }
                }

                previouslyActiveChips.length = 0;  /* Reset the previously active chips array */
                previouslyActiveChips = currentlyActiveChips.slice();  /* Set the previously active chips array to the currently active chips, to be processed with the next position change */
                currentlyActiveChips.length = 0; /* Reset the currently active chips array */
                existingChipsToAnimate.length = 0;  /* wwww */
                newChipsToAnimate.length = 0;
                buildingInnerDOM = false;
                cancelAnimationFrame( requestAnimationID );

                /*--------------------- ### Once per location update ### ---------------------
                        Remove 'expired' members of the JS object and DOM tree that we consider collectively to be the app cache.
                        Essentially, we allow about 12 moves in the color wall before we beginning expiring the original elements
                    */
                    lastLocation = newLocation;  /* -- So that we're ready for the next new location - */

                    setTimeout(function () {
                        var locationsToExpireCount = locationHistory.length - 60;
                        if ( locationsToExpireCount > 0 && !buildingInnerDOM ) {
                            console.log("timeout expiring els");
                            for ( var i = locationsToExpireCount; i > 0; i-- ) {
                                var element = document.getElementById( 'chip' + locationHistory[ 0 ] );
                                element.parentNode.removeChild(element);
                                locationHistory.shift();
                            }
                        }
                    }, 1000);
            } else {
                lastNewChipWasAddedtoDOM = false;
                //console.log("adding EL: " + newChipsToAnimate[ animLoopIndex ]);
                var newChip = '<div class="chip-priming" id="chip' + newChipsToAnimate[ animLoopIndex ] +'" style="left:' + ( currentChipColumn + chipPositionalColumnAdjustments[ newChipsToAnimate[ animLoopIndex + 1 ] ] ) * smallChipSize + 'px;top:' + ( currentChipRow + chipPositionalRowAdjustments[ newChipsToAnimate[ animLoopIndex + 1 ] ] ) * smallChipSize + 'px;background-color:#' + allColorsLong[ newChipsToAnimate[ animLoopIndex ] ] + '"></div>';
                $chipWrapper.innerHTML += newChip;
                //console.log("anim loop: " + animLoopIndex);
                animLoopIndex += 2;
                requestAnimationID = requestAnimationFrame( updateInnerChipDOM );
            }
        } else {
            requestAnimationID = requestAnimationFrame( updateInnerChipDOM );
        }
    };  /* CLOSE updateInnerChipDOM */

    var setPixelDimensions = function( event ) {
        $wrapperWidth = $( $wrapper ).width();
        $wrapperHeight = Math.round( $wrapperWidth * 0.56 );
        $( $wrapper ).height( $wrapperHeight );
        $( $mouseListener ).height( $wrapperHeight );
        canvasChipXCount = 50; /* The number of columns in the Color Wall */
        smallChipSize = Math.round( $wrapperWidth / canvasChipXCount );
        mediumChipSize = Math.round( $wrapperWidth / canvasChipXCount * 2 );
        mediumChipLeftOffset = Math.round( $wrapperWidth / canvasChipXCount * 1.3 );
        mediumChipTopOffset = Math.round( $wrapperWidth / canvasChipXCount * 1.3 ); // should be 2?
        largeChipSize = Math.round( $wrapperWidth / canvasChipXCount * 4 );
        largeChipLeftOffset = Math.round( $wrapperWidth / canvasChipXCount * 0.375 ); // should be 1.5?
        largeChipTopOffset = Math.round( $wrapperWidth / canvasChipXCount * 0.375 );
        chipPositionalLeftAdjustments = [ -mediumChipLeftOffset, 0, mediumChipLeftOffset, -mediumChipLeftOffset, -largeChipLeftOffset, mediumChipLeftOffset, -mediumChipLeftOffset, 0, mediumChipLeftOffset ];
        chipPositionalTopAdjustments = [ -mediumChipTopOffset, -mediumChipTopOffset, -mediumChipTopOffset, 0, -largeChipLeftOffset, 0, mediumChipTopOffset, mediumChipTopOffset, mediumChipTopOffset ];
        chipStyleSheet.insertRule( "#chip-wrapper > div { height: " + smallChipSize + "px; width: " + smallChipSize + "px; }", 1 );

        cwContainerWidth = cwContainer.width(),
        SVGgridMultiplier = cwContainerWidth * 0.02;
        cwContainer.height( $wrapperHeight);
        cwContex.putImageData( cwImageData, 0, 0 );

        for ( var i = 0; i < 9; i++ ) {
            if ( i === 4 ) {
                chipStyleSheet.insertRule( "#chip-wrapper > .chip-"  + chipPositionalClasses[i] + " { transform: translate3d(" + chipPositionalLeftAdjustments[ i ] + "px, " + chipPositionalTopAdjustments[ i ] + "px, 0px) scale3d(4, 4, 1) }", 1 );
            } else {
                chipStyleSheet.insertRule( "#chip-wrapper > .chip-"  + chipPositionalClasses[i] + " { transform: translate3d(" + chipPositionalLeftAdjustments[ i ] + "px, " + chipPositionalTopAdjustments[ i ] + "px, 0px) scale3d(2, 2, 1) }", 1 );
            }
        }

        SVGgridMultiplier = $wrapperWidth * 0.02;
        cwGridPattern.attr({width: SVGgridMultiplier, height: SVGgridMultiplier});
        cwGridPatternPath.attr({d: "M "+ SVGgridMultiplier + " 0 L 0 0 0 " + SVGgridMultiplier});

    };

    /* ------------------ ### Handling Cursor Movement ### ------------------ */
    var handleGridCursorMove = function( event ) {
        if ( event ) {
            event = event.originalEvent;
            event.preventDefault();
            currentChipRow = Math.floor( ( event.pageY - wrapperOffset.top ) / smallChipSize );
            currentChipColumn = Math.floor( ( event.pageX - wrapperOffset.left ) / smallChipSize );
            newLocation = currentChipRow * 50 + currentChipColumn;
        } else {
            newLocation = lastUnProcessedLocation;
        }
        if ( currentChipColumn !== 0 &&  currentChipColumn !== 49 &&  currentChipRow !== 0 &&  currentChipRow !== 27 ) { /*--- Only update if we aren't currently doing DOM updates from the previous move. ---*/
            if ( !buildingInnerDOM ) { /*--- Only update if we aren't currently doing DOM updates from the previous move. ---*/
                window.queuedMove = false;

                if ( newLocation !== lastLocation ) { /*--- Only update everything if we have moved enough to have gone from one chip to another. ---*/
                    buildingInnerDOM = true;

                    for ( x = 0; x < 9; x++ ) {
                        currentPositionalIndex = newLocation + chipPositionalIndexAdjustments[ x ];
                        currentlyActiveChips.push( currentPositionalIndex );

                        if ( locationHistory.indexOf( currentPositionalIndex ) >= 0 ) {
                            existingChipsToAnimate.push( currentPositionalIndex );
                            existingChipsToAnimate.push( chipPositionalClasses[ x ] );
                        } else {
                            //console.log("it's NOT in the locationHistory: " + currentPositionalIndex);
                            newChipsToAnimate.push( currentPositionalIndex );
                            newChipsToAnimate.push( x );
                            locationHistory.push( currentPositionalIndex );
                        }

                        /* Since this is an active chip, it should be removed from the the previouslyActiveChips array, as those chips will all be deactivated at the loop's close */
                        prevActiveIndex = previouslyActiveChips.indexOf( currentPositionalIndex );
                        if ( prevActiveIndex >= 0 ) {
                            previouslyActiveChips.splice( prevActiveIndex, 1 );
                        }
                    }

                    animLoopIndex = 0;
                    requestAnimationID = requestAnimationFrame( updateInnerChipDOM );

                } /* END if ( newLocation !== lastLocation ) */
            } else {
                if ( newLocation !== lastUnProcessedLocation ) {
                    lastUnProcessedLocation = newLocation;
                    window.clearTimeout(queuedCursorMoveTimeout);
                    window.queuedMove = true;
                    queuedCursorMoveTimeout = window.setTimeout( function() {
                        if ( window.queuedMove ) {
                            console.log("fired timeout");
                            handleGridCursorMove(null);
                        }
                    }, 500);
                }
            } /* END test for currently building DOM */
        } /* END test for moving to edge */
    }; /* END handleGridCursorMove() */

    /* CLOSE INIT VARIABLES */

    setPixelDimensions();
    DOMmutationObserver.observe( $chipWrapper, DOMmutationObserverConfig);
    window.queuedMove = false;
    console.log("#### VERSION 5");
    $( $mouseListener ).on( "mousemove touchmove", _.throttle( handleGridCursorMove, 100 ) );

} ); /* CLOSE $( document ).ready */


/* ------------------ ### GENERAL STUFF ### ------------------
Nice TO Do

* figure out how to add this:
    DOMmutationObserver.disconnect();

* add priming class on new chip and when it is first created and becomes active. this class has:
    the default 3D transform (taking it off of tother chips)
    the drop shadow
        make the drop shadow on a pseudclass whose opacity animates in (and changes size as well)
    the border (if I add it back)

    remove the prime class from all ELs via a timeout after the animation period

     ------------------ ###### ---------------------*/