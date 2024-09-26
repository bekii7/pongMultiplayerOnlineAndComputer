const express = require("express")
const socketio = require("socket.io")
const path = require('path')
const http = require("http")
const cors = require("cors")
const bodyParser = require("body-parser")
const { log } = require("console")
const app = express()
const server = http.createServer(app);
const io = socketio(server,{
  cors: {
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
});
const rooms = []
app.use(cors())
app.use(bodyParser.json())



app.post('/create',async (req,res)=>{
  res.json({success:true})
})

app.post('/join',async (req,res)=>{
  const room = req.body.room
  console.log(rooms)
  for(const item of rooms){
    if (item===room){
      res.json({success:true})
      break
    }else{res.json({success:false})}
  }
  
})
io.on("connection",(socket)=>{
  console.log("new connection ")
  let created
  socket.on("joinRoom",(created)=>{
    socket.join(created)
    created = created
    for (const item of rooms){
      if (item === created){
        io.to(created).emit('joined',"start")
        break  
      }
    }
    rooms.push(created)
    socket.emit('created',"waiting for player")
  })
  socket.on("generateNum",(data)=>{
    const x = Math.sign(Math.random()-.5)
    const y = Math.sign(Math.random()-.5)
    io.emit("generated",({x,y}))
  })

  socket.on("moveDown",(data)=>{
    if (data.code === 40 && data.player ==="p2" || 
      data.code === 83 && data.player ==="p1"
     ){
      console.log(data ==null)
       io.emit("down",{data})
      }
      else if(data.code){
       io.emit("down",{data})

     }
    
  })
  socket.on("moveUp",(data)=>{
    if (data.code === 38 && data.player ==="p2" || 
      data.code === 87 && data.player ==="p1"
     ){
    io.emit("up",{data})
     }else{
       io.emit("up",{data})
     }

    
  })
})

const port = 4000
server.listen(port,()=>{
console.log(`server is running on ${port}`)
})