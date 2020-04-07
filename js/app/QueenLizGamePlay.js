/*global define */
define('QueenLizGamePlay', ['GamePlay', 'Homebase', 'Stack', 'Tools', 'GameSession'], function (GamePlay, Homebase, Stack, Tools, GameSession) {

    'use strict';

    var QueenLizGamePlay = function (nNumPlayers, aCards, aHomebaseNames, nMaxNumberOfSlots, nCardWidth, oCallbacks) {

        GamePlay.call(this, nNumPlayers, aCards, aHomebaseNames, nMaxNumberOfSlots, nCardWidth, oCallbacks);

    };

    // inherits from GamePlay
    QueenLizGamePlay.prototype = Object.create(GamePlay.prototype);

    /**
     * makes a Homebase controller to manager a homebase locally
     *
     * @param nHomebaseNum homebase number
     * @param aHomebases the list of homebases to add the homebase to
     * @param oHomebaseRef a reference to the remote homebase
     * @param sSessionId the ID of the current browser session
     * @param bIsLocal if the homebase is local
     */
    QueenLizGamePlay.prototype.makeHomebaseController = function(nHomebaseNum, aHomebases, oHomebaseRef, sSessionId, bIsLocal) {

        // gets or creates homebase's browser session Id
        sSessionId = sSessionId ? sSessionId : GameSession.getBrowserSessionId();
        aHomebases.push(new Homebase(nHomebaseNum, oHomebaseRef, sSessionId, bIsLocal));

    };

    /**
     * makes a Stack controller to manager a stack locally
     *
     * @param oStackController the stack to create
     * @param oStackRef a reference to the remote stack
     * @param fnLocalHomebaseWantsToPlayCard handler for when local homebase taps
     *          card in hand
     */
    QueenLizGamePlay.prototype.makeStackController = function(oStackRef, fnLocalHomebaseWantsToPlayCard) {

        this.stackController = new Stack(oStackRef, this.cardWidth);
        this.stackController.setOnTapCardInHand(fnLocalHomebaseWantsToPlayCard.bind(this));

    };

    return QueenLizGamePlay;
});
