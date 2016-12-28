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
* Handling for jumping
* Fix coordinate positioning to be even
* Prefill next DOM els from any position?
* Handling for jumping
* Add any new DOM ELs, then apply classes
*/

 /* -------------------- INIT VARIABLES ---------------------*/
var /*--------------------- ### DOM elements ### ---------------------*/
    $mouseListener = document.getElementById( 'mouse-listener' ),
    cwGridPattern = $('#smallGrid'),
    cwGridPatternPath = $('#smallGrid path'),
    SVGgridMultiplier,
    $chipWrapper = document.getElementById( 'chip-wrapper' ),
    $console = document.getElementById( 'console' ),
    $wrapper = document.getElementById( 'wrapper' ),
    wrapperOffset = $( $wrapper ).offset(),
    $wrapperWidth,
    chipStyleSheet = document.styleSheets[0],

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
    allColorsLong = ["90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64",  "ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","8ec800","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","324038","cc8f84","d3c60f","1a3d61","453e41","91754d","b4a2b7","908c85","bc9c9e","91754d","4e4247","35468a","b93c7f","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A","EDD779","8CBF3E","9C8F76","e3ddd6","d7493e","b9af5b","a6a99c","555c64","ebcfcb","b9af5b","3b363e","774642","c8e1e6","eff0ec","7e8690","44aac2","3b363e","90b0ad","aa8f52","a786a0","cd2e4d","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64","90A6BE","2A426A","DB843C","8C7A41","EDD779","BE4931","FBB07D","8CBF3E","65BAAD","D1CEBD","2F3F37","A9593A", "EDD779","8CBF3E","9C8F76", "e3ddd6","d7493e","b9af5b","a6a99c","555c64"],
    chipPositionalLeftAdjustments = [],
    chipPositionalTopAdjustments = [],
    chipPositionalClasses = ['nw','n','ne','w','large','e','sw','s','se'],
    chipPositionalIndexAdjustments = [-101,-100,-99,-1,0,1,99,100,101],
    chipPositionalRowAdjustments = [ -1, -1, -1, 0, 0, 0, 1, 1, 1 ],
    chipPositionalColumnAdjustments = [ -1, 0, 1, -1, 0, 1, -1, 0, 1 ],
    bufferChipPositionalIndexAdjustments = [-202, -201, -200, -199, -198, -102, -98, -2, 2, 98, 102, 198, 199, 200, 201, 202],
    bufferChipPositionalRowAdjustments = [ -2, -2, -2, -2, -2, -1, -1, 0, 0, 1, 1, 2, 2, 2, 2, 2 ],
    bufferChipPositionalColumnAdjustments = [ -2, -1, 0, 1, 2, -2, 2, -2, 2, -2, 2, -2, -1, 0, 1, 2 ],
    defaultElementTransform = "translate3d(0px, 0px, 0px) scale3d(1, 1, 1)",

    /*--------------------- ### Animation Looping ### ---------------------*/
    chipTransform,
    currentPositionalIndex,
    animLoopIndex,
    prevActiveIndex,
    deactivatedChip,
    chipClass,
    chipZindex,
    previouslyActiveChipsLength,
    i,
    x,
    requestAnimationID;

    var updateOuterChipDOM = function( animLoopIndex ) {
        if ( animLoopIndex === 15) {
            console.log("should be starting inner loop");
            animLoopIndex = 0;
            requestAnimationID = requestAnimationFrame( updateInnerChipDOM );
        } else {
            currentPositionalIndex = newLocation + bufferChipPositionalIndexAdjustments[ animLoopIndex ];

            if ( locationHistory.indexOf( currentPositionalIndex ) === -1 ) {
                //console.log("it's NOT in the locationHistory: " + currentPositionalIndex);
                var newChip = '<div class="chip" id="chip' + currentPositionalIndex +'" style="transition:transform 1s;left:' + ( currentChipColumn + bufferChipPositionalColumnAdjustments[ animLoopIndex ] ) * smallChipSize + 'px;top:' + ( currentChipRow + bufferChipPositionalRowAdjustments[ animLoopIndex ] ) * smallChipSize + 'px;background-color:#' + allColorsLong[currentPositionalIndex] + '"></div>';
                $chipWrapper.innerHTML += newChip;
                locationHistory.push( currentPositionalIndex );
            }

            animLoopIndex++;
            console.log("anim loop: " + animLoopIndex);
            requestAnimationID = requestAnimationFrame( updateOuterChipDOM( animLoopIndex ) );
        }
    };

    var updateInnerChipDOM = function() {
        //console.log("allColorsLong: " + allColorsLong.length);
        if ( animLoopIndex > 8 ) {
            console.log("should be cancelling: " + animLoopIndex);
            cancelAnimationFrame( requestAnimationID );

            previouslyActiveChipsLength = previouslyActiveChips.length;

            if ( previouslyActiveChipsLength > 0 ) {
                for ( x = 0; x < previouslyActiveChips.length; x++ ) {
                    $('#chip' + previouslyActiveChips[ x ]).removeClass('chip-nw chip-n chip-ne chip-w chip-large chip-e chip-sw chip-s chip-se');
                }
            }

            previouslyActiveChips.length = 0;
            previouslyActiveChips = currentlyActiveChips.slice();
            currentlyActiveChips.length = 0;
        } else {
            console.log("anim loop first: " + animLoopIndex);
            currentPositionalIndex = newLocation + chipPositionalIndexAdjustments[ animLoopIndex ];
            currentlyActiveChips.push( currentPositionalIndex );

            if ( locationHistory.indexOf( currentPositionalIndex ) >= 0 ) {
                //var thisHereChip = document.getElementById( 'chip' + currentPositionalIndex );
                $('#chip' + currentPositionalIndex).removeClass('chip-nw chip-n chip-ne chip-w chip-large chip-e chip-sw chip-s chip-se')
                $('#chip' + currentPositionalIndex).addClass('chip-' + chipPositionalClasses[ animLoopIndex ]);
            } else {
                //console.log("it's NOT in the locationHistory: " + currentPositionalIndex);
                // var newChip = '<div class="chip" id="chip' + currentPositionalIndex +'" style="z-index:' + chipZindex + ';transform:' + defaultElementTransform + ';left:' + ( currentChipColumn + chipPositionalColumnAdjustments[ animLoopIndex ] ) * smallChipSize + 'px;top:' + ( currentChipRow + chipPositionalRowAdjustments[ animLoopIndex ] ) * smallChipSize + 'px;"></div>';
                // var newChip = '<div class="chip" id="chip' + currentPositionalIndex +'" style="transition:transform 0.5s;transform:' + defaultElementTransform + ';left:' + ( currentChipColumn + chipPositionalColumnAdjustments[ animLoopIndex ] ) * smallChipSize + 'px;top:' + ( currentChipRow + chipPositionalRowAdjustments[ animLoopIndex ] ) * smallChipSize + 'px;"></div>';
                // var newChip = '<div class="' + chipClass + '" id="chip' + currentPositionalIndex +'" style="left:' + ( currentChipColumn + chipPositionalColumnAdjustments[ animLoopIndex ] ) * smallChipSize + 'px;top:' + ( currentChipRow + chipPositionalRowAdjustments[ animLoopIndex ] ) * smallChipSize + 'px;"></div>';
                var newChip = '<div id="chip' + currentPositionalIndex +'" style="transition:transform 1s;left:' + ( currentChipColumn + chipPositionalColumnAdjustments[ animLoopIndex ] ) * smallChipSize + 'px;top:' + ( currentChipRow + chipPositionalRowAdjustments[ animLoopIndex ] ) * smallChipSize + 'px;background-color:#' + allColorsLong[ currentPositionalIndex ] + '"></div>';
                $chipWrapper.innerHTML += newChip;
                locationHistory.push( currentPositionalIndex );
                $( '#chip' + currentPositionalIndex ).addClass( "chip-" + chipPositionalClasses[ animLoopIndex ] );
                //$( '#chip' + currentPositionalIndex ).removeClass( 'chip-primer' );
            }

            prevActiveIndex = previouslyActiveChips.indexOf( currentPositionalIndex );

            if ( prevActiveIndex >= 0 ) {
                previouslyActiveChips.splice( prevActiveIndex, 1 );
            }

            animLoopIndex++;
            console.log("anim loop: " + animLoopIndex);
            requestAnimationID = requestAnimationFrame( updateInnerChipDOM );
        }
    };

    var setPixelDimensions = function( event ) {
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
        chipPositionalLeftAdjustments = [ -mediumChipLeftOffset, -mediumChipLeftOffset / 4, mediumChipLeftOffset, -mediumChipLeftOffset, -largeChipLeftOffset, mediumChipLeftOffset, -mediumChipLeftOffset, -mediumChipLeftOffset / 4, mediumChipLeftOffset ];
        chipPositionalTopAdjustments = [ -mediumChipTopOffset, -mediumChipTopOffset, -mediumChipTopOffset, -mediumChipTopOffset / 4, -largeChipLeftOffset, -mediumChipTopOffset / 4, mediumChipTopOffset, mediumChipTopOffset, mediumChipTopOffset ];
        chipStyleSheet.insertRule( "#chip-wrapper > div { height: " + smallChipSize + "px; width: " + smallChipSize + "px; }", 1 );

        for ( var i = 0; i < 9; i++ ) {
            chipStyleSheet.insertRule( "#chip-wrapper > .chip-"  + chipPositionalClasses[i] + " { transform: translate3d(" + chipPositionalLeftAdjustments[ i ] + "px, " + chipPositionalTopAdjustments[ i ] + "px, 0px) scale3d(2, 2, 1) }", 1 );
        }

        SVGgridMultiplier = $wrapperWidth * 0.02;
        cwGridPattern.attr({width: SVGgridMultiplier, height: SVGgridMultiplier});
        cwGridPatternPath.attr({d: "M "+ SVGgridMultiplier + " 0 L 0 0 0 " + SVGgridMultiplier});

    };

    /* ------------------ ### Handling Cursor Movement ### ------------------ */
    var handleGridCursorMove = function( event ) {
        /*--- TO DO HERE:
            handle when throttling has cuased us to skip a chip and we need to wind donw the last location, using thse params:
            newLocation - lastLocation

        ---*/
        currentChipRow = Math.floor( ( event.pageY - wrapperOffset.top ) / smallChipSize );
        currentChipColumn = Math.floor( ( event.pageX - wrapperOffset.left ) / smallChipSize );
        newLocation = currentChipRow * 50 + currentChipColumn;
        console.log("newLocation: " + newLocation);

        if ( newLocation !== lastLocation ) { /*--- Only update everything if we have moved enough to have gone from one chip to another. ---*/
            animLoopIndex = 0;
            requestAnimationID = requestAnimationFrame( updateInnerChipDOM );

            /*--------------------- ### Once per location update ### ---------------------
                Remove 'expired' members of the JS object and DOM tree that we consider collectively to be the app cache.
                Essentially, we allow about 12 moves in the color wall before we beginning expiring the original elements
            */
            lastLocation = newLocation;  /* -- So that we're ready for the next new location - */
            var locationsToExpireCount = locationHistory.length - 150;
            if ( locationsToExpireCount > 0 ) {
                for ( var i = locationsToExpireCount; i > 0; i-- ) {
                    var element = document.getElementById( 'chip' + locationHistory[ 0 ] );
                    element.parentNode.removeChild(element);
                    locationHistory.shift();
                }
            }

        } /* END if ( newLocation !== lastLocation ) */
    }; /* END handleGridCursorMove() */

    /* CLOSE INIT VARIABLES */

    setPixelDimensions();

    $( $mouseListener ).on( "mousemove", _.throttle( handleGridCursorMove, 200 ) );

} ); /* CLOSE $( document ).ready */


/* ------------------ ### GENERAL STUFF ### ------------------


//var newChip = '<div class="chip" id="chip' + currentPositionalIndex +'" style="transform:' + thisTransform + ';left:' + ( currentChipColumn + chipPositionalColumnAdjustments[ i ] ) * smallChipSize + 'px;top:' + ( currentChipRow + chipPositionalRowAdjustments[ i ] ) * smallChipSize + 'px;"></div>';

thisTransform = "matrix3d( X scale, 0, 0.00, 0, 0.00, Y scale, 0.00, 0, 0, 0, 1, 0, X translate, Y translate, 0, 1);
                // 'translate3d(' + thisHorizTransform + 'px, ' + thisVertTransform  + 'px, 0px)'
                // var newChip = $( '<div class="chip" id="chip' + currentChipPositionalIndex +'" style="transform: translate3d(' + thisHorizTransform + 'px, ' + thisVertTransform  + 'px, 0px);left:' + window.currentChipColumn * smallChipSize + 'px;top:' + window.currentChipRow * smallChipSize + 'px;"></div>' );

     ------------------ ###### ---------------------*/