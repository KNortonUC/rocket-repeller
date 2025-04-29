class GameScene extends Phaser.Scene
{
	
	constructor(){
		super("GameScene");
		console.log("GameScene loaded");
	}
	
	preload()
	{
		this.load.image("background-scene", "assets/backgrounds/bg_level.png");
		
		this.load.image("missle-normal", "assets/none.png");
		this.load.image("missle-nuke", "assets/none.png");
		this.load.image("missle-counter", "assets/none.png");

	}
	
	
	create()
	{
		// Background
		var gbg = this.add.image(config.width / 2, config.height / 2, 'background-scene');
		
		// Scoring UI
		this.score = 0;
		this.scoreLabel = this.add.bitmapText(10,5, "pixelFont", "SCORE:", 32);
		this.scoreNumberLabel = this.add.bitmapText(95,5, "pixelFont", this.score, 32);
		
		
		this.incoming = this.physics.add.group();
		this.specials = this.physics.add.group();
		this.counterShots = this.physics.add.group();
		
		this.createTimer();
		//this.createIncomingMissileFromTop("type", "missle-normal");
	}
	
	createTimer()
	{
		this.time.addEvent({
			delay: this.getDifficultyLevel().spawnSpeed,
			callback: () => this.createIncomingMissileFromTop("type", "missle-normal"),
			callbackScope: this,
			loop: true
		});
	}

	
	update()
	{
		this.incoming.children.iterate((missle) => {
		if (!missle) return; 
			this.moveMissile(missle);
			
		
		});
			
	}	
	
	// Creates a Missle at the top of the screen randomly in the width of a given type with a texture //
	createIncomingMissileFromTop(type, texture)
	{
		if (this.incoming.children.entries.length >= this.getDifficultyLevel().maxIncoming) 
			return;
	
		var missile = this.add.sprite(config.width/2 - 50, config.height/2, texture);
		
		// Set Position
		missile.y = 0;
		var randomX = Phaser.Math.Between(15, config.width - 15);
		missile.x = randomX;
		
		
		missile.speed = Phaser.Math.Between(this.getDifficultyLevel().minSpeed, this.getDifficultyLevel().maxSpeed);
		
		// Add to Array of incoming missiles
		this.incoming.add(missile);
	}
	
	moveMissile(missle){
		missle.y += missle.speed;
		if(missle.y > config.height - 60){
			missle.destroy();
			
		}
	}
	
	// Zero Padding for Score
	zeroPad(number, size)
	{
		var stringNumber = String(number);
		while(stringNumber.length < (size || 2)){
			stringNumber = "0" + stringNumber;
		}
		return stringNumber;
	}
	
	popScore(amount)
	{
		this.score += amount;
		this.scoreNumberLabel.text = this.zeroPad(this.score, 6);
	}
	
	reduceScore(amount)
	{
		this.score -= amount;
		this.scoreNumberLabel.text = this.zeroPad(this.score, 6);
	}	
	
	getDifficultyLevel()
	{
		return difficultyEasy;
	}
	
}
