let blackjackGame={
    'you':{'scoreSpan':'#your-blackjack-result','div':'#your-box','score':0},
    'dealer':{'scoreSpan':'#dealer-blackjack-result','div':'#dealer-box','score':0},
    'cards':['1','2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    'cardsMap':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':10,'Q':10,'K':10,'A':[1,11]},
    'wins':0,
    'losses':0,
    'drews':0,
    'sStand':false,
    'itsOver':false,
};

const YOU=blackjackGame['you']
const DEALER=blackjackGame['dealer']


const hitSound =new Audio('/home/anirudh/Desktop/Blackjack/sounds/swish.m4a');
const winSound =new Audio('/home/anirudh/Desktop/Blackjack/sounds/cash.mp3');
const lossSound =new Audio('/home/anirudh/Desktop/Blackjack/sounds/aww.mp3');


document.querySelector('#blackjack-hit-button').addEventListener('click',blackjackHit);

document.querySelector('#blackjack-deal-button').addEventListener('click',blackjackDeal);

document.querySelector('#blackjack-stand-button').addEventListener('click',blackjackStand);


function blackjackHit(){
    if(blackjackGame['sStand']===false){  
        let card=randomCard();
        console.log(card);
        showCard(card,YOU);
        updateScore(card,YOU);
        showScore(YOU);
  } 
}

function randomCard(){
    let randomIndex= Math.floor(Math.random() *13);
    return blackjackGame['cards'][randomIndex];
}

function showCard(card,activePlayer){
    if(activePlayer['score']<=21){
    let cardImage = document.createElement('img');
    cardImage.src = `/home/anirudh/Desktop/Blackjack/images/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
}
}

 function blackjackDeal() {
    if(blackjackGame['itsOver']===true){
        blackjackGame['sStand']=false;
        let yourImage= document.querySelector('#your-box').querySelectorAll('img');
        let dealerImage= document.querySelector('#dealer-box').querySelectorAll('img');

        for(i=0;i<yourImage.length;i++){
            yourImage[i].remove();
        }

        for(i=0;i<dealerImage.length;i++){
            dealerImage[i].remove();
        }

        YOU['score']=0;
        DEALER['score']=0;

        document.querySelector('#your-blackjack-result').textContent=0;
        document.querySelector('#dealer-blackjack-result').textContent=0;
        
        document.querySelector('#your-blackjack-result').style.color='#ffffff';
        document.querySelector('#dealer-blackjack-result').style.color='#ffffff';

        document.querySelector('#blackjack-result').textContent="Let's play";
        document.querySelector('#blackjack-result').style.color="black";
        blackjackGame['itsOver']=true;
    }
}

function sleep(ms){
    return new Promise(resolve=> setTimeout(resolve,ms))
}

async function blackjackStand(){ 
    blackjackGame['sStand']=true; 

    while(DEALER['score']<16 && blackjackGame['sStand']===true){
        let card=randomCard();
        showCard(card,DEALER);
        updateScore(card,DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
    
    blackjackGame['itsOver']=true;
    let winner = computeWinner();
    showResult(winner);

    
    
}



function updateScore(card,activePlayer){

 if(card==='A'){
    if(activePlayer['score']+=blackjackGame['cardsMap'][card][1]<=21){
        activePlayer['score']+=blackjackGame['cardsMap'][card][1]
    }else{
        activePlayer['score']+=blackjackGame['cardsMap'][card][0]
    }
 }else{
    activePlayer['score']+=blackjackGame['cardsMap'][card]
}

}

function showScore(activePlayer){
       if(activePlayer['score']>21){
           document.querySelector(activePlayer['scoreSpan']).textContent='BUST!';
           document.querySelector(activePlayer['scoreSpan']).style.color='red';
        
       }else{
           document.querySelector(activePlayer['scoreSpan']).textContent=activePlayer['score'];
       }
}

function computeWinner(){
    let winner;

    if(YOU['score']<=21){

    if(YOU['score']>DEALER['score']||(DEALER['score']>21)){
        blackjackGame['wins']++;
        winner=YOU;

    }else if(YOU['score']<DEALER['score']){
        blackjackGame['losses']++;
        winner=DEALER;

    }else if(YOU['score']===DEALER['score']){
        blackjackGame['drews']++

    }else if(YOU['score']>21 && DEALER['score']<=21){
        blackjackGame['losses']++;
        winner=DEALER;

    }else if(YOU['score']>21 && DEALER['score']>21){
        blackjackGame['drews']++;

    }
}
    console.log('Winner is:',winner);

    return winner;
}

function showResult(winner){
    let message,messageColor;

    if(blackjackGame['itsOver']===true){

        if(winner===YOU){
            document.querySelector('#wins').textContent=blackjackGame['wins']
            message='You won!';
            messageColor='green';
            winSound.play();
        }else if(winner===DEALER){
            document.querySelector('#losses').textContent=blackjackGame['losses']
            message='You lost!';
            messageColor='red';
            lossSound.play();
        }else{
            document.querySelector('#draws').textContent=blackjackGame['drews']
            message='You drew!';
            messageColor='black';
        }

        document.querySelector('#blackjack-result').textContent=message;
        document.querySelector('#blackjack-result').style.color=messageColor;
    }
}