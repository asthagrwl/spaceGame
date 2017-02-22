

			// creating the canvas
			var c=document.getElementById("myCanvas");
			var ctx=c.getContext("2d");
			c.width=480;
			c.height=320;

			var player={
				color: "#00A",
				x:220,
				y:270,
				width: 32,
				height: 32,		
				draw: function(){
					ctx.fillStyle=this.color;
					ctx.fillRect(this.x,this.y,this.width,this.height);
					
				}
				
			}
			var bullets = [];
			function Bullet(I){
				I.active=true;
				I.xVelocity=0;
				I.yVelocity=-I.speed;
				I.width=3;
				I.height=3;
				I.color="#000";
				I.inBounds = function(){
					return (I.x >=0 && I.x <= c.width && I.y >=0 && I.y <= c.height);
				};
				
				I.draw= function(){
						ctx.fillStyle=this.color;
						ctx.fillRect(this.x,this.y,this.width,this.height);
					};
				I.update= function(){
					I.x += I.xVelocity;
					I.y += I.yVelocity;
					I.active= I.active && I.inBounds();
				};
				return I;
			
			}
			
			//Enemies
			 enemies = [];
			function Enemy(I){
				I=I || {};
				I.active=true;
				I.age=Math.floor(Math.random()*128);
				I.color="#A2B";
				I.x=c.width/4 + Math.random()*(c.width)/2;
				I.y=0;
				I.xVelocity=0;
				I.yVelocity=2;
				I.width=32;
				I.height=32;
				I.inBounds= function(){
					return (I.x >=0 && I.x <= c.width && I.y >=0 && I.y <= c.height);
				};
				I.draw= function(){
					ctx.fillStyle=this.color;
					ctx.fillRect(this.x,this.y,this.width,this.height);
					I.sprite=Sprite("enemy");
					this.sprite.draw(ctx,this.x,this.y);
				};
				I.update= function(){
					I.x += I.xVelocity;
					I.y += I.yVelocity;
					I.xVelocity=3*Math.sin(I.age*Math.PI/64);
					I.age++;
					I.active= I.active && I.inBounds();
				};
				
				I.explode= function(){
					this.active=false;
					Sound.play("explode");
				};				
				return I;
			};
			
			//setting interval
			var fps=30;
			setInterval(function(){
				draw();
				update();
				
			},1000/fps);
			
			function draw(){
				
				ctx.clearRect(0,0,c.width,c.height);
				player.draw();
				enemies.forEach(function(enemy){
					enemy.draw();
				});
				bullets.forEach(function(bullet){
					bullet.draw();
				});
				//ctx.fillText("hello",50,50);
				
			}
			function update(){
				if(keydown.left){
					player.x -=5;
				}
				else if(keydown.right){
					player.x +=5;
				}
				else if(keydown.space){
					
					player.shoot();
					
				}
				player.x = player.x.clamp(0,c.width-player.width);
				bullets.forEach(function(bullet){
					bullet.update();
				});
				bullets=bullets.filter(function(bullet){
					return bullet.active;
				});
				enemies.forEach(function(enemy){
					enemy.update();
				});
				enemies=enemies.filter(function(enemy){
					return enemy.active;
				});
				if(Math.random < 0.1){
					enemies.Push(Enemy());
				}
			}
			// Shooting			
			player.shoot= function(){
				
				var bulletPos = this.midpoint();
				bullets.push(Bullet({
					speed: 5,
					x: bulletPos.x,
					y: bulletPos.y
					
					}
				));
				Sound.play("shoot");
				
			};
			player.midpoint = function(){
				return {
					x: this.x + this.width/2,
					y: this.y + this.height/2
				};
			};
			//player Image
			player.sprite = Sprite("player");
			player.draw = function(){
				this.sprite.draw(ctx,this.x,this.y);
			};
			
			//collision detection
			function collides(a,b){
				return ((a.x < b.x + b.width) && (a.x + a.width > b.x) && (a.y < b.y + b.height) && (a.y + a.height > b.y));
			}
			function handleCollison(){
				bullets.forEach(function(bullet){
					enemies.forEach(function(enemy){
						if(collides(bullet,enemy)){
							enemy.explode();
							bullet.active=false;
						}
					});
				});
				enemies.forEach(function(enemy){
						if(collides(enemy,player)){
							enemy.explode();
							player.active=false;
						}
					});
			}
			
			
			
		
		
		
	
	
	
	
	
	
	
	