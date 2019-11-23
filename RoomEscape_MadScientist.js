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






/////////////////////////////////////사용자 정의 함수//////////////////////////////////

//-------------------------------------Arrow-----------------------------------------*유빈씨 코드
const LEFT = 1
const UPPER = 2
const RIGHT = 3
const BOTTOM = 4

function Arrow(room, name, image, direction){
	Object.call(this, room, name, image)

	// Arrow properties
	this.direction = direction //1: 왼쪽, 2: 위쪽, 3: 오른쪽 4: 아래쪽
    this.resize(40)
    switch (direction){
        case LEFT:
            this.locate(40,350);
            break;
        case RIGHT:
            this.locate(1230,350);
            break;
        case UPPER:
            this.locate(600,40);
            break;
        case BOTTOM:
            this.locate(600,680);
            break;
    }
}
Arrow.prototype = new Object()   // inherited from Object
//arrow의 onClick - 클릭하면
Arrow.member('onClick', function(){})












/////////////////////////////////시작하는 방(mainRoom)/////////////////////////////////

mainRoom = game.createRoom("Main", null) // 방 생성, 2번째 파라미터로 배경 이미지가 들어갑니다.
aisle = game.createRoom("통로", null)     //복도 생성
mainRoom.hammer = mainRoom.createObject("해머", null)   //해머 객체 생성
 
mainRoom.hole = mainRoom.createObject("Hole", null) //복도로 가기 위한 구멍 생성
mainRoom.hole.setWidth(100)  //모든 객체의 사이즈는 추후 조정 필요
mainRoom.lock() //잠금을 기본 상태로
mainRoom.createObject("Hammer", null)   //해머
 
mainRoom.hole.onClick = function(){ //구멍에만 적용되는 익명 함수
    if(mainRoom.hole.isLocked()){
        if(game.getHandItem() == mainRoom.hammer){  //해머가 손에 있다면!
            printMessage("벽을 부순다.")
            /*
                소리나는 효과와 텀을 주는 코드 => 추후 작업 필요
            */
            mainRoom.hole.setSprite(null)   //부순 후 이미지
            mainRoom.hole.unlock()
            mainRoom.hole.open()
        }
        else{
            printMessage("균열 사이로 공간이 보인다.")
        }
    }else if(mainRoom.hole.isOpened()){
        game.move(aisle)
    }
}

/*
 *중앙 문으로 이어지는 곳이 최종 스테이지라면, roomC(Center Room)가 최종 탈출 문이 있는 방이 됩니다.
 *최종 스테이지인 방(roomC)의 코드를 마지막에 만들 것 같아서, aisle->roomL(Left)->roomR(Right)->roomC 순서대로 코드를 구성했어요
 */
 



/////////////////////////////통로///////////////////////////////
aisle.doorL = aisle.createObject("좌측 문", null)   //통로와 좌측 방 사이에 위치한 문(==doorL, Left Door)
aisle.doorC = aisle.createObject("중앙 문", null)   //통로와 최종 방 사이에 위치한 문(==doorC, Center Door)
aisle.doorR = aisle.createObject("우측 문", null)   //통로와 우측 방 사이에 위치한 문(==doorR, Right Door)
aisle.hole = aisle.createObject("구멍", null)   //통로와 시작하는 방 사이를 연결하는 구멍(==hole)
aisle.doorC.lock()  //중앙 문은 잠궈둡니다.

//열렸을 때 문의 이미지를 바꾸고 싶다면 추가 코드(onClick(), setSprite() 등)가 필요해요. -기문 19.11.20
aisle.doorL.onClick = function(){game.move(roomL_F)}
aisle.doorR.onClick = function(){game.move(roomR_F)}
aisle.doorC.onClick = function(){game.move(roomC_F)}
aisle.hole.onClick = function(){game.move(mainRoom)}
 
aisle.doorC.onClick = function() {
	if(aisle.doorC.isClosed()){ 
		aisle.doorC.open()
	} else if (aisle.doorC.isOpened()){ 
		game.clear()
	} else if(aisle.doorC.isLocked()){
		printMessage("문이 잠겨있다.")
	}
}




////////////////////////////Left Room//////////////////////////////
roomL_F = game.createRoom("좌측 방", null)
roomL_L = game.createRoom("좌측 방", null)
roomL_B = game.createRoom("좌측 방", null)
roomL_R = game.createRoom("좌측 방", null)

//왼쪽방(Left) 정면(Front) = L_F
roomL_F.arrowL = new Arrow(roomL_F, 'Left Arrow', '화살표1.jpg', LEFT)
roomL_F.arrowR = new Arrow(roomL_F, 'Right Arrow', '화살표3.jpg', RIGHT)
roomL_F.arrowL.onClick = function(){Game.move(roomL_L)}
roomL_F.arrowR.onClick = function(){Game.move(roomL_R)}

//왼쪽방(Left) 좌측(Left) = L_L
roomL_L.arrowL = new Arrow(roomL_L, 'Left Arrow', '화살표1.jpg', LEFT)
roomL_L.arrowR = new Arrow(roomL_L, 'Right Arrow', '화살표3.jpg', RIGHT)
roomL_L.arrowL.onClick = function(){Game.move(roomL_B)}
roomL_L.arrowR.onClick = function(){Game.move(roomL_F)}

//왼쪽방(Left) 후측(Back) = L_B
roomL_B.arrowL = new Arrow(roomL_B, 'Left Arrow', '화살표1.jpg', LEFT)
roomL_B.arrowR = new Arrow(roomL_B, 'Right Arrow', '화살표3.jpg', RIGHT)
roomL_B.arrowL.onClick = function(){Game.move(roomL_R)}
roomL_B.arrowR.onClick = function(){Game.move(roomL_L)}

//왼쪽방(Left) 우측(Right) = L_R
roomL_R.arrowL = new Arrow(roomL_R, 'Left Arrow', '화살표1.jpg', LEFT)
roomL_R.arrowR = new Arrow(roomL_R, 'Right Arrow', '화살표3.jpg', RIGHT)
roomL_R.arrowL.onClick = function(){Game.move(roomL_F)}
roomL_R.arrowR.onClick = function(){Game.move(roomL_B)}

//통로와 좌측 방 사이에 위치한 문(==doorL, 통로 기준 좌측 문)
roomL_B.doorL = roomL_B.createObject("좌측 문", null)
roomL_B.doorL.onClick = function(){game.move(aisle)}
 



////////////////////////////Right Room//////////////////////////////
roomR_F = game.createRoom("우측 방", null)
roomR_L = game.createRoom("우측 방", null)
roomR_B = game.createRoom("우측 방", null)
roomR_R = game.createRoom("우측 방", null)

//오른쪽방(Right) 정면(Front) = R_F
roomR_F.arrowL = new Arrow(roomR_F, 'Left Arrow', '화살표1.jpg', LEFT)
roomR_F.arrowR = new Arrow(roomR_F, 'Right Arrow', '화살표3.jpg', RIGHT)
roomR_F.arrowL.onClick = function(){Game.move(roomR_L)}
roomR_F.arrowR.onClick = function(){Game.move(roomR_R)}

//오른쪽방(Right) 좌측(Left) = R_L
roomR_L.arrowL = new Arrow(roomR_L, 'Left Arrow', '화살표1.jpg', LEFT)
roomR_L.arrowR = new Arrow(roomR_L, 'Right Arrow', '화살표3.jpg', RIGHT)
roomR_L.arrowL.onClick = function(){Game.move(roomR_B)}
roomR_L.arrowR.onClick = function(){Game.move(roomR_F)}

//오른쪽방(Right) 후측(Back) = R_B
roomR_B.arrowL = new Arrow(roomR_B, 'Left Arrow', '화살표1.jpg', LEFT)
roomR_B.arrowR = new Arrow(roomR_B, 'Right Arrow', '화살표3.jpg', RIGHT)
roomR_B.arrowL.onClick = function(){Game.move(roomR_R)}
roomR_B.arrowR.onClick = function(){Game.move(roomR_L)}

//오른쪽방(Right) 우측(Right) = R_R
roomR_R.arrowL = new Arrow(roomR_R, 'Left Arrow', '화살표1.jpg', LEFT)
roomR_R.arrowR = new Arrow(roomR_R, 'Right Arrow', '화살표3.jpg', RIGHT)
roomR_R.arrowL.onClick = function(){Game.move(roomR_F)}
roomR_R.arrowR.onClick = function(){Game.move(roomR_B)}

//통로와 우측 방 사이에 위치한 문(==doorR)
roomR_B.doorR = roomR_B.createObject("우측 문", null)
roomR_B.doorR.onClick = function(){game.move(aisle)}
 




////////////////////////////Center Room//////////////////////////////
roomC_F = game.createRoom("중앙 방", null)
roomC_L = game.createRoom("중앙 방", null)
roomC_B = game.createRoom("중앙 방", null)
roomC_R = game.createRoom("중앙 방", null)

//중앙방(Center) 정면(Front) = C_F
roomC_F.arrowL = new Arrow(roomC_F, 'Left Arrow', '화살표1.jpg', LEFT)
roomC_F.arrowR = new Arrow(roomC_F, 'Right Arrow', '화살표3.jpg', RIGHT)
roomC_F.arrowL.onClick = function(){Game.move(roomC_L)}
roomC_F.arrowR.onClick = function(){Game.move(roomC_R)}

//중앙방(Center) 좌측(Left) = C_L
roomC_L.arrowL = new Arrow(roomC_L, 'Left Arrow', '화살표1.jpg', LEFT)
roomC_L.arrowR = new Arrow(roomC_L, 'Right Arrow', '화살표3.jpg', RIGHT)
roomC_L.arrowL.onClick = function(){Game.move(roomC_B)}
roomC_L.arrowR.onClick = function(){Game.move(roomC_F)}

//중앙방(Center) 후측(Back) = C_B
roomC_B.arrowL = new Arrow(roomC_B, 'Left Arrow', '화살표1.jpg', LEFT)
roomC_B.arrowR = new Arrow(roomC_B, 'Right Arrow', '화살표3.jpg', RIGHT)
roomC_B.arrowL.onClick = function(){Game.move(roomC_R)}
roomC_B.arrowR.onClick = function(){Game.move(roomC_L)}

//중앙방(Center) 우측(Right) = C_R
roomC_R.arrowL = new Arrow(roomC_R, 'Left Arrow', '화살표1.jpg', LEFT)
roomC_R.arrowR = new Arrow(roomC_R, 'Right Arrow', '화살표3.jpg', RIGHT)
roomC_R.arrowL.onClick = function(){Game.move(roomC_F)}
roomC_R.arrowR.onClick = function(){Game.move(roomC_B)}
 
//통로와 중앙 방 사이에 위치한 문(==doorC)
roomC_B.doorC = roomC_B.createObject("중앙 문", null)
roomC_B.doorC.onClick = function(){
    game.move(aisle)
}

//탈출 문
roomC_F.finalDoor = roomC_F.createObject("탈출 문", null)
roomC_F.finalDoor.lock()

roomC_F.finalDoor.onClick = function() {
	if(roomC_F.finalDoor.isClosed()){ 
		roomC_F.finalDoor.open()
	} else if (roomC_F.finalDoor.isOpened()){ 
		game.clear()
	} else if(roomC_F.finalDoor.isLocked()){
		printMessage("문이 잠겨있다.")
	}
}

game.start(mainRoom) 
printMessage("괴짜 과학자에게 잡혔다....    빨리 이곳을 벗어나야 겠어!!!") 