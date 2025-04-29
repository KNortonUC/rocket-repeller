class GameScene extends Phaser.Scene
{
	
	constructor(){
		super("GameScene");
		console.log("GameScene loaded");
	}
	
	preload()
	{
		this.load.image("background-scene", "assets/backgrounds/bg_level.png");
		this.load.spritesheet("explosion", "assets/explosion.png", { frameWidth: 16, frameHeight: 16 });

		this.load.image("player-veh", "assets/player_veh.png");
		
		this.load.image("missle-normal", "assets/missle_normal.png");
		this.load.image("missle-nuke", "assets/none.png");
		this.load.image("missle-counter", "assets/missle_nuke.png");

	}
	
	
	create()
	{
		this.gameStarted = false;
		this.gameEnded = false;
		this.canFire = true;
		
		// Background
		var gbg = this.add.image(config.width / 2, config.height / 2, 'background-scene');
		
		// Scoring UI
		this.score = 0;
		this.scoreLabel = this.add.bitmapText(10,5, "pixelFont", "SCORE:", 32);
		this.scoreNumberLabel = this.add.bitmapText(95,5, "pixelFont", this.score, 32);
		
		this.worldHealth = this.getDifficultyLevel().worldHealth;
		this.healthLabel = this.add.bitmapText(10,25, "pixelFont", "Health:", 32);
		this.healthNumberLabel = this.add.bitmapText(95,25, "pixelFont", this.worldHealth, 32);		
		
		// Create Physics groups
		this.incoming = this.physics.add.group();
		this.specials = this.physics.add.group();
		this.projectiles = this.physics.add.group();
		
		this.physics.add.overlap(this.projectiles, this.incoming, this.destoryIncoming, null, this);
		
		// Debug Physics
		//this.physics.world.createDebugGraphic();
	//	this.physics.world.drawDebug = true;
		
		// Animations
		this.anims.create(
		{
			key: "explode",
			frames: this.anims.generateFrameNumbers("explosion"),
			frameRate: 20,
			repeat: 0,
			hideOnComplete: true
		});
		
		this.startLabel = this.add.bitmapText(config.width / 2, config.height / 2, "pixelFont", "BEGIN", 80);
		this.startLabel.setOrigin(0.5,0.5);
		
		
		this.popScore(0); // Fixes the formating of the text at start
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
		if (this.startLabel && !this.gameStarted && !this.gameEnded){
			this.startLabel.setScale(this.startLabel.scale - 0.01);
			if(this.startLabel.scale < 0.2) {
				this.startLabel.destroy();
				this.startGame();
			}
		}
		
		// Update movement for all missiles
		this.incoming.children.iterate((missile) => {
		if (!missile) return; 
			this.moveMissile(missile);
		});
		
		// Destroys projectiles past limit
		this.projectiles.children.iterate((missile) => {
		if (!missile) return; 
			if(missile.y < -config.height)
			{
				missile.destroy();
			}
		});		
		

			if (this.gameStarted) {
				this.player.setVelocity(0);
				
				if(this.cursorKeys.left.isDown){
					this.player.setVelocityX(-250);
					this.player.flipX = false; 
				}else if(this.cursorKeys.right.isDown){
					this.player.setVelocityX(250);
					this.player.flipX = true;  
			}
		
			if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
				this.playerShoot();
			}
		}
		
		if(this.gameEnded)
		{
			if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
				this.scene.start("bootGame");
			}			
		}
	}	
	
	startGame()
	{
		this.gameStarted = true;	
		console.log("Game Started");
		
		this.createTimer();
		
		this.cursorKeys = this.input.keyboard.createCursorKeys();
		this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		this.player = this.physics.add.sprite(config.width/2 - 50, config.height - 80, "player-veh");
		this.player.setCollideWorldBounds(true);		
	}
	
	endGame()
	{
		this.endGameLabel = this.add.bitmapText(config.width / 2, config.height / 2, "pixelFont", "GAME OVER", 80);
		this.endGameLabel.setOrigin(0.5,0.5);
		this.spaceLabel = this.add.bitmapText(config.width / 2, config.height / 2 + 90, "pixelFont", "Press Space to Return", 70);
		this.spaceLabel.setOrigin(0.5,0.5);


		this.gameStarted = false;
		this.gameEnded = true;
		
		this.player.destroy();
		
		this.incoming.children.iterate((missile) => {
		if (!missile) return; 
			missile.destroy();
		});
	}
	
	playerShoot()
	{
		if (this.canFire == false)
			return;
		
		var x = this.player.x;
		var y = this.player.y - 16;


		var missile = this.physics.add.sprite(x, y, "missle-counter");
		missile.body.setSize(25, 30);
		missile.flipY = true;

		this.physics.world.enableBody(missile);


		this.projectiles.add(missile);	
		
		missile.setVelocityY(-350);
		
		this.canFire = false;
		
		// Shoot cooldown
		this.time.addEvent({
			delay: 800,
			callback: this.resetShootability,
			callbackScope: this,
			loop: false
		});
	}
	
	resetShootability()
	{
		this.canFire = true;
	}
	
	// Creates a Missle at the top of the screen randomly in the width of a given type with a texture //
	createIncomingMissileFromTop(type, texture)
	{
		if(!this.gameStarted)
			return;
		
		if (this.incoming.children.entries.length >= this.getDifficultyLevel().maxIncoming) 
			return;
	
		var missile = this.physics.add.sprite(config.width/2 - 50, config.height/2, texture);
		missile.body.setSize(15, 30);
		// Set Position
		missile.y = 0;
		var randomX = Phaser.Math.Between(25, config.width - 25);
		missile.x = randomX;
		
		
		missile.speed = Phaser.Math.Between(this.getDifficultyLevel().minSpeed, this.getDifficultyLevel().maxSpeed);
		
		// Add to Array of incoming missiles
		this.incoming.add(missile);
	}
	
	createExplosion(x, y)
	{
		var exp = this.add.sprite(x, y, "explosion");
		exp.setScale(3);
		exp.play("explode");
	}
	
	moveMissile(missle){
		missle.y += missle.speed;
		if(missle.y > config.height - 60){
			this.createExplosion(missle.x, missle.y);
			missle.destroy();
			this.worldDamage(50);
		}
	}

	
	destoryIncoming(projectile, incoming)
	{
		this.createExplosion(incoming.x, incoming.y);
		projectile.destroy();
		incoming.destroy();

		
		this.popScore(50);
	}
	
	
	worldDamage(amount)
	{
		this.worldHealth -= amount;
		this.healthNumberLabel.text = this.worldHealth, 6;
		if (this.worldHealth <= 0 && !this.gameEnded) 
		{
			this.endGame();
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
