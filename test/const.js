/*
 * Unit Test for Mapael
 *
 * Constants
 */

CST_NB_OF_FRANCE_DPTMT = 96;
CST_MAP_MAX_WIDTH = 800;
CST_MAP_MAX_HEIGHT = 834.8948306319708; // Calculated

CST_MOUSEOVER_TIMEOUT_MS = 300; // 120 in code

CST_NB_OF_HOVER_CHECK = CST_NB_OF_FRANCE_DPTMT / 6 ; // We wont check all dptmt as it takes lot of times

CST_MAPCONF_NOANIMDURATION = {
    map : {
        defaultArea : {
            attrsHover : {
                animDuration : 0
            }
            , text : {
                attrsHover : {
                    animDuration : 0
                }
            }
        }
        , defaultPlot : {
            attrsHover : {
                animDuration : 0
            }
            , text : {
                attrsHover : {
                    animDuration : 0
                }
            }
        }
        , defaultLink : {
            attrsHover : {
                animDuration : 0
            },
            text : {
                attrsHover : {
                    animDuration : 0
                }
            }
        }
        , zoom : {
            animDuration : 0
        }
    }
};

