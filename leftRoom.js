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



LeftRoom = game.createRoom("LeftRoom", "chemical.png")
LeftRoom_uv=game.createRoom("LeftRoom_uv","LeftRoom_uv.png")
LeftRoom_tray=game.createRoom("LeftRoom_tray","LeftRoom_tray.png")

LeftRoom.beaker1 = LeftRoom.createObject("beaker1","beaker1.png")
LeftRoom.beaker1.setWidth(40)
LeftRoom.locateObject(LeftRoom.beaker1,800,295)
LeftRoom.beaker1.onClick=function(){
	playSound("glass.wav")
	LeftRoom.beaker1.pick()
}

LeftRoom.beaker2 = LeftRoom.createObject("beaker2","beaker2.png")
LeftRoom.beaker2.setWidth(45)
LeftRoom.locateObject(LeftRoom.beaker2,1150,420)
LeftRoom.beaker2.onClick=function(){
	playSound("glass.wav")
	LeftRoom.beaker2.pick()
}

LeftRoom.beaker3 = LeftRoom.createObject("beaker3","beaker3.png")
LeftRoom.beaker3.hide()

game.makeCombination(LeftRoom.beaker1,LeftRoom.beaker2,LeftRoom.beaker3)

LeftRoom.keycast2=LeftRoom.createObject("keycast2","keycast2.png")
LeftRoom.keycast2.hide()

LeftRoom.key=LeftRoom.createObject("key","key.png")
LeftRoom.key.hide()

LeftRoom.paper = LeftRoom.createObject("paper","paper.png")
LeftRoom.paper.setWidth(130)
LeftRoom.locateObject(LeftRoom.paper,350,440)

LeftRoom.getpaper = LeftRoom.createObject("getpaper","getpaper.png")
LeftRoom.getpaper.hide()

LeftRoom.paper.onClick=function(){
	playSound("paper.wav")
	LeftRoom.paper.hide()
	LeftRoom.getpaper.pick()
}

LeftRoom.uv = LeftRoom.createObject("uv","uv.png")
LeftRoom.uv.setWidth(130)
LeftRoom.locateObject(LeftRoom.uv,1030,350)

LeftRoom.uv.onClick=function(){
	game.move(LeftRoom_uv)
}

LeftRoom.tray = LeftRoom.createObject("tray","tray.png")
LeftRoom.tray.setWidth(160)
LeftRoom.locateObject(LeftRoom.tray,120,315)

LeftRoom.tray.onClick=function(){
	game.move(LeftRoom_tray)
}

LeftRoom.safe = LeftRoom.createObject("safe", "safe.png")
LeftRoom.safe.setWidth(110)
LeftRoom.locateObject(LeftRoom.safe,1100,530)
LeftRoom.safe.lock()

LeftRoom.rollingpaper = LeftRoom.createObject("rollingpaper", "rollingpaper.png")
LeftRoom.rollingpaper.setWidth(35)
LeftRoom.locateObject(LeftRoom.rollingpaper,1085,524)
LeftRoom.rollingpaper.hide()

LeftRoom.getrollingpaper = LeftRoom.createObject("getrollingpaper", "getrollingpaper.png")
LeftRoom.getrollingpaper.hide()

LeftRoom.rollingpaper.onClick=function(){
	playSound("paper.wav")
	LeftRoom.rollingpaper.hide()
	LeftRoom.getrollingpaper.pick()
}

LeftRoom.keycast = LeftRoom.createObject("keycast", "keycast.png")
LeftRoom.keycast.setWidth(35)
LeftRoom.locateObject(LeftRoom.keycast,1088,505)
LeftRoom.keycast.hide()

LeftRoom.getkeycast = LeftRoom.createObject("getkeycast", "getkeycast.png")
LeftRoom.getkeycast.hide()

LeftRoom.keycast.onClick=function(){
	playSound("stone.wav")
	LeftRoom.keycast.hide()
	LeftRoom.getkeycast.pick()
}

LeftRoom.safe.onClick=function(){
	if(LeftRoom.safe.isLocked()){
		playSound("locked.wav")
		showKeypad("telephone","6429",function(){
			LeftRoom.safe.unlock()
			LeftRoom.safe.setSprite("safeopen.png")
			LeftRoom.keycast.show()
			LeftRoom.rollingpaper.show()
			playSound("safe.wav")
			printMessage("열렸다.")
		})
	}
}

game.makeCombination(LeftRoom.beaker3,LeftRoom.getkeycast,LeftRoom.keycast2)
game.makeCombination(LeftRoom.key,LeftRoom.getkeycast,LeftRoom.keycast2)

//tray
LeftRoom_tray.tray=LeftRoom_tray.createObject("tray","tray1.png")
LeftRoom_tray.tray.setWidth(500)
LeftRoom_tray.locateObject(LeftRoom_tray.tray,680,380)

LeftRoom_tray.password=LeftRoom_tray.createObject("password","password.png")
LeftRoom_tray.password.setWidth(300)
LeftRoom_tray.locateObject(LeftRoom_tray.password,670,380)
LeftRoom_tray.password.hide()

LeftRoom_tray.tray.onClick=function(){
	if(game.getHandItem()==LeftRoom.getpaper){
		LeftRoom_tray.password.show()
		playSound("water.wav")
	}
}

LeftRoom_tray.arrow=LeftRoom_tray.createObject("arrow","화살표.png")
LeftRoom_tray.arrow.setWidth(50)
LeftRoom_tray.locateObject(LeftRoom_tray.arrow,500,680)


LeftRoom_tray.arrow.onClick=function(){
	game.move(LeftRoom)
}


//uv
LeftRoom_uv.uv=LeftRoom_uv.createObject("uv","uvopen.png")
LeftRoom_uv.uv.setWidth(450)
LeftRoom_uv.locateObject(LeftRoom_uv.uv,640,440)

LeftRoom_uv.arrow=LeftRoom_uv.createObject("arrow","화살표.png")
LeftRoom_uv.arrow.setWidth(50)
LeftRoom_uv.locateObject(LeftRoom_uv.arrow,500,680)

LeftRoom_uv.arrow.onClick=function(){
	game.move(LeftRoom)
}

LeftRoom_uv.switch=LeftRoom_uv.createObject("switch","swichoff.png")
LeftRoom_uv.switch.setWidth(28)
LeftRoom_uv.locateObject(LeftRoom_uv.switch,567,528)
LeftRoom_uv.uv.lock()

LeftRoom_uv.switch.onClick=function(){
	if(LeftRoom_uv.uv.isLocked()){
		playSound("switch.wav")
		LeftRoom_uv.uv.open()
	}else if(LeftRoom_uv.uv.isOpened()){
		playSound("switch.wav")
		LeftRoom_uv.uv.lock()
	}
}

LeftRoom_uv.uv.onOpen=function(){
	LeftRoom_uv.switch.setSprite("swichon.png")
}

LeftRoom_uv.uv.onLock=function(){
	LeftRoom_uv.switch.setSprite("swichoff.png")
}


game.start(LeftRoom)


