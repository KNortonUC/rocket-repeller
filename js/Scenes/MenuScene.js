class MenuScene extends Phaser.Scene
{
	
	constructor(){
		super("bootGame");
		console.log("MenuScene loaded");
	}
	
	preload()
	{
		this.load.image("background-menu", "assets/backgrounds/bg_level.png");
		this.load.image("logo", "assets/logo_01.png");
		
		// Fonts
		this.load.bitmapFont("pixelFont", "assets/font/font.png", "assets/font/font.xml");
		
	}
	

	
	create()
	{
		this.menuHidders = this.physics.add.group(); // This Group is things that need to be hidden in the options menu
		
		var bg = this.add.image(config.width / 2, config.height / 2, 'background-menu');

		//bg.setDisplaySize(config.width * 2, config.height * 2);
		
		this.logo = this.add.image(config.width / 2, config.height / 2 / 2, 'logo');
		this.logo.setScale(0);
		this.menuHidders.add(this.logo);
	}
	

	
	update()
	{
		this.introScaleLogo();
			
	}
	
	introScaleLogo()
	{
		if(this.logo.scale >= 0.2)
			 return;
		
		
		this.logo.setScale(this.logo.scale + 0.003);
		if(this.logo.scale >= 0.2)
			this.createButtons(); // Triggerd Once 
	}
	
	createButtons()
	{
		// Play Button
		this.playButton = this.add.text(config.width / 2, config.height / 2.5, 'Start Game', {
			fontSize: '32px',
			color: '#ffffff',
			backgroundColor: '#000000',
			padding: { x: 20, y: 10 }
		})
		.setOrigin(0.5)
		.setInteractive({ useHandCursor: true }) // Makes the hand cursor
		.on('pointerdown', () => {
			this.scene.start("GameScene");
			console.log('Play clicked!');
		// Start game scene here
		})
		.on('pointerover', () => this.playButton.setStyle({ backgroundColor: '#333333' }))
		.on('pointerout', () => this.playButton.setStyle({ backgroundColor: '#000000' }));
		this.menuHidders.add(this.playButton);
		
		this.optionsButton = this.add.text(config.width / 2, config.height / 2, 'Options', {
			fontSize: '32px',
			color: '#ffffff',
			backgroundColor: '#000000',
			padding: { x: 20, y: 10 }
		})
		.setOrigin(0.5)
		.setInteractive({ useHandCursor: true }) // Makes the hand cursor
		.on('pointerdown', () => {
		console.log('Options clicked!');
		// Start game scene here
		})
		.on('pointerover', () => this.optionsButton.setStyle({ backgroundColor: '#333333' }))
		.on('pointerout', () => this.ptionsButton.setStyle({ backgroundColor: '#000000' }));
		this.menuHidders.add(this.optionsButton);		
		
	}
	
	
}

