class GameScene extends Phaser.Scene
{
	constructor(){
		super("GameScene");
		console.log("GameScene loaded");
	}
	
	preload()
	{
		this.load.image("background-scene", "assets/backgrounds/bg_level.png");

	}
	
	
	create()
	{
		// Background
		var gbg = this.add.image(config.width / 2, config.height / 2, 'background-scene');
		
		// Scoring UI
		this.score = 0;
		this.scoreLabel = this.add.bitmapText(10,5, "pixelFont", "SCORE:", 32);
		this.scoreNumberLabel = this.add.bitmapText(95,5, "pixelFont", this.score, 32);
		
		
	}

	
	update()
	{
		this.popScore(1);
			
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
}
