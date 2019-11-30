Function.prototype.member = function(name, value){
	this.prototype[name] = value
}

//----------------------------------------Game Definition--------------------------------
function Game(){}
Game.start = function(room, welcome){
	game.start(room.id)
	printMessage(welcome)
}
Game.end = function(){
	game.clear()
}
Game.move = function(room){
	game.move(room.id)	
}

Game.handItem = function(){
	return game.getHandItem()
}

Game.makeCombination = function(item1, item2, item3){

	game.makeCombination(item1.id, item2.id, item3.id)

}

//---------------------------------------Room Definition--------------------------------------
//room 생성
function Room(name, background){
	this.name = name
	this.background = background
	this.id = game.createRoom(name, background)  //room1, room2, room3
}

//불 밝기
Room.member('setRoomLight', function(intensity){  
	this.id.setRoomLight(intensity)
})


//-------------------------------------Object Definition-------------------------------------
//object 생성
function Object(room, name, image){
	this.room = room
	this.name = name
	this.image = image
	
	if (room !== undefined){
		this.id = room.id.createObject(name, image)  //object
	}
}

//status - 열림, 닫힘, 잠김
Object.STATUS = { OPENED: 0, CLOSED: 1, LOCKED: 2 }  


//setSprite - 이미지 변화
Object.member('setSprite', function(image){
	this.image = image
	this.id.setSprite(image)
})

//resize - 크기
Object.member('resize', function(width){
	this.id.setWidth(width)
})

//setDescription -메세지
Object.member('setDescription', function(description){
	this.id.setItemDescription(description)
})
//getX
Object.member('getX', function(){
	return this.id.getX()
})
//getY
Object.member('getY', function(){
	return this.id.getY()
})
//locate - 배치
Object.member('locate', function(x, y){
	this.room.id.locateObject(this.id, x, y)
})

//moving - 이동
Object.member('moving', function(x, y){
	this.id.moveX(x)
	this.id.moveY(y)
})

//show - 상태 변화
Object.member('show', function(){
	this.id.show()
})
//hide
Object.member('hide', function(){
	this.id.hide()
})
//open
Object.member('open', function(){
	this.id.open()
})
//close
Object.member('close', function(){
	this.id.close()
})
//lock
Object.member('lock', function(){
	this.id.lock()
})
//unlock
Object.member('unlock', function(){
	this.id.unlock()
})
//isOpened - 상태 출력
Object.member('isOpened', function(){
	return this.id.isOpened()
})
//isClosed
Object.member('isClosed', function(){
	return this.id.isClosed()
})
//isLocked
Object.member('isLocked', function(){
	return this.id.isLocked()
})
//pick - 줍기
Object.member('pick', function(){
	this.id.pick()
})
//isPicked - 주운 상태
Object.member('isPicked', function(){
	return this.id.isPicked()
})


//----------------------------------------Door Definition------------------------------------
//door 생성
function Door(room, name, closedImage, openedImage, connectedTo,sound){
	Object.call(this, room, name, closedImage)  

	// Door properties
	this.sound=sound
	this.closedImage = closedImage
	this.openedImage = openedImage
	this.connectedTo = connectedTo
}

Door.prototype = new Object()   // inherited from Object (Door << Object)


//door의 onClick - 클릭 누르면
Door.member('onClick', function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		playSound(this.sound)
		this.id.open()
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}
	else if(this.id.isLocked()){
		printMessage("문이 잠겨있다.")
	}
})

//onOpen  - 열면
Door.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
})

//onClose - 닫으면
Door.member('onClose', function(){
	this.id.setSprite(this.closedImage)
})

//----------------------------------------Keypad Definition-------------------------------------------
//Keypad 생성
function Keypad(room, name, image, password, callback){
	Object.call(this, room, name, image)

	// Keypad properties
	this.password = password
	this.callback = callback
}

Keypad.prototype = new Object()   // inherited from Object

//keypad의 onClick - 클릭하면
Keypad.member('onClick', function(){
	showKeypad('number', this.password, this.callback)
})

//--------------------------------------DoorLock Definition------------------------------------------
//DoorLock - 키패드의 기능 구현(callback)
function DoorLock(room, name, image, password, door, message){
	Keypad.call(this, room, name, image, password, function(){
		printMessage(message)
		door.unlock()
	})
}

DoorLock.prototype = new Keypad()   // inherited from Keypad

//-------------------------------------- Item Definition ---------------------------------------------
//Item 생성 - Object 상속받음
function Item(room, name, image){
	Object.call(this, room, name, image)
}

Item.prototype = new Object()   // inherited from Object

//item의 onClick - 줍기
Item.member('onClick', function(){
	this.id.pick()
})

//isHanded - item 사용하기
Item.member('isHanded', function(){
	return Game.handItem() == this.id
})
//------------------------------------------getItem Definition----------------------------------------
function getItem(room, name, image,sound){
    Object.call(this, room, name, image)
    
    this.sound=sound
}

getItem.prototype = new Object()   // inherited from Object

//item의 onClick - 줍기
getItem.member('onClick', function(){
    playSound(this.sound)
	this.id.pick()
})

//isHanded - item 사용하기
getItem.member('isHanded', function(){
	return Game.handItem() == this.id
})






/////////////////////////////////////사용자 정의 함수//////////////////////////////////

chemistry = new Room('chemistry', 'chemical.png')
chemistry_uv = new Room('chemistry_uv','chemistry_uv.png')
chemistry_tray = new Room('chemistry_tray','chemistry_tray.png')
aisle = new Room('aisle', 'aisle.png')
room=new Room('room','물리방.png')

aisle.rightdoor = new Door(aisle, 'rightdoor', 'rightdoor.png', 'rightdooropen.png',room,'door.wav')
aisle.rightdoor.resize(220)
aisle.rightdoor.locate(1050, 335)

aisle.middledoor = new Door(aisle, 'middledoor', 'middledoor.png', 'middledooropen.png',room,'door.wav')
aisle.middledoor.resize(440)
aisle.middledoor.locate(650, 335)

aisle.leftdoor = new Door(aisle, 'leftdoor', 'leftdoor.png', 'leftdooropen.png',chemistry,'door.wav')
aisle.leftdoor.resize(220)
aisle.leftdoor.locate(250, 335)

aisle.chainleft = new Object(aisle, 'chainleft', 'chainleft.png')
aisle.chainleft.resize(400)
aisle.chainleft.locate(650,350)

aisle.chainright = new Object(aisle, 'chainright', 'chainright.png')
aisle.chainright.resize(400)
aisle.chainright.locate(650,350)
aisle.chainright.lock()

aisle.chain1 = new Object(aisle, 'chain1', 'chain1.png')
aisle.chain1.resize(150)
aisle.chain1.locate(500,560)
aisle.chain1.hide()

aisle.chain2 = new Object(aisle, 'chain2', 'chain2.png')
aisle.chain2.resize(150)
aisle.chain2.locate(830,560)
aisle.chain2.hide()


//chemistry

chemistry.beaker1 = new getItem(chemistry, 'beaker1', 'beaker1.png','glass.wav')
chemistry.beaker1.resize(40)
chemistry.beaker1.locate(800,295)


chemistry.beaker2 = new getItem(chemistry, 'beaker2', 'beaker2.png','glass.wav')
chemistry.beaker2.resize(45)
chemistry.beaker2.locate(1150,420)

chemistry.beaker3 = new Item(chemistry, 'beaker3', 'beaker3.png')
chemistry.beaker3.hide()

game.makeCombination(chemistry.beaker1.id,chemistry.beaker2.id,chemistry.beaker3.id)

chemistry.keycast2= new Item(chemistry, 'keycast2', 'keycast2.png')
chemistry.keycast2.hide()

chemistry.key= new Item(chemistry, 'key', 'key.png')
chemistry.key.hide()

chemistry.getpaper= new Item(chemistry, 'getpaper', 'getpaper.png')
chemistry.getpaper.hide()

chemistry.paper = new getItem(chemistry,'paper','paper.png','paper.wav')
chemistry.paper.resize(130)
chemistry.paper.locate(350,440)

chemistry.paper.onClick=function(){
    playSound('paper.wav')
    chemistry.paper.hide()
    chemistry.getpaper.pick()
}

chemistry.uv = new Object(chemistry, 'uv', 'uv.png')
chemistry.uv.resize(130)
chemistry.uv.locate(1030,350)

chemistry.uv.onClick=function(){
	Game.move(chemistry_uv)
}

chemistry.tray = new Object(chemistry, 'tray', 'tray.png')
chemistry.tray.resize(160)
chemistry.tray.locate(120,315)

chemistry.tray.onClick=function(){
	Game.move(chemistry_tray)
}

chemistry.safe = new Object(chemistry, 'safe', 'safe.png')
chemistry.safe.resize(110)
chemistry.safe.locate(1100,530)
chemistry.safe.lock()

chemistry.rollingpaper = new Item(chemistry, 'rollingpaper', 'rollingpaper.png')
chemistry.rollingpaper.resize(35)
chemistry.rollingpaper.locate(1085,524)
chemistry.rollingpaper.hide()

chemistry.getrollingpaper = new Item(chemistry, 'getrollingpaper', 'getrollingpaper.png')
chemistry.getrollingpaper.hide()

chemistry.rollingpaper.onClick=function(){
	playSound("paper.wav")
	chemistry.rollingpaper.hide()
	chemistry.getrollingpaper.pick()
}

chemistry.keycast = new Item(chemistry, 'keycast', 'keycast.png')
chemistry.keycast.resize(35)
chemistry.keycast.locate(1088,505)
chemistry.keycast.hide()

chemistry.getkeycast = new Item(chemistry, 'getkeycast', 'getkeycast.png')
chemistry.getkeycast.hide()

chemistry.keycast.onClick=function(){
	playSound("stone.wav")
	chemistry.keycast.hide()
	chemistry.getkeycast.pick()
}

chemistry.safe.onClick=function(){
	if(chemistry.safe.isLocked()){
		playSound("locked.wav")
		showKeypad("telephone","6429",function(){
			chemistry.safe.unlock()
			chemistry.safe.setSprite("safeopen.png")
			chemistry.keycast.show()
			chemistry.rollingpaper.show()
			playSound("safe.wav")
			printMessage("열렸다.")
		})
	}
}

chemistry.arrow = new Object(chemistry, 'arrow', '화살표.png')
chemistry.arrow.resize(50)
chemistry.arrow.locate(500,680)

chemistry.arrow.onClick=function(){
	Game.move(aisle)
}

game.makeCombination(chemistry.beaker3.id,chemistry.getkeycast.id,chemistry.keycast2.id)
game.makeCombination(chemistry.key.id,chemistry.getkeycast.id,chemistry.keycast2.id)

//tray

chemistry_tray.tray = new Object(chemistry_tray, 'tray', 'tray1.png')
chemistry_tray.tray.resize(500)
chemistry_tray.tray.locate(680,380)

chemistry_tray.password = new Object(chemistry_tray, 'password', 'password.png')
chemistry_tray.password.resize(300)
chemistry_tray.password.locate(670,380)
chemistry_tray.password.hide()

chemistry_tray.tray.onClick = function(){
	if(chemistry.getpaper.isHanded()){
		chemistry_tray.password.show()
		playSound("water.wav")	
	}
}


chemistry_tray.arrow = new Object(chemistry_tray, 'arrow', '화살표.png')
chemistry_tray.arrow.resize(50)
chemistry_tray.arrow.locate(500,680)

chemistry_tray.arrow.onClick=function(){
    
	Game.move(chemistry)
}


//uv

chemistry_uv.uv = new Object(chemistry_uv, 'uv', 'uvopen.png')
chemistry_uv.uv.resize(450)
chemistry_uv.uv.locate(640,440)

chemistry_uv.arrow = new Object(chemistry_uv, 'arrow', '화살표.png')
chemistry_uv.arrow.resize(50)
chemistry_uv.arrow.locate(500,680)

chemistry_uv.arrow.onClick=function(){
	Game.move(chemistry)
}

chemistry_uv.switch = new Object(chemistry_uv, 'switch', 'switchoff.png')
chemistry_uv.switch.resize(28)
chemistry_uv.switch.locate(567,528)
chemistry_uv.uv.lock()

chemistry_uv.switch.onClick=function(){
	if(chemistry_uv.uv.isLocked()){
		playSound("switch.wav")
		chemistry_uv.uv.open()
	}else if(chemistry_uv.uv.isOpened()){
		playSound("switch.wav")
		chemistry_uv.uv.lock()
	}
}

chemistry_uv.uv.onOpen=function(){
	chemistry_uv.switch.setSprite("switchon.png")
}

chemistry_uv.uv.onLock=function(){
	chemistry_uv.switch.setSprite("switchoff.png")
}

//aisle key

aisle.chainright.onClick = function(){
	if(chemistry.key.isHanded()){
		aisle.chainright.open()
		aisle.chain1.show()
		playSound("chain.wav")
	}
}

aisle.chainright.onOpen=function(){
	aisle.chainright.hide()
}


Game.start(aisle, '벽을 뚫었따.')