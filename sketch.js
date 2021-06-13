var PLAY = 1;
var END = 0;
var gameState = PLAY;

var earth,earth_running, earth_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3 ;

var score=0;
var points=0;

var gameOver, restart;
var protectionGroup,protection1,protection2,pointSound



function preload(){
earth_running=loadAnimation("globe-gif.gif");
 // trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");

  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.wav")
  dieSound = loadSound("collided.wav")
  checkPointSound = loadSound("checkPoint.mp3")
     pointSound=loadSound("coin.wav")
  
  protection1=loadImage("hand sanitizer.png");
 protection2=loadImage("mask.png")

}

function setup() {
  createCanvas(600, 300);
  
  earth = createSprite(50,245,20,50);
  
  earth.addAnimation("running", earth_running);
  //trex.addAnimation("collided", trex_collided);
  earth.scale = 0.3;
  
  ground = createSprite(200,325,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,120);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,160);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.2;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,245,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  protectionGroup=new Group();
  
earth.setCollider("circle",0,0,90);
earth.debug = false
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(0);
  text("Score: "+ score, 500,15);
  text("point:  "+points , 40,40)
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    
     if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && earth.y >= 210) {
      earth.velocityY = -12;
       jumpSound.play();
    }
  
    earth.velocityY = earth.velocityY + 0.7
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    earth.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    spawnProtection();
    
     if(protectionGroup.isTouching(earth)){
    points=points+1;
     pointSound.play();
      protectionGroup[0].destroy();
  }
  
    if(obstaclesGroup.isTouching(earth)){
        gameState = END;
      dieSound.play()
    } 
     
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    earth.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    protectionGroup.setVelocityXEach(0);
    //change the trex animation
  //  trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     protectionGroup.setLifetimeEach(-1)
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(50,100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 220;
    
    //adjust the depth
    cloud.depth = earth.depth;
    earth.depth = earth.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(600,210,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }

   obstacle .setCollider("circle",0,0,110);
obstacle.debug = false
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale =0.18;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnProtection() {
  if(frameCount % 130 === 0) {
    var protection = createSprite(600,175,10,40);    
    //generate random protection
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: protection.addImage(protection2);
              break;
      case 2: protection.addImage(protection1);
              break;
            default: break;
       }
        
    protection.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    protection.scale = 0.1;
    protection.lifetime = 300;
    //add each obstacle to the group
    protectionGroup.add(protection);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  earth.changeAnimation("running",earth_running);
  
 
  
  score = 0;
  
}