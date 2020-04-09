/*global require */
/*global Audio: false */
requirejs(['QueenLizGamePlay', 'Tools'], function (QueenLizGamePlay, Tools) {

    'use strict';

    var GameBox = function () {

        var MAX_NUMBER_OF_SLOTS = 3;
        var CARD_WIDTH = 68;

        var i,
            nPlayer;

        this.slotNumber;
        this.players = [];
        this.maxNumberOfSlots = MAX_NUMBER_OF_SLOTS;
        this.cardWidth = CARD_WIDTH;

        this.dictionaries = null;

    };

    /**
     * makes the initial view
     */
    GameBox.makeView = function () {

        var oGameView = document.createElement('div');
        Tools.setClass(oGameView, 'game');
        oGameView.setAttribute('id', 'game');

        document.body.insertBefore(oGameView, null);

        var oPlayAreaView = document.createElement('div');
        Tools.setClass(oPlayAreaView, 'playArea');
        oPlayAreaView.setAttribute('id', 'playArea');

        oGameView.insertBefore(oPlayAreaView, null);

        var oResultView = document.createElement('div');
        Tools.setClass(oResultView, 'result');
        oResultView.setAttribute('id', 'result');

        document.body.insertBefore(oResultView, null);
    };

    GameBox.getRandomName = function (nName, aNames, sNotThisName) {

        var i, aCopyOfNames = [];
        for (i = 0; i < aNames.length; i++) {
            if (aNames[i] !== sNotThisName) {
                aCopyOfNames.push(aNames[i]);
            }
        }

        var aShuffledNames = Tools.shuffle(aCopyOfNames);

        if (aShuffledNames.length > 0) {
            return aShuffledNames[0];
        }

        return 'Name' + nName;
    };

    GameBox.renderResult = function (sResult) {
        var oResultView = document.getElementById('result');

        var oContent = document.createTextNode(sResult ? sResult : '');
        if (oResultView.firstChild) {
            oResultView.removeChild(oResultView.firstChild);
        }
        oResultView.appendChild(oContent);
    };

    GameBox.prototype.makeCards = function (aCardValues) {
        var aCards = [];

        var i;

        // distributes the cards into suits
        for (i = 0; i < aCardValues.length; i++) {
            aCards.push({
                value: aCardValues[i],
            });
        }

        return aCards;
    };

    GameBox.prototype.getDictionary = function (oSuccessFunction) {

        var oGameBox = this;
        var oDatabase = firebase.database();
        var oDictionariesReference = oDatabase.ref('dictionaries');
    
        oDictionariesReference.once('value', function (snapshot) {
            oGameBox.dictionaries = snapshot.val();

            oSuccessFunction.call(oGameBox);
        });
    
    };

    GameBox.prototype.getDictionarySuccess = function () {

        var nNumPlayers = 2;

        var oDictionary = oGameBox.dictionaries['english-family'];
        var aQueenLizCardValues = _convertDictionaryObjectsToElements(oDictionary);

        // var aQueenLizCardValues = [
        //     'scientist', 'scale', 'advantage', 'cost', 'psychology',
        //     'jogging', 'air', 'parachute', 'shoes', 'paint',
        //     'flour', 'lake', 'slope', 'lock', 'flake',
        //     'whiskey', 'bagel', 'feta cheese', 'watermelon', 'pumpernickel',
        //     'beach', 'watergun', 'cobblestones', 'baby', 'wheat'
        // ];
    
        var aCards = oGameBox.makeCards(aQueenLizCardValues);
        
        var oQueenLizGamePlay = new QueenLizGamePlay(
            nNumPlayers,
            aCards,
            aHomebaseNames,
            oGameBox.maxNumberOfSlots,
            oGameBox.cardWidth,
            {
                renderResult: GameBox.renderResult,
                getRandomName: GameBox.getRandomName
            }
        );
    
        var bShuffleCards = true;
    
        oQueenLizGamePlay.start(bShuffleCards);

    };

    var _convertDictionaryObjectsToElements = function (oDictionaryObjects) {
        var aDictionaryElements = [];
        var aKeys = Object.keys(oDictionaryObjects);
        var i;
        for (i = 0; i < aKeys.length; i++) {
            var sKey = aKeys[i];
            var sValue = oDictionaryObjects[sKey];
            aDictionaryElements.push(sValue);
        }
        return aDictionaryElements;
    }

    GameBox.makeView();

    var aHomebaseNames = [ 'andrew', 'diana', 'george', 'catherine', 'henry', 'margaret', 'edward', 'mary', 'charles' ];

    var oGameBox = new GameBox();

    oGameBox.getDictionary.call(oGameBox, oGameBox.getDictionarySuccess.bind(oGameBox));

});
