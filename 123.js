/*
 * 프로젝트명 : 방탈출게임
 * 팀 : Mad Scientist(5조)
 * 구성원 : 김기문, 김민준, 김유빈, 한명지 
 * 
 * 이미지 경로는 일단 null값을 넣어놨어요 - 기문 19.11.20
 * 아시다시피 방과 방 사이에 있는 문은 우리 눈에는 하나지만 프로그램 상에서는 객체가 2개 필요한데,
 * 이 두 오브젝트 사이에 혼동이 없도록 두 객체의 변수 명은 하나로 통일했어요.
 * ex) 통로(aisle)와 우측 방(roomR_F) 사이에 있는 문을 만드는 부분에서, 
 * aisle.doorR와 roomR_F.doorR 처럼 두 객체의 변수 명은 doorR로 같습니다.
 * 프로그램 상에서는 두 개는 서로 다른 객체이지만, 사람 머리로 생각할 때는 같은 문인 것처럼요!
 */







//프로토타입 대신에 member 사용
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
function Door(room, name, closedImage, openedImage, connectedTo){
	Object.call(this, room, name, closedImage)  

	// Door properties
	this.closedImage = closedImage
	this.openedImage = openedImage
	this.connectedTo = connectedTo
}

Door.prototype = new Object()   // inherited from Object (Door << Object)


//door의 onClick - 클릭 누르면
Door.member('onClick', function(){
	if (!this.id.isLocked() && this.id.isClosed()){
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
		printMessage("잠김")
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


//--------------------------------------left room ---------------------------------------------



chemistry = game.createRoom("chemistry", "chemical.png")
chemistry_uv=game.createRoom("chemistry_uv","chemistry_uv.png")
chemistry_tray=game.createRoom("chemistry_tray","chemistry_tray.png")

chemistry.beaker1 = chemistry.createObject("beaker1","beaker1.png")
chemistry.beaker1.setWidth(40)
chemistry.locateObject(chemistry.beaker1,800,295)
chemistry.beaker1.onClick=function(){
	playSound("glass.wav")
	chemistry.beaker1.pick()
}

chemistry.beaker2 = chemistry.createObject("beaker2","beaker2.png")
chemistry.beaker2.setWidth(45)
chemistry.locateObject(chemistry.beaker2,1150,420)
chemistry.beaker2.onClick=function(){
	playSound("glass.wav")
	chemistry.beaker2.pick()
}

chemistry.beaker3 = chemistry.createObject("beaker3","beaker3.png")
chemistry.beaker3.hide()

game.makeCombination(chemistry.beaker1,chemistry.beaker2,chemistry.beaker3)

chemistry.keycast2=chemistry.createObject("keycast2","keycast2.png")
chemistry.keycast2.hide()

chemistry.key=chemistry.createObject("key","key.png")
chemistry.key.hide()

chemistry.paper = chemistry.createObject("paper","paper.png")
chemistry.paper.setWidth(130)
chemistry.locateObject(chemistry.paper,350,440)

chemistry.getpaper = chemistry.createObject("getpaper","getpaper.png")
chemistry.getpaper.hide()

chemistry.paper.onClick=function(){
	playSound("paper.wav")
	chemistry.paper.hide()
	chemistry.getpaper.pick()
}

chemistry.uv = chemistry.createObject("uv","uv.png")
chemistry.uv.setWidth(130)
chemistry.locateObject(chemistry.uv,1030,350)

chemistry.uv.onClick=function(){
	game.move(chemistry_uv)
}

chemistry.tray = chemistry.createObject("tray","tray.png")
chemistry.tray.setWidth(160)
chemistry.locateObject(chemistry.tray,120,315)

chemistry.tray.onClick=function(){
	game.move(chemistry_tray)
}

chemistry.safe = chemistry.createObject("safe", "safe.png")
chemistry.safe.setWidth(110)
chemistry.locateObject(chemistry.safe,1100,530)
chemistry.safe.lock()

chemistry.rollingpaper = chemistry.createObject("rollingpaper", "rollingpaper.png")
chemistry.rollingpaper.setWidth(35)
chemistry.locateObject(chemistry.rollingpaper,1085,524)
chemistry.rollingpaper.hide()

chemistry.getrollingpaper = chemistry.createObject("getrollingpaper", "getrollingpaper.png")
chemistry.getrollingpaper.hide()

chemistry.rollingpaper.onClick=function(){
	playSound("paper.wav")
	chemistry.rollingpaper.hide()
	chemistry.getrollingpaper.pick()
}

chemistry.keycast = chemistry.createObject("keycast", "keycast.png")
chemistry.keycast.setWidth(35)
chemistry.locateObject(chemistry.keycast,1088,505)
chemistry.keycast.hide()

chemistry.getkeycast = chemistry.createObject("getkeycast", "getkeycast.png")
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

game.makeCombination(chemistry.beaker3,chemistry.getkeycast,chemistry.keycast2)
game.makeCombination(chemistry.key,chemistry.getkeycast,chemistry.keycast2)

//tray
chemistry_tray.tray=chemistry_tray.createObject("tray","tray1.png")
chemistry_tray.tray.setWidth(500)
chemistry_tray.locateObject(chemistry_tray.tray,680,380)

chemistry_tray.password=chemistry_tray.createObject("password","password.png")
chemistry_tray.password.setWidth(300)
chemistry_tray.locateObject(chemistry_tray.password,670,380)
chemistry_tray.password.hide()

chemistry_tray.tray.onClick=function(){
	if(game.getHandItem()==chemistry.getpaper){
		chemistry_tray.password.show()
		playSound("water.wav")
	}
}

chemistry_tray.arrow=chemistry_tray.createObject("arrow","화살표.png")
chemistry_tray.arrow.setWidth(50)
chemistry_tray.locateObject(chemistry_tray.arrow,500,680)


chemistry_tray.arrow.onClick=function(){
	game.move(chemistry)
}


//uv
chemistry_uv.uv=chemistry_uv.createObject("uv","uvopen.png")
chemistry_uv.uv.setWidth(450)
chemistry_uv.locateObject(chemistry_uv.uv,640,440)

chemistry_uv.arrow=chemistry_uv.createObject("arrow","화살표.png")
chemistry_uv.arrow.setWidth(50)
chemistry_uv.locateObject(chemistry_uv.arrow,500,680)

chemistry_uv.arrow.onClick=function(){
	game.move(chemistry)
}

chemistry_uv.switch=chemistry_uv.createObject("switch","swichoff.png")
chemistry_uv.switch.setWidth(28)
chemistry_uv.locateObject(chemistry_uv.switch,567,528)
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
	chemistry_uv.switch.setSprite("swichon.png")
}

chemistry_uv.uv.onLock=function(){
	chemistry_uv.switch.setSprite("swichoff.png")
}


game.start(chemistry)


