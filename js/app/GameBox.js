/*global require */
/*global Audio: false */
requirejs(['QueenLizGamePlay', 'Tools'], function (QueenLizGamePlay, Tools) {

    'use strict';

    var GameBox = function () {

        var MAX_NUMBER_OF_SLOTS = 3;
        var CARD_WIDTH = 68;

        this.slotNumber;
        this.players = [];
        this.maxNumberOfSlots = MAX_NUMBER_OF_SLOTS;
        this.cardWidth = CARD_WIDTH;

        this.dictionaries = null;

    };

    /**
     * makes the initial master view
     */
    GameBox.makeMasterView = function () {

        var oMasterView = document.createElement('div');
        Tools.setClass(oMasterView, 'master');
        oMasterView.setAttribute('id', 'master');

        document.body.insertBefore(oMasterView, null);

        var oMenuView = document.createElement('div');
        Tools.setClass(oMenuView, 'menu');
        oMenuView.setAttribute('id', 'menu');

        var oMenuButton = document.createElement('button');
        var oContent = document.createTextNode('Menu');
        Tools.setClass(oMenuButton, 'menu');
        oMenuButton.setAttribute('id', 'menu');
        oMenuButton.appendChild(oContent);
        oMenuButton.onclick = menuButtonPressed.bind(this);
        oMasterView.insertBefore(oMenuButton, null);

        var oDictionaryButton = document.createElement('button');
        var oContent = document.createTextNode('Dictionaries');
        Tools.setClass(oDictionaryButton, 'button');
        oDictionaryButton.setAttribute('id', 'dictionaries');
        oDictionaryButton.appendChild(oContent);
        oDictionaryButton.onclick = dictionaryButtonPressed.bind(this);
        oMenuView.insertBefore(oDictionaryButton, null);

        oMasterView.insertBefore(oMenuView, null);

    };

    /**
     * makes the initial game view
     */
    GameBox.makeGameView = function () {

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

    GameBox.makeCards = function (aCardValues, nNumberOfCards) {
        var aCards = [];

        var i;
        var nNumberOfCardsInStack = Math.min(aCardValues.length, nNumberOfCards);

        // distributes the cards into suits
        for (i = 0; i < nNumberOfCardsInStack; i++) {
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

        var aCards = GameBox.makeCards(aQueenLizCardValues, 30);
        
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

    var menuButtonPressed = function () {
        var oMenuButton = document.getElementById('menuButton');
        Tools.toggleClass(oMenuButton, 'visible');
    };

    var dictionaryButtonPressed = function () {
        console.log('dictionary button pressed');
    };

    // starts set up of the game

    GameBox.makeMasterView();
    GameBox.makeGameView();

    var aHomebaseNames = [ 'andrew', 'diana', 'george', 'catherine', 'henry', 'margaret', 'edward', 'mary', 'charles' ];

    var oGameBox = new GameBox();

    oGameBox.getDictionary.call(oGameBox, oGameBox.getDictionarySuccess.bind(oGameBox));

});
