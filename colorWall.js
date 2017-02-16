'use strict';
$( document ).ready( function() {
/*
TO DO:
* add documensation
*/

 /* -------------------- INIT VARIABLES ---------------------*/
var /*--------------------- ### DOM elements ### ---------------------*/
    allColorsRGB = [181,77,127,204,97,127,171,60,81,164,46,65,168,46,51,191,45,50,173,44,52,195,58,54,215,85,42,225,111,62,228,114,55,236,132,48,235,136,44,244,160,69,248,172,29,253,183,2,253,204,78,255,200,1,254,217,93,254,211,64,254,203,1,198,184,54,178,194,22,154,186,37,63,138,36,53,140,63,35,134,82,1,114,68,1,157,110,1,145,135,1,145,150,1,118,128,1,176,187,1,146,198,1,95,151,1,110,167,1,80,134,34,82,136,60,76,128,81,76,126,102,83,133,121,84,132,214,194,190,201,204,205,184,188,187,144,151,155,101,109,115,96,110,116,89,110,121,,,,237,234,224,243,238,227,223,217,207,211,204,196,214,211,204,208,206,200,235,209,219,227,192,207,203,154,173,184,126,147,146,87,111,149,61,104,146,52,91,242,209,195,242,184,167,231,149,128,216,123,106,199,99,86,184,84,68,184,71,61,245,214,169,246,205,142,244,191,119,238,183,107,235,173,94,223,153,56,216,143,50,238,227,178,230,216,142,217,198,97,206,188,85,196,177,70,172,152,37,156,139,31,192,227,218,161,212,200,137,198,183,112,186,167,83,163,143,54,137,118,1,108,79,195,223,232,176,214,230,155,200,222,125,181,211,90,158,192,35,119,162,9,76,115,212,216,215,190,193,195,168,174,177,149,155,160,125,132,139,98,105,112,62,75,84,247,247,241,237,234,229,231,226,218,227,222,215,226,222,216,218,217,212,208,206,201,237,213,221,232,192,207,216,153,177,196,123,149,162,86,111,133,65,88,124,54,85,240,209,195,243,193,171,228,151,128,221,120,97,198,95,71,180,75,52,192,77,53,245,222,175,247,211,145,251,209,135,251,203,120,247,190,91,242,175,70,227,154,51,233,229,179,218,215,144,210,208,131,196,196,118,180,176,90,152,151,70,132,126,53,193,230,223,161,213,203,138,197,186,117,185,174,97,168,157,59,140,128,1,109,96,203,216,225,178,200,216,142,169,194,124,154,181,107,140,169,76,107,138,40,74,112,198,202,202,176,181,181,160,165,167,147,152,153,127,132,134,97,102,105,68,72,77,238,239,234,233,235,231,227,228,225,222,224,222,222,223,220,222,225,223,220,222,220,241,211,218,239,192,203,227,146,161,212,124,140,176,75,99,172,67,98,153,50,78,243,208,189,242,189,162,226,148,111,214,124,86,196,99,62,177,83,60,147,64,47,251,228,179,253,223,160,254,223,148,251,214,130,251,208,115,244,196,84,255,199,35,220,225,184,197,205,143,175,185,106,159,172,92,151,165,84,122,136,51,108,123,48,194,229,229,167,220,220,146,208,208,110,194,196,58,169,174,1,133,139,1,116,120,204,219,229,184,205,221,151,179,208,116,152,190,100,135,176,78,115,159,22,69,118,203,204,201,189,189,183,167,168,162,147,149,145,127,129,126,99,101,98,88,88,88,228,228,221,224,224,217,220,221,216,221,221,214,227,226,217,226,224,215,226,224,214,241,210,215,240,188,201,235,146,163,221,119,136,200,79,104,189,76,95,165,58,78,243,211,191,243,193,163,232,157,111,213,126,82,197,102,57,187,97,62,195,85,48,245,224,177,246,221,163,246,213,143,246,201,115,241,186,85,234,174,71,214,152,53,215,227,202,192,210,173,171,202,153,153,194,133,127,172,110,79,133,74,47,95,58,194,224,227,166,208,214,151,203,210,125,193,203,77,166,178,8,128,142,1,113,126,216,221,230,199,209,226,187,197,222,167,178,212,139,152,196,101,114,165,62,67,113,200,203,196,178,181,175,163,167,160,146,148,141,124,125,117,99,101,95,68,73,61,229,225,216,230,225,217,229,226,218,227,221,211,231,225,215,223,218,209,222,216,207,242,213,215,240,193,198,237,147,157,214,105,114,187,75,81,164,46,55,157,55,60,244,211,179,244,198,159,242,184,140,242,172,120,230,149,95,203,120,65,195,111,62,244,225,174,245,214,143,241,205,123,238,194,95,225,176,71,214,160,43,196,137,25,211,223,195,189,208,171,169,192,149,157,182,130,133,161,106,100,129,73,88,113,63,198,227,232,166,212,222,139,196,209,113,184,199,52,163,182,1,132,152,1,110,133,223,217,228,209,203,223,189,180,212,175,165,199,150,141,184,113,105,152,77,66,110,211,206,196,220,216,208,183,183,178,171,176,172,165,169,168,150,154,150,102,109,105,243,238,231,242,236,230,229,220,214,230,221,213,228,220,212,227,219,212,223,217,210,241,198,196,240,179,178,237,145,144,215,108,110,183,78,79,164,56,52,159,68,66,244,212,175,245,200,148,239,181,122,230,159,95,216,139,77,210,130,64,168,94,57,245,225,172,247,215,138,234,195,101,219,176,74,209,164,54,196,152,50,143,108,62,204,226,202,174,210,176,142,194,152,120,177,133,104,166,120,73,133,85,36,94,54,180,224,231,143,208,221,115,192,210,86,181,202,1,160,184,1,129,158,1,96,129,223,220,229,210,200,221,192,175,208,179,161,198,161,138,183,126,101,150,98,73,119,209,210,203,206,206,198,204,204,197,197,200,196,194,192,186,170,169,164,160,160,154,244,239,228,240,234,220,239,232,219,232,222,205,226,218,202,220,209,191,226,211,191,242,204,197,240,175,168,238,148,137,217,118,108,178,71,67,161,59,52,144,57,52,244,217,177,245,207,155,245,199,142,239,185,123,234,170,98,223,152,78,210,130,51,242,234,195,244,232,178,246,227,161,247,229,148,237,210,111,221,184,53,203,169,1,209,227,210,183,215,191,159,205,177,138,193,161,87,170,128,52,138,93,1,104,68,183,223,232,162,213,231,137,198,223,93,179,212,40,158,196,1,124,167,1,93,135,229,219,229,218,199,218,194,164,194,167,133,167,147,116,150,124,90,126,93,57,95,207,202,199,188,184,182,173,168,165,158,151,147,132,123,119,109,101,98,102,93,87,247,239,222,248,238,219,244,233,214,244,232,210,242,229,207,242,227,202,233,217,192,224,205,209,210,182,190,185,149,161,158,109,121,141,88,105,109,52,79,83,54,64,237,210,192,228,185,162,217,152,124,204,137,108,193,120,92,173,101,76,153,75,53,239,221,193,232,200,158,225,189,142,214,173,120,204,155,92,192,144,86,164,118,60,224,221,189,203,201,157,187,185,138,174,172,122,149,148,92,113,113,62,95,96,51,191,210,201,168,193,183,148,178,166,126,162,152,95,136,125,71,111,101,18,74,66,197,216,222,179,201,211,151,180,195,131,162,180,106,142,161,67,113,139,33,87,114,204,197,189,185,178,169,171,163,154,152,143,133,134,122,111,111,100,89,86,69,55,246,240,226,232,226,212,238,232,215,232,223,202,234,223,201,232,220,198,224,209,184,232,212,213,218,189,193,199,158,162,174,128,135,158,107,117,137,84,96,99,51,62,236,207,187,229,185,155,219,156,123,196,123,91,180,104,72,162,88,58,146,78,60,228,206,172,220,189,146,210,176,132,203,165,118,193,151,99,173,132,81,144,106,58,219,221,189,199,205,168,171,180,134,155,163,115,136,145,93,109,118,69,87,98,56,195,215,211,180,204,201,163,192,189,140,174,171,81,134,130,46,104,100,1,85,79,206,217,221,178,199,211,139,167,187,123,153,176,106,138,164,80,107,132,37,71,106,212,204,195,193,182,171,183,171,159,160,146,135,141,127,117,117,104,97,91,75,68,240,235,224,243,229,210,243,230,212,237,225,206,233,220,198,231,215,194,231,216,190,235,209,207,220,182,181,195,147,147,168,115,118,153,93,98,134,76,82,114,57,65,235,204,179,224,179,146,219,164,128,212,150,110,195,128,88,180,108,66,166,97,60,219,199,168,205,181,146,197,170,133,186,156,117,179,145,103,156,122,86,138,102,69,218,226,205,197,209,178,163,180,140,143,162,119,120,141,96,96,114,79,71,88,66,190,219,216,158,198,198,144,189,189,123,177,178,92,149,152,60,121,125,1,99,103,203,213,219,187,199,210,153,167,184,133,149,170,108,127,154,81,101,130,59,73,109,209,203,193,191,182,170,173,162,149,158,146,132,136,123,108,116,104,90,92,77,60,247,239,227,243,233,215,235,221,203,237,221,202,240,225,208,231,215,198,227,210,184,237,211,210,230,189,189,207,138,141,186,113,118,173,94,101,151,73,83,134,58,66,237,208,182,232,190,155,227,171,123,214,153,105,205,140,93,187,119,72,176,108,62,233,214,176,225,194,141,213,177,118,201,158,83,188,147,77,170,128,58,153,111,50,207,221,199,179,203,170,139,169,127,117,148,107,94,127,87,66,96,60,64,88,64,199,223,224,176,210,214,159,197,204,132,180,190,91,150,162,33,119,134,1,90,107,214,217,222,189,195,205,153,160,178,137,144,163,117,124,145,93,101,123,59,60,90,204,201,192,188,183,173,172,167,158,158,153,145,144,138,131,120,115,110,79,72,66,236,225,209,234,226,212,233,222,207,230,220,205,224,214,200,231,219,204,226,211,196,235,206,203,227,183,177,205,142,137,195,127,122,181,105,102,160,82,78,142,55,56,243,217,186,240,203,151,227,172,114,215,153,93,198,136,74,182,116,59,177,106,55,228,208,165,220,199,151,210,186,131,194,164,98,184,155,89,156,127,65,149,121,61,200,216,196,172,194,168,152,176,146,142,164,134,108,136,103,83,113,80,32,81,52,199,216,219,175,199,205,159,187,195,136,171,180,104,144,157,66,117,132,23,90,108,218,214,219,197,192,201,162,155,170,144,138,155,126,119,142,100,94,119,62,56,90,206,198,187,190,181,169,168,160,147,151,144,131,129,122,110,107,100,91,84,80,74,238,233,224,244,239,229,239,232,221,237,230,219,230,221,212,232,222,211,229,221,208,235,207,195,227,181,168,205,142,127,191,121,110,179,103,93,160,88,79,123,55,48,242,213,176,237,195,142,232,184,127,229,174,107,213,152,88,199,133,56,182,125,60,221,205,166,203,181,132,190,167,117,177,151,95,157,131,68,142,119,63,122,104,65,198,213,201,170,194,179,145,175,157,125,155,137,97,130,108,79,106,86,61,85,65,197,220,224,173,204,211,155,191,201,131,175,188,91,146,162,47,119,139,1,93,117,224,218,223,209,198,210,176,163,182,154,140,162,122,107,133,103,90,117,68,55,87,207,202,189,191,182,167,175,166,150,149,141,127,134,126,112,100,90,75,85,76,62,243,226,201,243,227,202,242,227,206,239,222,209,238,222,213,240,225,216,243,209,200,234,205,193,226,182,167,206,147,130,181,116,102,168,94,83,143,68,56,131,56,42,245,222,187,237,199,150,234,191,134,221,172,109,214,158,89,204,146,73,186,127,56,223,212,176,207,194,145,196,180,125,187,168,106,156,145,82,141,132,77,101,95,45,196,217,206,172,202,188,148,181,166,129,165,149,107,146,127,84,120,103,42,79,67,194,218,224,169,201,215,133,176,196,111,157,179,83,137,161,34,101,127,1,69,94,219,207,212,203,184,192,170,142,154,155,126,139,139,104,120,126,90,109,95,63,84,216,207,190,192,185,169,178,172,156,174,165,148,167,160,148,161,156,143,134,133,120,233,225,202,231,223,197,233,224,197,237,224,197,243,234,198,243,232,194,250,217,122,,,,201,176,171,184,157,154,163,136,135,144,118,118,118,89,93,95,61,63,211,200,189,194,180,167,181,165,151,160,142,126,144,120,101,122,100,85,95,75,63,223,211,195,207,190,169,192,173,150,175,152,127,160,133,104,143,118,89,105,82,57,209,204,185,193,188,167,178,172,150,158,153,133,137,132,115,107,103,87,94,89,73,194,207,207,171,190,191,155,175,178,139,159,160,122,145,146,93,114,116,74,93,95,207,201,200,189,184,184,174,169,170,148,145,148,123,120,125,96,94,99,79,77,81,200,188,171,196,183,165,179,164,145,173,160,144,167,149,130,156,138,121,130,116,102,222,221,209,228,232,218,224,231,218,226,226,209,236,234,213,228,228,206,212,231,195,215,200,194,195,177,172,182,160,154,160,136,130,140,112,106,122,95,90,90,53,50,213,199,186,198,181,167,185,167,150,165,143,123,145,120,100,120,95,76,96,76,61,218,202,178,204,183,155,192,169,139,171,149,121,148,127,101,134,112,87,110,84,60,206,206,189,187,188,167,172,173,151,152,154,130,127,130,102,101,104,76,79,82,58,188,203,206,164,183,189,150,170,176,128,150,157,96,125,132,71,98,106,36,70,83,207,201,200,188,182,182,173,165,165,152,145,146,131,125,127,103,96,100,68,62,64,209,199,184,192,178,162,177,162,144,160,144,127,138,122,106,113,99,84,86,69,54,224,231,226,220,223,215,215,223,216,216,226,216,215,228,219,215,235,226,135,220,206,214,200,192,198,179,169,184,161,150,162,135,125,148,117,105,128,98,87,90,56,45,218,200,184,202,179,160,191,163,141,163,132,108,149,114,88,129,93,64,105,72,44,217,207,186,200,187,163,184,169,146,164,148,126,142,127,106,120,105,87,102,84,62,209,211,199,189,192,179,159,166,148,144,152,134,122,135,117,98,110,96,70,84,72,203,212,212,182,195,196,166,178,181,144,160,166,111,132,140,83,104,114,32,70,82,203,201,201,181,177,181,166,163,169,143,138,145,115,111,120,93,89,98,74,70,83,219,206,189,205,191,176,202,186,168,197,182,164,172,154,138,161,141,125,130,111,94,220,231,232,224,232,231,218,226,224,216,231,230,211,231,233,214,228,231,127,195,225,219,199,189,207,180,168,195,164,151,168,133,122,156,110,99,133,89,79,93,56,49,215,197,179,201,178,156,188,163,139,168,142,118,148,122,98,125,100,77,101,80,61,224,207,176,208,186,148,198,176,138,185,164,126,172,149,113,154,129,94,127,103,67,209,208,198,190,191,178,171,172,159,149,151,138,123,128,112,100,105,92,78,81,71,205,210,210,184,190,190,169,176,177,145,153,156,114,124,127,89,99,104,35,56,63,206,201,204,189,181,185,175,167,172,157,144,147,133,119,123,105,92,98,78,66,71,47,47,48,49,48,49,50,49,50,49,54,58,50,54,57,55,58,58,67,67,65,216,224,223,221,226,224,219,223,224,225,230,230,224,222,218,221,220,219,194,203,224,222,202,189,209,183,168,193,163,146,174,142,126,157,120,104,137,102,86,105,67,54,220,199,179,210,183,158,197,168,141,181,151,120,137,103,74,114,82,55,118,81,56,221,208,182,205,187,156,195,176,144,177,159,128,159,142,113,135,116,89,102,84,57,201,201,192,182,181,171,166,166,155,148,148,136,127,126,114,109,108,98,100,100,90,201,217,224,183,201,209,158,180,192,138,163,177,112,141,158,78,114,135,50,88,110,209,197,196,193,178,179,179,163,165,157,141,142,139,124,126,111,92,95,78,49,50,68,55,53,64,51,48,57,43,45,57,52,55,53,51,55,59,55,60,58,55,62,233,221,212,231,219,211,229,218,212,227,217,213,228,219,216,226,222,219,202,178,210,217,205,195,203,185,171,187,165,149,165,140,123,150,122,106,113,82,67,79,52,38,220,199,173,207,181,151,193,164,133,185,153,116,167,131,97,148,110,72,123,88,56,219,208,185,205,189,162,193,174,145,172,157,131,153,137,112,126,111,89,93,81,62,205,210,202,190,195,187,174,179,169,150,156,146,122,128,118,94,98,89,68,72,61,191,201,208,170,186,198,152,169,183,137,156,170,118,139,154,93,111,127,62,80,99,212,205,202,194,182,182,177,163,161,159,146,145,134,120,117,110,97,95,77,60,60,43,67,96,35,64,88,40,56,73,61,68,80,81,87,99,47,61,76,43,52,65,129,50,53,128,53,50,124,50,57,105,43,43,117,53,49,112,50,41,124,69,61,214,199,185,197,177,162,181,159,143,156,131,115,142,114,95,120,91,71,99,69,51,215,197,174,199,177,152,186,161,133,167,140,113,158,129,99,138,107,77,112,87,63,209,205,191,191,185,170,176,171,156,157,152,135,139,131,114,114,107,91,90,82,67,194,205,197,173,187,178,155,170,162,141,158,151,124,142,135,94,112,106,52,59,54,202,208,210,184,192,195,173,181,185,151,159,165,122,132,141,96,107,117,88,97,104,209,197,190,191,177,170,172,158,151,158,144,137,140,126,120,117,103,97,86,67,59,240,236,226,232,227,217,236,229,216,230,223,211,229,223,210,227,222,208,226,221,208,129,88,91,114,53,61,110,54,55,110,66,62,93,55,54,87,62,62,81,50,59,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,237,236,230],
    $mouseListener = document.getElementById( 'mouse-listener' ),
    $chipWrapper = document.getElementById( 'chip-wrapper' ),
    $wrapper = document.getElementById( 'wrapper' ),
    wrapperOffset = $( $wrapper ).offset(),
    $wrapperWidth,
    chipStyleSheet = document.styleSheets[0],
    /*------- ### Canvas EL ### ------*/
    cwCanvas = document.getElementById( 'color-wall-canvas' ),
    cwContex = cwCanvas.getContext( "2d" ),
    cwImageData = cwContex.getImageData( 0, 0, 1176, 462 ),
    cwData = cwImageData.data,

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
    rgbIndex = 0,
    pixelIndex = 0,

    /*--------------------- ### Layout Related ### ---------------------*/
    canvasChipXCount = 56, /* WWWWW */
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
    chipPositionalLeftAdjustments = [],
    chipPositionalTopAdjustments = [],
    chipPositionalClasses = ['nw','n','ne','w','large','e','sw','s','se'],
    chipPositionalIndexAdjustments = [-57,-56,-55,-1,0,1,55,56,57],
    chipPositionalRowAdjustments = [ -1, -1, -1, 0, 0, 0, 1, 1, 1 ],
    chipPositionalColumnAdjustments = [ -1, 0, 1, -1, 0, 1, -1, 0, 1 ],

    /*--------------------- ### Animation Looping ### ---------------------*/
    currentPositionalIndex,
    animLoopIndex,
    prevActiveIndex,
    deactivatedChip,
    chipClass,
    chipZindex,
    previouslyActiveChipsLength,
    lastUnProcessedLocation = '',
    stillUpdatingDOM = false,
    stillExpiringChips = false,
    readyToUpdate = true,
    queuedMoveToProcess,
    cachedChipsAreChecked,
    cachedChipsArePruned,
    chipPruningRAFloop,
    DOMmutationObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        stillUpdatingDOM = false;
        stillExpiringChips = false;
      });
    }),
    DOMmutationObserverConfig = { childList: true },
    i,
    x,
    chipUpdateRAFloop;

    var createCanvasImage = function() {
        var rgbIndex = 0,
            canvasCurrentX = 0,
            canvasCurrentY = 0,
            totalChipCount = 1232;

        for ( var canvasLoopIndex = 0; canvasLoopIndex < totalChipCount; canvasLoopIndex++ ) {
            rgbIndex = canvasLoopIndex * 3;

            canvasCurrentX = ( canvasLoopIndex % 56 ) * 21;

            canvasCurrentY = Math.floor( canvasLoopIndex / 56 ) * 21;

            cwContex.fillStyle = 'rgb(' + allColorsRGB[ rgbIndex ] + ',' + allColorsRGB[ rgbIndex + 1 ] + ',' + allColorsRGB[ rgbIndex + 2 ] + ')';

            cwContex.fillRect( canvasCurrentX, canvasCurrentY, 20, 20);
        }
    };

    /* ------------------ ### How the Animation Loop Works ### ------------------
    Default state is:
        stillExpiringChips = false
        stillUpdatingDOM = false
        readyToUpdate = true

        When non-throttled pointer move takes us to a new position:
            If a previous move isn't currently being processed:
                handleGridCursorMove() sets the top level animation loop flag - readyToUpdate - to false so that the triggered DOM updates can happen without interruption.
                This flag won't be set back to true until the updateInnerChipDOM() and pruneCachedChips() methods complete.

                handleGridCursorMove() also creates the arrays for new chips which need added to the DOM and existing chips that will have a new postional index.
                Remember that the vast majority of chips are not activated at any given time.

                handleGridCursorMove() also creates the array of active chips that may need deactivated with the next move.

                    updateInnerChipDOM() begins running in a RAF loop. It first loops through adding any new chip ELs. Every time a new chip is added the stillUpdatingDOM flag is set to true and the RAF loop is blocked
                    until the flag is set back to false, which will be done by a the DOMmutationObserver after the new chip is added to the DOM.

                    After all the new chips are added it updates classes for active chips and then deactivates chips as appropriate.

                    Next pruneCachedChips() is called and runs through a RAF loop, removing any old chips from the JS memory and the DOM. Every time a new chip is removed from the DOM
                    the stillExpiringChips flag is set to true and the RAF loop is blocked until the flag is set back to false, which will be done by a the DOMmutationObserver after the new chip is removed from the DOM

                    Finally updateInnerChipDOM() checks for any queued moves to process. If it finds any it calls itself, beginning the whole process again.
                    If no queued moves are found, all the loop tracking vars are returned to their default state, including readyToUpdate being set to true
            Else:
                The queuedMoveToProcess flag will be set to true and that location will be saved to potentially be executed when move processing is complete.
    */

    /* ------------------ ### Handling Cursor Movement ### ------------------ */
    var handleGridCursorMove = function( event ) {
        if ( event ) { /* A queued pointer move not have an event and will use the last new location that was set */
            var eventOrig = event.originalEvent; /* Need for touch devices */
            eventOrig.preventDefault(); /* PreventOrigs swiping on touch devices */
            eventOrig.stopPropagation();
            currentChipRow = Math.floor( ( eventOrig.pageY - wrapperOffset.top ) / smallChipSize );
            currentChipColumn = Math.floor( ( eventOrig.pageX - wrapperOffset.left ) / smallChipSize );
            newLocation = currentChipRow * 56 + currentChipColumn; /* This is here so that it won't be reset when a queued move calls the method */
        }

        if ( currentChipColumn !== 0 && currentChipColumn !== 55 && currentChipRow !== 0 && currentChipRow !== 22 ) { /*--- Don't update for edge chips, cuz that's hard!  :( ---*/
            if ( readyToUpdate ) { /*--- Only update if we aren't currently doing DOM updates from the previous move. ---*/
                if ( newLocation !== lastLocation ) { /*--- Only update everything if we have moved enough to have gone from one chip to another. ---*/
                    queuedMoveToProcess = false; /* Starting a new animation loop that will supercede any moves that were previously queued. This will be set back to true is a move is queued while this animation loop is running. */
                    readyToUpdate = false;

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
                            console.log("Adding to location history: " + currentPositionalIndex);
                            //console.log( locationHistory );
                        }

                        /* Since this is an active chip, it should be removed from the the previouslyActiveChips array, as those chips will all be deactivated at the loop's close */
                        prevActiveIndex = previouslyActiveChips.indexOf( currentPositionalIndex );
                        if ( prevActiveIndex >= 0 ) {
                            previouslyActiveChips.splice( prevActiveIndex, 1 );
                        }
                    }

                    animLoopIndex = 0;
                    chipUpdateRAFloop = requestAnimationFrame( updateInnerChipDOM );

                } /* END if ( newLocation !== lastLocation ) */

            } else { /*  */
                if ( newLocation !== lastUnProcessedLocation ) {
                    lastUnProcessedLocation = newLocation;
                    queuedMoveToProcess = true; /*  */
                }
            } /* END test for currently building DOM */
        } /* END test for moving to edge */
    }; /* END handleGridCursorMove() */

    var updateInnerChipDOM = function() {
        if ( !stillUpdatingDOM ) { /* Blocking updates for this RAF loop, update might run in the next loop */
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
                existingChipsToAnimate.length = 0; /* Reset the currently active chips array */
                newChipsToAnimate.length = 0;
                stillUpdatingDOM = false;
                /* wwww NTO SURE THIS IS THE CORRECT SPOT readyToUpdate = true;  */

                cancelAnimationFrame( chipUpdateRAFloop );  /* Finished running the loop that updates the chip DOM */

                if ( queuedMoveToProcess ) {
                    readyToUpdate = true; /* Since there was a move queued we need to set this flag to allow a new update RAF loop to begin, if appropriate */
                    newLocation = lastUnProcessedLocation;
                    queuedMoveToProcess = false;
                    //console.log("Executing queued change");
                    handleGridCursorMove( null );
                } else {
                    chipPruningRAFloop = requestAnimationFrame( pruneCachedChips );  /* No outstanding moves to process, move on to pruning the app state */
                }

            } else {
                stillUpdatingDOM = true; /* This will be set to false by the DOMmutationObserver after the new chip is added to the DOM */
                var RGBarrayIndex = newChipsToAnimate[ animLoopIndex ] * 3;
                var newChip = '<div class="chip-priming" id="chip' + newChipsToAnimate[ animLoopIndex ] +'" style="left:' + ( currentChipColumn + chipPositionalColumnAdjustments[ newChipsToAnimate[ animLoopIndex + 1 ] ] ) * smallChipSize + 'px;top:' + ( currentChipRow + chipPositionalRowAdjustments[ newChipsToAnimate[ animLoopIndex + 1 ] ] ) * smallChipSize + 'px;color:rgb(' + allColorsRGB[ RGBarrayIndex ] + ',' + allColorsRGB[ RGBarrayIndex + 1] + ',' + allColorsRGB[ RGBarrayIndex + 2 ] + ')"></div>';
                $chipWrapper.innerHTML += newChip;
                animLoopIndex += 2;
                chipUpdateRAFloop = requestAnimationFrame( updateInnerChipDOM );
            }
        } else {
            chipUpdateRAFloop = requestAnimationFrame( updateInnerChipDOM );
        }
    };  /* CLOSE updateInnerChipDOM */

    var pruneCachedChips = function( event ) {
        /* Remove 'expired' members of the JS object and DOM tree that we consider collectively to be the app cache.
            Essentially, we allow about 35 moves in the color wall before we beginning expiring the original elements */

        if ( !cachedChipsAreChecked ) { /* locationsToExpireCount needs set once when a pruneCachedChips RAF loop is first kick off */
            var locationsToExpireCount = locationHistory.length - 200;
            cachedChipsAreChecked = true;
        }

        if ( locationsToExpireCount > 0 ) {
            if ( !stillExpiringChips ) {
                console.log("expiring chip #: " + locationHistory[ 0 ]);
                stillExpiringChips = true; /* This will be set to false by the DOMmutationObserver after the new chip is removed from the DOM */
                // var element = document.getElementById( 'chip' + locationHistory[ 0 ] );
                // element.parentNode.removeChild(element);
                locationHistory.shift();
                locationsToExpireCount -= 1;
                var element = document.getElementById( 'chip' + locationHistory[ 0 ] );
                element.parentNode.removeChild(element);
            }
            // } else {
            //     chipPruningRAFloop = requestAnimationFrame( pruneCachedChips );
            // }
            chipPruningRAFloop = requestAnimationFrame( pruneCachedChips );
        } else { /* We're completely finished running an animation loop and return all the loop tracking vars to their default state */
            lastLocation = newLocation;  /* -- So that we're ready for the next new location - */
            cachedChipsAreChecked = false;
            stillExpiringChips = false;
            readyToUpdate = true;
            cancelAnimationFrame( pruneCachedChips );
        }
    }

    var setPixelDimensions = function( event ) {
        $wrapperWidth = $( $wrapper ).width();
        // $( $wrapper ).height( Math.round( $wrapperWidth * 0.56 ) ); THIS WILL NEED TURNED BACK ON
        canvasChipXCount = 56; /* The number of columns in the Color Wall */
        smallChipSize = Math.round( $wrapperWidth / canvasChipXCount );
        mediumChipSize = Math.round( $wrapperWidth / canvasChipXCount );  // was Math.round( $wrapperWidth / canvasChipXCount * 2 )
        mediumChipLeftOffset = Math.round( $wrapperWidth / canvasChipXCount * 1.75 );
        mediumChipTopOffset = Math.round( $wrapperWidth / canvasChipXCount * 1.75 ); // should be 2?;
        largeChipSize = Math.round( $wrapperWidth / canvasChipXCount );  // was Math.round( $wrapperWidth / canvasChipXCount * 4 )
        largeChipLeftOffset = 0; // was Math.round( $wrapperWidth / canvasChipXCount * 0.375 );?
        largeChipTopOffset = 0;
        chipPositionalLeftAdjustments = [ -mediumChipLeftOffset, 0, mediumChipLeftOffset, -mediumChipLeftOffset, -largeChipLeftOffset, mediumChipLeftOffset, -mediumChipLeftOffset, 0, mediumChipLeftOffset ];
        chipPositionalTopAdjustments = [ -mediumChipTopOffset, -mediumChipTopOffset, -mediumChipTopOffset, 0, -largeChipLeftOffset, 0, mediumChipTopOffset, mediumChipTopOffset, mediumChipTopOffset ];
        chipStyleSheet.insertRule( "#chip-wrapper > div { height: " + smallChipSize + "px; width: " + smallChipSize + "px; }", 1 );

        for ( var i = 0; i < 9; i++ ) {
            if ( i === 4 ) {
                chipStyleSheet.insertRule( "#chip-wrapper > .chip-"  + chipPositionalClasses[i] + " { transform: translate3d(" + chipPositionalLeftAdjustments[ i ] + "px, " + chipPositionalTopAdjustments[ i ] + "px, 0px) scale3d(6, 6, 1) }", 1 );
            } else {
                chipStyleSheet.insertRule( "#chip-wrapper > .chip-"  + chipPositionalClasses[i] + " { transform: translate3d(" + chipPositionalLeftAdjustments[ i ] + "px, " + chipPositionalTopAdjustments[ i ] + "px, 0px) scale3d(2.5, 2.5, 1) }", 1 );
            }
        }
    };
    /* CLOSE INIT VARIABLES */

    setPixelDimensions();
    createCanvasImage();
    DOMmutationObserver.observe( $chipWrapper, DOMmutationObserverConfig);
    console.log("#### VERSION 15");
    // $( $mouseListener ).on( "mousemove touchmove", _.throttle( handleGridCursorMove, 100 ) );
    $( $mouseListener ).on( "mousemove touchmove", handleGridCursorMove );

} ); /* CLOSE $( document ).ready */


/* ------------------ ### GENERAL STUFF ### ------------------
* TROUBLE SHOOTING:
* create new div to display output on simulator
* confirm size of dyncamilly sized els to confirm no rounding errors
* programmatically send severl moves to see if it is the touch interface causing the issue

Nice TO DO
* figure out how to add this:
    DOMmutationObserver.disconnect();

* add priming class on new chip and when it is first created and becomes active. this class has:
    the default 3D transform (taking it off of tother chips)
    the drop shadow
        make the drop shadow on a pseudclass whose opacity animates in (and changes size as well)
    the border (if I add it back)
     ------------------ ###### ---------------------*/