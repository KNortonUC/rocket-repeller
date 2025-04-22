var config = 
{
	// Screen 
	width: 924,
	height: 800,
	backgroundColor: 0x000000,
	
	// Scenes Preload
	scene: MenuScene,
	
	// Physics 
	physics: 
	{
		default: "arcade",
		arcade:{
			debug: false
		}
	}
}

// Start Game Window //
window.onload = function() 
{
	var game = new Phaser.Game(config);
}