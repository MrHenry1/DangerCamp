const $ = document.querySelectorAll.bind(document)

const danger = $('td')
const tables = {
  mines: [],
  safe: []
}
var life = 3
var totalPoints = 0
var pressed = []

class factoryCamp {
  constructor(type, data) {
    if(type === "mine") {
      return new Mine(data)
    }
    else if(type === "safe") {
      return new Safe(data)
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

function checkLife() {
  var pl = $('#status p') 
  pl[1].innerText = "Life: " + life
  if(life === 0) {
    
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
    var text = document.createTextNode('Game Over')
    lose.appendChild(text)
    var cnt = $('#container')
    var sts = $('#status')
  
    var btn = document.createElement("button")
    btn.addEventListener("click", ()=> window.location.reload())
    var text2 = document.createTextNode("TRY AGAIN!")
    btn.appendChild(text2)
    div.append(btn)
    cnt[0].append(div)
    
    sts[0].innerHTML = ""
    sts[0].style.textAlign = "center"
    sts[0].style.width = 100%
    sts[0].append(lose)
  }
}

function checkVictory() {
  var numbers = []
  for(let val of pressed) {
    for(let sf of tables.safe) {
      if(sf.position === val) {
        numbers.push(val)
      }
    }
  }
  
 if(tables.safe.length === numbers.length) {
    var div = document.createElement("div")
    div.className = "result"
    var win = document.createElement('h1')
    var text = document.createTextNode('Victory')
    win.appendChild(text)
    var cnt = $('#container') 
    div.append(win)
    cnt[0].append(div)
    
    for(let pl of danger) {
      pl.removeEventListener("click", open)
    }
  }
}

function open(event) {
  const index = Number(event.target.className)
  
  if(pressed.indexOf(index) != -1) return "aready pressed!"
  pressed.push(index)
  
  let place = tables.safe.filter(safep => safep.position === index)
  if (place.length === 0) {
    place = tables.mines.filter(mine => mine.position === index)
  }
  
  
  if(place[0].type === "mine") {
    const btn = event.target
    
    btn.style.background = "none"
    btn.innerText = "💣"
    
    place[0].removeHeart()
  }
  else if (place[0].type === "safe") {
    const btn = event.target
  
    btn.style.background = "none"
    btn.innerText =  place[0].points
    place[0].addPoints()
    
    const pp = $('#status p')
    pp[0].innerText = "Points: " + totalPoints
  }
}


function loadGame() {
  for(let position = 0;position < danger.length;position++) {
    for(const td of danger) {
      td.addEventListener("click", open )
    }
    
    danger[position].className = position
    
    let math = Math.random()
    const object = {
      points: Math.floor(Math.random() * 5) + 1,
      position
    }
    if (math < 0.5) {
      tables.safe.push(new factoryCamp("safe", object))
    }
    else {
      tables.mines.push(new factoryCamp("mine", { position }))
    }
  }
}

loadGame()

