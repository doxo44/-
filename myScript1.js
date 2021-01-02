class App {
 
 
    select = e => document.querySelector(e);
    selectAll = e => document.querySelectorAll(e); 
    mainTl = new TimelineMax({repeat:-1, delay:1});
   
    
     constructor(){
          
      const dotArray = [];
      const container = this.select('.container');
      const ring = this.select('.ring');
      const num = 160;
      const stageWidth = 600;
      const stageHeight = 600;
      const mainCircleRadius = 220;
      const strokeWidth = 120;
      const duration = 8;
      const colorArray = ["#25245F", '#26247D', '#303894', '#1F45B9', '#2F5AA0', '#3276CD', '#3B94E6', '#41C2F4', '#50F7FE', '#7DFFFE', '#EABEFC', '#64A8AF'];
      const tl = new TimelineMax({});
      const introTl = new TimelineMax({});
       const step = 360 / num;
      const rocket = this.select('#rocket');
      const rocketPath = this.select('#rocketPath');
      const bezier = MorphSVGPlugin.pathDataToBezier(rocketPath, {
     offsetX: -71.4/2,
     offsetY: -46/2
   })
      
      TweenMax.to('#rocketFlame', 0.03, {
       scaleX:0.59,
       repeat:-1,
       yoyo:true,
       transformOrigin:'100% 50%',
       ease:Linear.easeNone
      })
   
     const rocketTl = new TimelineMax({paused:true});
      rocketTl.to(rocket, 2, {
       bezier: {
         type: "cubic",
         values: bezier,
         autoRotate: true
       },
       ease: Linear.easeNone
     })
      TweenMax.set([ring, '.ringBg'], {
       attr:{
        r:mainCircleRadius,
        cx:stageWidth/2,
        cy:stageHeight/2
       },
       rotation:-90,
       svgOrigin:`${stageWidth/2} ${stageHeight/2}`
      })
      TweenMax.set('.ringBg', {
       strokeWidth:strokeWidth
      })
      TweenMax.set(rocket, {
       transformOrigin:'50% 50%'
      })
      
      for(let i = 0; i < num; i++){
       let clone = this.select('.dot').cloneNode(true);
       container.appendChild(clone);
       let angle = step * i;
       let point = {
        x: (Math.cos(angle * Math.PI / 180) * mainCircleRadius) + stageWidth/2,
        y: (Math.sin(angle * Math.PI / 180) * mainCircleRadius) + stageHeight/2
       }
       
       TweenMax.set(clone, {
        x:this.randomBetween(point.x+(strokeWidth/4), point.x - (strokeWidth/4)),
        y:this.randomBetween(point.y+(strokeWidth/4), point.y - (strokeWidth/4)),
        attr:{
         r:this.randomBetween(1, 7)/10
        },
        fill:colorArray[i% colorArray.length],
        alpha:0,
        transformOrigin:'50% 50%'
       });
       
       dotArray.push(clone);
      }
      
      introTl.fromTo(rocket, 2, {
       x:bezier[0].x-300,
       y:bezier[0].y,
       alpha:0
      },{
       x:bezier[0].x,
       y:bezier[0].y,
       alpha:1,
       ease:Elastic.easeOut.config(0.3, 0.6)
      }).staggerFrom(['.ringBg', ring], 3, {
       scale:0,
       strokeWidth:0,
       ease:Elastic.easeOut.config(0.49, 0.6)
      }, 0.21, 0)
      .staggerTo(dotArray, 1, {
       alpha:1,
       delay:0.5,
       ease:Linear.easeNone
      }, 0.0021, 0)
         
   var rotatingStarsTl = new TimelineMax({paused:false})
   rotatingStarsTl.staggerTo(dotArray, 10, {
       cycle:{
        duration: () => {
         return this.randomBetween(duration+3, 22)
        }     
       },
       rotation:-360,
       svgOrigin:`${stageWidth/2} ${stageHeight/2}`,
       ease:Linear.easeNone
      },0);
   
      
      tl.addCallback(() => {rotatingStarsTl.play();})
       .from(ring, duration, {
       drawSVG:'0% 0%',
       ease:Linear.easeNone
      })
      .to(rocketTl, duration, {
       time:rocketTl.duration(),
       ease:Linear.easeNone
      },0)
   
      .staggerFromTo(dotArray, 1, {
       alpha:1
      },{
       cycle:{
        y:(i) => {
         return '-=' + this.randomBetween(45, 85)
        },
        duration: () => {
         return this.randomBetween(20, 40)/10
        }
       },
       alpha:0,
       immediateRender:false,
       ease:Sine.easeOut
      }, 0.0009, duration )
      .addCallback(() => {rotatingStarsTl.pause();}, duration)
     .to(['.ringBg', ring] ,  1, {
       alpha:0,
       stroke:'#FFF',
       strokeWidth:0,
       ease:Expo.easeOut
      },duration)
   
     .staggerTo(dotArray, 0.2, {
       //fill:'#FFF',
       scale:'+=1',
       //immediateRender:false,
       transformOrigin:'50% 50%'    
      }, 0.0009, duration)
      .to(rocket, 2, {
       x:bezier[0].x+200,
       alpha:0,
       scale:0
      }, duration)
      
      this.mainTl.add(introTl)
      .add(tl, 2)   
      .add(rotatingStarsTl, 2);
      
      //ScrubGSAPTimeline(this.mainTl)
     }
    randomBetween (min, max) {
     return Math.floor(Math.random() * (max - min + 1) + min);
   }  
     onUpdate(){
       console.log(this)
     }
    
     get timeline():boolean {
       return this.mainTl;
     }
    
   }
   
   
   TweenMax.set('svg', {
     visibility: 'visible'
   })
   
   var app = new App();
   
   //TweenMax.globalTimeScale(0.5)