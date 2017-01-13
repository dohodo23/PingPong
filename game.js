
var canvas;
var canvasContext;

var ball= {
	width:12.5,
	height:12.5,
	positionX:400,
	positionY:300,
	speed:6,
	speedY: 3.5,
	speedincrement:0.2,
	maxspeed:15,
	maxspeedY:8,
	fromWhichPlayer:0,
	color:'white'
};

var paddlePlayer = {
	width:15,
	height:100,
	positionX: 30,
	positionY: 300,
	color:'white',
	score:0,
	paddleCenter: function(){return this.height/2;}
	
};

var paddleComputer = {
	width:15,
	height:100,
	positionX: 800-45,
	positionY: 300,
	color:'white',
	score:0,
	paddleCenter: function(){return this.height/2;},
	speed:7,
	whenToMove:35

};

var powerUp = {
	width:50,
	height:100,
	positionX: 200,
	positionY: 400,
	color: 'red',
	count:300,
	randomX: Math.random()*600+100,
	randomY: Math.random()*500+50,
	firstDrawn: true
}




window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 60;
	setInterval(function(){
		moveEverything();
		drawEverything();
	}, 1000/framesPerSecond);
	
	canvas.addEventListener('mousemove', function(evt){
		var mousePos = calculateMousePos(evt);
		paddlePlayer.positionY = mousePos.y- paddlePlayer.paddleCenter();
	});

}

function moveEverything(){
	// console.log("ball Speed: "+ball.speed);

	powerUpCollision();

	ball.positionX += ball.speed;
	ball.positionY += ball.speedY;

	computerMovement();
	canvasCollision();
	paddleCollision();
	console.log(powerUp.count);
	
}

function drawEverything() {
	
	// draw a black canvas
	colorRect(0,0,canvas.width,canvas.height,'black');

	checkFreeSpace();

	// draw a ball 
	colorCircle(ball.positionX,ball.positionY,ball.width, ball.color)
	
	// draw a padle player
	colorRect(paddlePlayer.positionX, paddlePlayer.positionY, paddlePlayer.width, paddlePlayer.height,paddlePlayer.color);

	// draw a padle computer
	colorRect(paddleComputer.positionX ,paddleComputer.positionY,paddleComputer.width,paddleComputer.height,paddleComputer.color);

	canvasContext.fillText(paddlePlayer.score, 200,50);
	canvasContext.fillText(paddleComputer.score,600,50);


	if(powerUp.count>=0){powerUp.count--;}
}

function colorRect(positionX,positionY,width,height,color){
	
	canvasContext.fillStyle = color;
	canvasContext.fillRect(positionX,positionY,width,height);

};

function colorCircle(centerX, centerY, radius ,drawColor){

	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY,radius,0,Math.PI*2, true);
	canvasContext.fill();
}

function calculateMousePos(evt){

	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return{
		x:mouseX,
		y:mouseY
	};
}

function computerMovement(){
		// This funtion let the computer move and looks what the ball position is.

		// checks the ball position and start to move when the ball is out of range from the paddle
		if(paddleComputer.positionY + paddleComputer.paddleCenter() < ball.positionY-paddleComputer.whenToMove){
			paddleComputer.positionY+= paddleComputer.speed;
		}
		else if(paddleComputer.positionY + paddleComputer.paddleCenter() > ball.positionY+paddleComputer.whenToMove){
			paddleComputer.positionY -= paddleComputer.speed;
		}		
}

function paddleCollision(){
	// This function stands for detecting collision with the paddles


	// This first if statement checks if the ball touch the computer paddle
	if (ball.positionX >= paddleComputer.positionX && ball.positionY>paddleComputer.positionY && ball.positionY<paddleComputer.positionY+paddleComputer.height){
			
		// At this point the ball did touch de paddle and the ball will go the oposit way.
		ball.speed*=-1;

		// Here it checks if the ball hit the paddle on bottom half or top half
		if(ball.positionY>= paddleComputer.positionY &&ball.positionY<=paddleComputer.paddleCenter()) {
			// At this moment the ball its the top part of the paddle
						
			// it subtrect vertical speed because I want that the ball moves upward on the screen
			ball.speedY =  ball.speedY - (ball.positionY- paddleComputer.positionY)/10;
			// console.log(ball.speedY);
			
		}else{
			// Here I add some vertical speed because the ball hits the bottom half of the paddle
			ball.speedY= ball.speedY+ (ball.positionY- paddleComputer.positionY - paddleComputer.paddleCenter())/10;
			// console.log(ball.speedY);
		}

		// With every paddle hit the horizontal speed increase until it reach the maximum speed
		// The if statement checks which way the ball moves
		if(ball.speed<0 && ball.speed>-ball.maxspeed)
		{
			// The ball moves to the left(negative speed) and the speed get increased
			ball.speed-=ball.speedincrement;
		}

		// this if statement checks the collision with the player paddle
	}else if(ball.positionX <= paddlePlayer.positionX+paddlePlayer.width && ball.positionY>paddlePlayer.positionY && ball.positionY<paddlePlayer.positionY+paddlePlayer.height){
		// At this point the ball did touch de paddle and the ball will go the oposit way.
		ball.speed*=-1;

		// Here it checks if the ball hit the paddle on bottom half or top half
		if(ball.positionY>= paddlePlayer.positionY &&ball.positionY<=paddlePlayer.paddleCenter()) {
		
			// it subtrect vertical speed because I want that the ball moves upward on the screen
			ball.speedY =  ball.speedY - (ball.positionY- paddlePlayer.positionY)/10;
			// console.log(ball.speedY);
			
		}else{
			// Here I add some vertical speed because the ball hits the bottom half of the paddle
			ball.speedY= ball.speedY+ (ball.positionY- paddlePlayer.positionY - paddlePlayer.paddleCenter())/10;
			// console.log(ball.speedY);			
		}

		// With every paddle hit the horizontal speed increase until it reach the maximum speed
		// The if statement checks which way the ball moves
		if(ball.speed>0 && ball.speed<ball.maxspeed)
		{
			// The ball moves to the left(negative speed) and the speed get increased
			ball.speed+=ball.speedincrement;
		}
	}
}

function canvasCollision(){
	// This function checks if the border of the canvas is hitted

	// Checks if the top of the canvas is hitted
	if(ball.positionY<=0){

			// the ball is going the opesit way
			ball.speedY*=-1;	
	}
	// Checks if the bottom of the canvs is hitted
	else if(ball.positionY>=canvas.height){

			// the ball is going the opesit way
			ball.speedY*=-1;	
	}

	// checks if the left side of the canvas is hitted
	if(ball.positionX<=0){
		/*
		This code restets the ball at the center of the canvas.
		Further it resets the speed.
		There will be added points to who has scored
		*/
		
		resetEverything();
		//score computer ++
		paddleComputer.score++;
	}
		else if(ball.positionX>=canvas.width){
		/*
		This code restets the ball at the center of the canvas.
		Further it resets the speed.
		There will be added points to who has scored
		*/
			
		resetEverything();
		//score player ++
		paddlePlayer.score++;
		}
}

function powerUpCollision(){

	if(ball.positionX>powerUp.positionX && ball.positionX<powerUp.positionX+35 && ball.positionY>powerUp.positionY && ball.positionY<powerUp.positionY+35){
		ball.color='red';
		powerUp.count= Math.random()*700+200;
		console.log('the ball hit the powerup');
	}
}

function powerUps() {
	
	if (powerUp.count<=0){
		// console.log('power ups works');
		colorRect(powerUp.positionX,powerUp.positionY,25,25,powerUp.color);
	}else{
		powerUp.positionX=powerUp.randomX;
		powerUp.positionY=powerUp.randomY;
		console.log("postionx: "+powerUp.positionX + " positiony: "+powerUp.positionY)
	}
}

function checkFreeSpace(){
	//ball position moet out of range zijn.
	// ball positie buiten coordinaten van powerup
	// 100 - 200 out of range.
	if ((ball.positionX < powerUp.postionX -100 || ball.positionX > powerUp.positionX + 100)
		&&
		(ball.positionY < powerUp.postionY -100 || ball.positionY > powerUp.positionY + 100)
		&&
		(powerUp.firstDrawn == true)){
		// draw powerUp
		powerUps();
		powerUp.firstDrawn = false;
	} else if (powerUp.firstDrawn == false){
		powerUps();
	}else{
		powerUp.positionX=powerUp.randomX;
		powerUp.positionY=powerUp.randomY;
	}
	
}

function resetEverything(){
	// The place, speed and color of the ball needs to be reseted
	ball.positionY=canvas.height/2;
	ball.positionX=canvas.width/2;
	if(ball.speed>0){
		ball.speed=-6;
	}else{
		ball.speed=6;
	}
	ball.speedY=0;
	ball.color= 'white';

	// the firstDraw and duration for new drawing of the powerUP needs to be reseted
	powerUp.firstDrawn=true;
	powerUp.count = Math.random()*200+200;

}











