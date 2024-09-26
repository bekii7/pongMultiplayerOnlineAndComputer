

/* import { io } from "socket.io-client" */
const join = document.querySelector(".join")
const create = document.querySelector(".create")
const cpu = document.querySelector(".cpu")
const friend = document.querySelector(".friend")
const createInput = document.querySelector(".createInput")
const joinInput = document.querySelector('.joinInput')

cpu.addEventListener("click",()=>{
  window.location.href = `withCPU.html`
})
/* ?mode=${encodeURIComponent("playWithComputer")} */

create.addEventListener("click",()=>{
  const value = createInput.value
  console.log(value)
  if(value!== ""){
    fetch("http://localhost:4000/create",{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ room:value })
    })
    .then(response=>response.json())
    .then(data=>{if(data.success){

      window.location.href = `./game.html?room=${value}&player=p1`
    }}
  )
}
else {alert("server is down")}

})
join.addEventListener("click",()=>{
  const value = joinInput.value
  if(value !== ""){
    fetch("http://localhost:4000/join",{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ room:value })
    })
    .then(response=>response.json())
    .then(data=>{if(data.success){

      window.location.href = `./game.html?room=${value}&player=p2`
    }}
  )
}
else {alert("server is down")}

})

/* const fetchApi = async()=>{
  
  try{

    const data = await api.get("/hello")
    console.log(data)
  }
  catch(err){
    console.log(err)
  }
}

  fetchApi()
 */