/*global define */
define('QueenLizGamePlay', ['GamePlay', 'Player', 'Tools', 'GameSession'], function (GamePlay, Player, Tools, GameSession) {

    'use strict';

    var QueenLizGamePlay = function (nNumPlayers, aCards, [], aPlayerNames, nMaxNumberOfSlots, nCardWidth, oCallbacks) {

        GamePlay.call(this, nNumPlayers, aCards, [], aPlayerNames, nMaxNumberOfSlots, nCardWidth, oCallbacks);

    };

    // inherits from GamePlay
    QueenLizGamePlay.prototype = Object.create(GamePlay.prototype);

    /**
     * Indicates who has the winning card on the table, based on the two
     * players' cards.
     *
     * @param aPlayerControllers a list of players
     *
     * @return number of the player whose table card is winning, or -1 if it's a
     *          tie; the first player is 0
     */
    QueenLizGamePlay.prototype.whoseCardWins = function (aPlayerControllers) {

        var nWinningPlayer = -1;

        if (aPlayerControllers[0].getTable().length > 0
            && aPlayerControllers[1].getTable().length > 0) {

            if (aPlayerControllers[0].getTableCard().value > this.playerControllers[1].getTableCard().value) {
                nWinningPlayer = 0;
            } else if (aPlayerControllers[0].getTableCard().value < aPlayerControllers[1].getTableCard().value) {
                nWinningPlayer = 1;
            }
        }

        return nWinningPlayer;
    };

    /**
     * makes a Player controller to manager a player locally
     *
     * @param nPlayerNum player number
     * @param aPlayers the list of players to add the player to
     * @param oPlayerRef a reference to the remote player
     * @param fnLocalPlayerWantsToPlayCard handler for when local player taps
     *          card in hand
     * @param sSessionId the ID of the current browser session
     * @param bIsLocal if the player is local
     */
    QueenLizGamePlay.prototype.makePlayerController = function(nPlayerNum, aPlayers, oPlayerRef, fnLocalPlayerWantsToPlayCard, sSessionId, bIsLocal) {

        // gets or creates player's browser session Id
        sSessionId = sSessionId ? sSessionId : GameSession.getBrowserSessionId();

        aPlayers.push(new Player(nPlayerNum, oPlayerRef, this.cardWidth, sSessionId, bIsLocal));
        aPlayers[nPlayerNum].setOnTapCardInHand(fnLocalPlayerWantsToPlayCard.bind(this));

    };

    return QueenLizGamePlay;
});
