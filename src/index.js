import { Paddle } from "./paddle.js";
const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d");
const params = new URLSearchParams(window.location.search);
const room = params.get('room');
const player = params.get('player')
const socket = io('http://localhost:4000', {
    transports: ['websocket', 'polling']  
})
const showControl = document.querySelector('.showControl')
const countDown = document.querySelector('.countDown')
const waiting = document.querySelector('.waitingMessage')
socket.emit("joinRoom",room)
socket.on("created",({})=>{
    waiting.innerText = "waiting for player"

})
socket.on("joined",({})=>{
    waiting.style.display = "none" 
    play()
})

let start = false
const config = {
    canvasWidth: 700,
    canvasHeight: 600,
    paddleWidth: 10,
    paddleHeight: 80,
    paddleSpeed: 8,
    ballXSpeed: 6,
    ballYSpeed: 3,
    ballSlice: 4
}

canvas.width = config.canvasWidth
canvas.height = config.canvasHeight

const paddle1 = new Paddle(1,socket)
const paddle2 = new Paddle(-1,socket)

const controller = {
    87: {pressed: false, func:()=> paddle1.moveUp(87)},
    83: {pressed: false, func:()=> paddle1.moveDown(83)},
    38: {pressed: false, func:()=> paddle2.moveUp(38)},
    40: {pressed: false, func:()=> paddle2.moveDown(40)}
}

const ball = {
    r: 8,


}

const resetBall =async () => {
    ball.x = canvas.width/2,
    ball.y = canvas.height/2,
    ball.dx = 6
    ball.dy = 3
    setTimeout(async ()=>{

        await socket.emit("generateNum","generate")
        
        await socket.on("generated",async ({x,y})=>{
        console.log(x,y)
            ball.dx =  config.ballXSpeed * await x
            ball.dy = config.ballYSpeed * await y
        })
    },2000)
    
        
}
resetBall()


const handleKeyDown = (e) => {
    controller[e.keyCode] && (controller[e.keyCode].pressed = true)
}

const handleKeyUp = (e) => {
    controller[e.keyCode] && (controller[e.keyCode].pressed = false)
}

const runPressedButtons = () => {
    Object.keys(controller).forEach(key => {
        controller[key].pressed && controller[key].func()
    })
}

const moveBall = () => {
    
    ball.x += ball.dx
    ball.y += ball.dy
}

const checkWallCollisions = () => {
    ((ball.y - ball.r <= 0) || (ball.y + ball.r >= canvas.height)) && (ball.dy = ball.dy*(-1))
}

const reverseDirection = (paddle) => {
    ball.dx = (-1) * ball.dx
    // added this after lecture to make sure that if you clipped it while the ball was several pixels past the border, it wouldn't reverse direction twice.
    ball.x += Math.sign(ball.dx)*8
    // added this after lecture to add a slice to the hit.
    ball.dy = (ball.y - (paddle.y + (config.paddleHeight/2)))/config.ballSlice

}

const checkPaddleCollisions = () => {
    if (ball.x - ball.r <= config.paddleWidth){
        if(paddle1.checkCollision(ball)){reverseDirection(paddle1)}
    }
    if (ball.x + ball.r >= canvas.width - config.paddleWidth){
        if(paddle2.checkCollision(ball)){reverseDirection(paddle2)}
    }
}

const checkWin = () => {
    (ball.x + ball.r <= 0) && win(paddle1);
    (ball.x - ball.r >= canvas.width) && win(paddle2)
}

const win = (paddle) => {
    resetBall()
    paddle.win()
    console.log("hi")
}


const paintBall = () => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
}


document.addEventListener("keydown", handleKeyDown)
document.addEventListener("keyup", handleKeyUp)


const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paddle1.render(config,ctx,canvas)
    paddle2.render(config,ctx,canvas)
    paintBall()
}

const animate = () => {
    render()
    runPressedButtons()
    checkWallCollisions()
    checkPaddleCollisions()
    
    if(start){
        moveBall()
        
    }
    checkWin()
    window.requestAnimationFrame(animate)     
}

animate()


let count = 3

function play(){
    const timeOut = setInterval(() => {
    if(count ==(-1)){
        clearInterval(timeOut)
        countDown.style.display = "none"
        start = true
    }
    countDown.innerText = count.toString()
    if (player === "p1"){
        showControl.innerText = "controls are S and W "
        
    }else if(player === 'p2'){
        showControl.innerText = "controls are UP and DOWN "

    }
    count -= 1
}, 1000);}
