var difficultyEasy =
{
	maxIncoming: 4, // Max incoming objects (missiles)
	minSpeed: 2, // Min speed of missiles (Used as a rand range)
	maxSpeed: 4, // Max speed of missiles (Used as a rand range)
	playerSpeed: 200,
	specialChance: 0.6,
	spawnSpeed: 2000, // Mill seconds (this is static for the whole thing currently)
	worldHealth: 300
}

var difficultyMed =
{
	maxIncoming: 6, 
	minSpeed: 5,
	maxSpeed: 9,
	playerSpeed: 200,	
	specialChance: 0.4,
	spawnSpeed: 2000,
	worldHealth: 200
}

var config = 
{
	// Screen 
	width: 924,
	height: 800,
	backgroundColor: 0x000000,
	
	// Scenes Preload
	scene: [MenuScene, GameScene],
	difficultyLevels: [difficultyEasy, difficultyMed],
	
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