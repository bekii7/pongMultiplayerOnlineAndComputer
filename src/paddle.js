const params = new URLSearchParams(window.location.search);
const player = params.get('player');
const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d");
export const config = {
    canvasWidth: 700,
    canvasHeight: 600,
    paddleWidth: 10,
    paddleHeight: 80,
    paddleSpeed: 8,
    ballXSpeed: 6,
    ballYSpeed: 3,
    ballSlice: 4
}
export class Paddle {
    constructor(direction,socket){
        this.direction = direction
        this.y = config.canvasHeight/2 - config.paddleHeight/2
        direction === 1 ? this.x = 0 : this.x = config.canvasWidth - config.paddleWidth
        this.score = 0
        this.socket = socket
        this.socket.on("up",({data})=>{
            if(data.paddleD === this.direction){
                this.y -= config.paddleSpeed
                this.y < 0 && (this.y = 0)
            }
            
        })
        this.socket.on("down",({data})=>{
            if(data.paddleD === this.direction){
                this.y += data.speedY;
                (this.y + data.paddleH > data.canvasH) && (this.y =data.canvasH  - data.paddleH)
            }
            
        })
    }

    render = (config,ctx,canvas) => {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(this.x, this.y, config.paddleWidth, config.paddleHeight);
        ctx.font = "30px Arial";
        ctx.fillText(this.score, canvas.width/2 + (200 * this.direction), 50);
    }

    checkCollision = (ball) => {
        return !!((this.y <= (ball.y + ball.r)) && (this.y + config.paddleHeight >= (ball.y - ball.r)))
    }

    moveDown = (code) => {
        if(!player){

            this.socket.emit("moveDown",({y:this.y,speedY:config.paddleSpeed,paddleH:config.paddleHeight,canvasH:canvas.height,paddleD:this.direction,code}))
        }
        this.socket.emit("moveDown",({y:this.y,speedY:config.paddleSpeed,paddleH:config.paddleHeight,canvasH:canvas.height,paddleD:this.direction,player,code}))
        
    }
    moveUp = (code) => {
        if(!player){

            this.socket.emit("moveUp",({speedy:config.paddleSpeed,paddleD:this.direction,code}))
        }
        this.socket.emit("moveUp",({speedy:config.paddleSpeed,paddleD:this.direction,player,code}))
    }

    win = () => this.score ++
}

