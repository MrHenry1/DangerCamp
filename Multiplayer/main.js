const $ = document.querySelectorAll.bind(document)

const danger = $('td')
const tables = {
  mines: [],
  safe: []
}
const users = {}
var life = 5
var totalPoints = 0
var totalBombs = tables.mines.length
var pressed = []
var turn = "Jogador 1"
var running = true

class factoryCamp {
  constructor(type, data) {
    if (type === "mine") {
      return new Mine(data)
    }
    else if (type === "safe") {
      return new Safe(data)
    }
    else if(type === "user") {
      return new User(data)
    }
  }
}

class User {
  constructor(data) {
    this.id = data.name
    this.life = 3
    this.removeHeart = () => {
      this.life--
      checkLife(this.id)
    }
  }
}

class Mine {
  constructor(data) {
    this.type = "mine"
    this.position = data.position
    this.removeHeart = () => {
      life--
      checkLife()
    }
  }
}

class Safe {
  constructor(data) {
    this.type = "safe"
    this.position = data.position
    this.points = data.points
    this.addPoints = () => {
      totalPoints += this.points
      checkVictory()
    }
  }
}

function revealAll() {
  var td = $('table tr td')

  tables.mines.forEach(mine => {
    td[mine.position].innerText = "💣"
  })
  tables.safe.forEach(sf => {
    td[sf.position].innerText = sf.points
  })
}

function getUser(id) {
  var u = null
  for(const user in users) {
    if(user === id) {
      u = users[user]
    }
  }
  return u
}

function checkLife(id) {
  const search = `#status .${id} p`
  const user = getUser(id)
  var pl = $(search)
  pl[1].innerText = "Life: " + user.life
  if (user.life === 0) {
    running = false
  var player = turn === "Jogador 1" ? "Jogador 2" : "Jogador 1"
    for (let p of danger) {
      p.removeEventListener("click", open)
    }
    revealAll()
    tables.mines.forEach(mine => {
      var td = $('table tr td')
      td[mine.position].style.background = '#FFEFEF'
    })
    tables.safe.forEach(sf => {
      var td = $('table tr td')
      td[sf.position].style.background = '#EFFFEF'
    })

    var div = document.createElement("div")
    div.className = "result"
    var lose = document.createElement('h1')
    var text = document.createTextNode(player + ' Win!')
    lose.appendChild(text)
    var cnt = $('#container')
    var sts = $('#status')

    var btn = document.createElement("button")
    btn.addEventListener("click", () => window.location.reload())
    var text2 = document.createTextNode("PLAY AGAIN!")
    btn.appendChild(text2)
    div.append(btn)
    cnt[0].append(div)

    sts[0].innerHTML = ""
    sts[0].style.display = "flex"
    sts[0].style.justifyContent = "center"
    sts[0].append(lose)
  }
}

function checkVictory() {
  var numbers = []
  for (let val of pressed) {
    for (let sf of tables.safe) {
      if (sf.position === val) {
        numbers.push(val)
      }
    }
  }

  if (tables.safe.length === numbers.length) {
    var div = document.createElement("div")
    div.className = "result"
    var tie = document.createElement('h1')
    var text = document.createTextNode('EMPATE')
    tie.appendChild(text)
    var sts = $('#status')
    var cnt = $('#container')
    
     sts[0].innerHTML = ""
     sts[0].style.display = "flex"
     sts[0].style.justifyContent = "center"
     sts[0].append(tie)
     
     var btn = document.createElement("button")
     btn.addEventListener("click", () => window.location.reload())
     var text2 = document.createTextNode("PLAY AGAIN!")
     btn.appendChild(text2)
     div.append(btn)
     cnt[0].append(div)

    for (let pl of danger) {
      pl.removeEventListener("click", open)
    }
  }
}

function changeTurn() {
   turn = turn === "Jogador 1" ? "Jogador 2" : "Jogador 1"
    
   const pl = $(' .turn p')
   pl[0].innerText = turn
   
}

function open(event) {
  const index = Number(event.target.className)

  if (pressed.indexOf(index) != -1) return "aready pressed!"
  pressed.push(index)

  let place = tables.safe.filter(safep => safep.position === index)
  if (place.length === 0) {
    place = tables.mines.filter(mine => mine.position === index)
  }

  const currentId = turn === "Jogador 1" ? "player1" : "player2"
  const currentUser = getUser(currentId)

  if (place[0].type === "mine") {
    const btn = event.target

    btn.style.background = "none"
    btn.innerText = "💣"
    const pp = $('#status .sts p')
    pp[0].innerText = "Bombs: " + (totalBombs - 1)
    totalBombs--
    currentUser.removeHeart()
  }
  else if (place[0].type === "safe") {
    const btn = event.target

    btn.style.background = "none"
    btn.innerText = place[0].points
    place[0].addPoints()

    
  }
  if(running) {
  changeTurn()
  }
}

function createStatus() {
  const status = $('#status .sts p')

  status[0].innerText = "Bombs: " + tables.mines.length
}


function loadGame() {

  for (let position = 0; position < danger.length; position++) {
    for (const td of danger) {
      td.addEventListener("click", open)
    }

    danger[position].className = position

    let math = Math.random()
    const object = {
      points: Math.floor(Math.random() * 5) + 1,
      position
    }
    if (math < 0.70) {
      tables.safe.push(new factoryCamp("safe", object))
    }
    else {
      tables.mines.push(new factoryCamp("mine", { position }))
    }
  }
  users.player1 = new factoryCamp("user", {name: "player1"})
  users.player2 = new factoryCamp("user", {name: "player2"})

  totalBombs = tables.mines.length
  createStatus()
}

loadGame()