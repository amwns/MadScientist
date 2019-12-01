/*
 * 프로젝트명 : 방탈출게임
 * 팀 : Mad Scientist(5조)
 * 구성원 : 김기문, 김민준, 김유빈, 한명지 
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
/*
//-------------------------------------Arrow-----------------------------------------
//LEFT = 1, UPPER = 2, RIGHT = 3, BOTTOM = 4

function Arrow(room, name, image, direction){
	Object.call(this, room, name, image)

	// Arrow properties
	this.direction = direction //1: 왼쪽, 2: 위쪽, 3: 오른쪽 4: 아래쪽
    this.resize(40)
    switch (direction){
        case 1:
            this.locate(40,350);
            break;
        case 2:
            this.locate(1230,350);
            break;
        case 3:
            this.locate(600,40);
            break;
        case 4:
            this.locate(600,680);
            break;
    }
}
Arrow.prototype = new Object()   // inherited from Object
//arrow의 onClick - 클릭하면
Arrow.member('onClick', function(){})
*/

//----------------------------------Drain1--------------------------------
//이미지 4개가 필요한 배수관
function Drain1(room, name, image1, image2, image3, image4, answer){
	Object.call(this, room, name, image1)

	// Drain1 properties
	this.image1 = image1
	this.image2 = image2
	this.image3 = image3
	this.image4 = image4
	this.count = 0
	this.answer = answer
	this.clear = 0  //정답 맞추면 1, 못 맞추면 0
}
Drain1.prototype = new Object()   // inherited from Object

Drain1.member('onClick', function(){
	//클릭 횟수 카운트
	if(this.count <= 3){
		this.count += 1
	}
	else if(this.count == 4){
		this.count = 0   //리셋
	}
	//클릭 횟수마다 이미지 변화
	if(this.count == 0){
		this.setSprite(this.image1)
	}
	else if(this.count == 1){
		this.setSprite(this.image2)
	}
	else if(this.count == 2){
		this.setSprite(this.image3)
	}
	else if(this.count == 3){
		this.setSprite(this.image4)
	}

	//특정 클릭 수 -> 한 개 성공
	if(this.answer != undefined){
		if(this.count == this.answer){
			this.clear = 1
		} 
		else if(this.count != this.answer) {
			this.clear = 0
		}                                             
	}
})

//게임 리셋 함수
Drain1.member('Reset', function(){
	this.setSprite(this.image1) //이미지 원상복귀
	this.count = 0
	this.clear = 0
})


//-------------------------------Drain2------------------------------
//이미지 2개가 필요한 배수관(직선 배수관)
function Drain2(room, name, image1, image2, answer){
	Object.call(this, room, name, image1)

	// Drain2 properties
	this.image1 = image1
	this.image2 = image2
	this.count = 0
	this.answer = answer
	this.clear = 0  //정답 맞추면 1, 못 맞추면 0
}
Drain2.prototype = new Object()   // inherited from Object

Drain2.member('onClick', function(){
	//클릭 횟수 카운트
	if(this.count == 1){
		this.count = 0
	}
	else if(this.count == 0){
		this.count++
	}
	//클릭 횟수마다 이미지 변화
	if(this.count == 0){
		this.setSprite(this.image1)
	}
	else if(this.count == 1){
		this.setSprite(this.image2)
	}

	//특정 클릭 수 -> 한 개 성공
	if(this.answer != undefined){
		if(this.count == this.answer){
			this.clear = 1
		} 
		else if(this.count != this.answer) {
			this.clear = 0
		}                                             
	}
})

//게임 리셋 함수
Drain2.member('Reset', function(){
	this.setSprite(this.image1) //이미지 원상복귀
	this.count = 0
	this.clear = 0
})














/////////////////////////////방 생성/////////////////////////////

mainRoom = new Room('mainRoom', '배경-1.png') 
aisle = new Room('aisle', '복도.png')          
roomR = new Room('roomR', '물리방-1.png')

/////////////////////////////////시작하는 방(mainRoom)/////////////////////////////////
mainRoom.hammer = new Item(mainRoom, 'hammer', 'hammer.jpg')   //해머 객체 생성
mainRoom.hammer.resize(50)
mainRoom.hammer.locate(250,250)

mainRoom.hole = new Object(mainRoom, 'hole', '구멍.png') //복도로 가기 위한 구멍 생성
mainRoom.hole.resize(100)
mainRoom.hole.locate(700,500)
mainRoom.hole.open()    //***실험을 위해 열려진 상태로


mainRoom.hole.onClick = function(){ 
    if(mainRoom.hole.isLocked()){
        if(Game.handItem() == mainRoom.hammer){  //해머가 손에 있다면!
            printMessage("벽을 부순다.")
			//소리작업
            mainRoom.hole.setSprite(null)   //부순 후 이미지
            mainRoom.hole.unlock()
            mainRoom.hole.open()
        }
        else{
            printMessage("균열 사이로 공간이 보인다.")
        }
    }else if(mainRoom.hole.isOpened()){
        Game.move(aisle)
    }
}

 



/////////////////////////////////////////통로///////////////////////////////////////////////
//aisle.doorL = new Door(aisle, '좌측 문', '문-닫힘-1.png', '문-열림-1.png', roomL)   
//aisle.doorC = new Door(aisle, '중앙 문', '문-닫힘-1.png', '문-열림-1.png', roomC)   
aisle.doorR = new Door(aisle, 'doorR', '문-닫힘-1.png', '문-열림-1.png', roomR)
aisle.doorR.resize(300)
aisle.doorR.locate(900,400)

 


/*
////////////////////////////Left Room(화학실험실)//////////////////////////////
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
 

*/




////////////////////////////Right Room(물리실험실)//////////////////////////////
//배수관 클로즈업 방, 전구 클로즈
drain_close = new Room('drain_close', '물리방-2.png')
light_bulb_close = new Room('light_bulb_close','전구방-1.png')
nolight_bulb_close = new Room('nolight_bulb_close','전구방-2.png')

//복도로 나가는 화살표
roomR.arrow = new Door(roomR, 'arrow', '화살표-1.png', '화살표-1.png',aisle)
roomR.arrow.resize(200)
roomR.arrow.locate(1150,600)

//배수관 첫화면
roomR.first_drain = new Object(roomR, 'first_drain', '배수관-첫화면.png')
roomR.first_drain.resize(300)
roomR.first_drain.locate(300, 200)

roomR.first_drain.onClick = function(){
	Game.move(drain_close)
}

//배수관 문제 풀기 
drain_close.drain1 = new Drain2(drain_close, 'drain1', '배수관-1-2.png', '배수관-1-1.png', 1)
drain_close.drain2 = new Drain1(drain_close, 'drain2', '배수관-2-1.png','배수관-2-2.png','배수관-2-3.png','배수관-2-4.png', 1)
drain_close.drain3 = new Drain1(drain_close, 'drain3', '배수관-2-2.png','배수관-2-4.png','배수관-2-3.png','배수관-2-1.png', 2)
drain_close.drain4 = new Drain1(drain_close, 'drain4', '배수관-2-3.png','배수관-2-1.png','배수관-2-2.png','배수관-2-4.png', 1)
drain_close.drain5 = new Drain1(drain_close, 'drain5', '배수관-2-1.png','배수관-2-2.png','배수관-2-3.png','배수관-2-4.png', 3)
drain_close.drain6 = new Drain2(drain_close, 'drain6', '배수관-1-2.png', '배수관-1-1.png', 1)
drain_close.drain7 = new Drain1(drain_close, 'drain7', '배수관-4-1.png','배수관-4-2.png','배수관-4-3.png','배수관-4-4.png')
drain_close.drain8 = new Drain1(drain_close, 'drain8', '배수관-4-3.png','배수관-4-2.png','배수관-4-1.png','배수관-4-4.png')
drain_close.drain9 = new Drain1(drain_close, 'drain9', '배수관-2-4.png','배수관-2-2.png','배수관-2-3.png','배수관-2-1.png', 3)

drain_close.drain1.resize(100)
drain_close.drain2.resize(100)
drain_close.drain3.resize(100)
drain_close.drain4.resize(100)
drain_close.drain5.resize(100)
drain_close.drain6.resize(100)
drain_close.drain7.resize(100)
drain_close.drain8.resize(100)
drain_close.drain9.resize(100)

drain_close.drain1.locate(500,100)
drain_close.drain2.locate(600,100)
drain_close.drain3.locate(700,100)
drain_close.drain4.locate(500,200)
drain_close.drain5.locate(600,200)
drain_close.drain6.locate(700,200)
drain_close.drain7.locate(500,300)
drain_close.drain8.locate(600,300)
drain_close.drain9.locate(700,300)

drain_close.box = new Object(drain_close, 'box', '투명상자.png')
drain_close.box.resize(200)
drain_close.box.locate(900,480)

drain_close.pipe = new Object(drain_close, 'pipe', '파이프-1.png')
drain_close.pipe.resize(200)
drain_close.pipe.locate(845,335)
//*****수돗꼭지 돌리면 물 나오게 하기*****/
drain_close.pipe.onClick = function(){
	if(drain_close.drain1.clear == 1 && drain_close.drain2.clear == 1 && drain_close.drain3.clear == 1 && drain_close.drain4.clear == 1 && drain_close.drain5.clear == 1 && drain_close.drain6.clear == 1 && drain_close.drain9.clear == 1){
		//***물 흘러가는 소리 */
		drain_close.box.setSprite('물상자.png')
		drain_close.lever.show()
	}
	else{
		printMessage("손이 닿질 않아서 꺼낼 수가 없다!!!")
	}
}

drain_close.lever = new Item(drain_close, 'lever', '레버.png')
drain_close.lever.resize(100)
drain_close.lever.locate(900, 420)
drain_close.lever.hide()

//화살표 -> 다시 물리실험실로
drain_close.arrow = new Object(drain_close, 'arrow', '화살표-2.png')
drain_close.arrow.resize(200)
drain_close.arrow.locate(600, 650)

drain_close.arrow.onClick = function(){
	//배수관 게임 리셋
	drain_close.drain1.Reset()
	drain_close.drain2.Reset()
	drain_close.drain3.Reset()
	drain_close.drain4.Reset()
	drain_close.drain5.Reset()
	drain_close.drain6.Reset()
	drain_close.drain7.Reset()
	drain_close.drain8.Reset()
	drain_close.drain9.Reset()

	Game.move(roomR)
}

//전구기계  ***** for문으로 이미지 변화
roomR.bulb_mach = new Object(roomR, 'bulb_mach', '전구기계-1.png')
roomR.bulb_mach.resize(200)
roomR.bulb_mach.locate(1000, 400)
roomR.bulb_mach.onClick = function(){
	if(drain_close.lever.isHanded()){
		//**덜컥 소리내기 */
		roomR.bulb_mach.setSprite('전구기계-2.png')
		Game.move(light_bulb_close)
	}
	else{
		printMessage("레버가 없어서 작동이 되지 않는것 같다...")
		Game.move(nolight_bulb_close)
	}
}

light_bulb_close.arrow = new Object(light_bulb_close, 'arrow', '화살표-2.png')
light_bulb_close.arrow.resize(200)
light_bulb_close.arrow.locate(600, 650)
light_bulb_close.arrow.onClick = function(){
	Game.move(roomR)
}

nolight_bulb_close.arrow = new Object(nolight_bulb_close, 'arrow', '화살표-2.png')
nolight_bulb_close.arrow.resize(200)
nolight_bulb_close.arrow.locate(600, 650)
nolight_bulb_close.arrow.onClick = function(){
	Game.move(roomR)
}



//사물함



/*
////////////////////////////Center Room(비밀의 방)//////////////////////////////
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
*/



Game.start(mainRoom, "괴짜 과학자에게 잡혔다....    빨리 이곳을 벗어나야 겠어!!!") 