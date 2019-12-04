/*
 * 프로젝트명 : 방탈출게임
 * 팀 : Mad Scientist(5조)
 * 구성원 : 김기문, 김민준, 김유빈, 한명지 
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

//door와 sound 재생 생성
function Door1(room, name, closedImage, openedImage, connectedTo,sound){
	Object.call(this, room, name, closedImage)  

	// Door properties
	this.sound=sound
	this.closedImage = closedImage
	this.openedImage = openedImage
	this.connectedTo = connectedTo
}

Door1.prototype = new Object()   // inherited from Object (Door << Object)


//door의 onClick - 클릭 누르면
Door1.member('onClick', function(){
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
Door1.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
})

//onClose - 닫으면
Door1.member('onClose', function(){
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

//--------------------------------------getItem--------------------------------------------
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



//-----------------------------Bulb----------------------------
function Bulb(room, name, image0, image1, image2, image3, image4, num){
	Object.call(this, room, name, image0)

	// Bulb properties
	this.image0 = image0
	this.image1 = image1
	this.image2 = image2
	this.image3 = image3
	this.image4 = image4

	this.num = num  //이미지 배열의 크기
	this.count = 0  //클릭 횟수 카운트
}
Bulb.prototype = new Object()   // inherited from Object

//레버 누를때마다 전구 이미지가 변화하는 함수 (**sleep함수는 렉이 걸림**)
Bulb.member('Change', function(){
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

	if(this.count < this.num){
		this.count++
	}
	else if(this.count >= this.num){
		this.count = 0   //리셋
	}
})
//리셋 함수
Bulb.member('Reset', function(){
	this.count = 0
	this.setSprite(this.image0)
})


//------------------------------Safe---------------------------
function Safe(room, name, image0, image1, image2, image3, answer_array){
	Object.call(this, room, name, image0)

	// Safe properties
	this.image0 = image0
	this.image1 = image1
	this.image2 = image2
	this.image3 = image3

	this.current = 0     //다이얼 현재 방향 (0,1,2,3)

	this.safe_array = new Array()  //사용자의 클릭 배열
	this.answer_array = answer_array   //정답 배열
}
Safe.prototype = new Object()   // inherited from Object

//화살표에 클릭에 따라 이미지 변화 + 사용자 클릭 배열에 저장 함수
Safe.member('Change', function(arrow){  //매개변수는 화살표 방향 (-1 == 왼쪽, 1 == 오른쪽)
	if(arrow == 1){ //arrow = right
		//배열에 추가
		this.safe_array.push(1)

		//image change
		if(this.current == 0){
			this.setSprite(this.image1)
			this.current = 1
		}
		else if(this.current == 1){
			this.setSprite(this.image2)
			this.current = 2
		}
		else if(this.current == 2){
			this.setSprite(this.image3)
			this.current = 3
		}
		else if(this.current == 3){
			this.setSprite(this.image0)
			this.current = 0
		}
	}
	else if(arrow == -1){ //arrow == left
		//배열에 추가
		this.safe_array.push(-1)
		
		//image change
		if(this.current == 0){
			this.setSprite(this.image3)
			this.current = 3
		}
		else if(this.current == 1){
			this.setSprite(this.image0)
			this.current = 0
		}
		else if(this.current == 2){
			this.setSprite(this.image1)
			this.current = 1
		}
		else if(this.current == 3){
			this.setSprite(this.image2)
			this.current = 2
		}
	}
})

//---정답 배열과 사용자 배열 비교 함수-----  
Safe.member('Compare', function(array1, array2){
	var i, isA1, isA2
	isA1 = Array.isArray(array1)
	isA2 = Array.isArray(array2)  //배열인지 확인

	if(isA1 !== isA2) {    // 매개변수 하나가 배열이 아닌 경우
		return false    
	}
	if (! (isA1 && isA2)) {      // 둘 다 배열이 아닌 경우
		return array1 === array2
	}

	if (array1.length != array2.length) { // 배열 길이가 다르면
		return false;
	}

	//각 요소 비교
	for(i = 0; i < array1.length; i ++){
		if(array1[i] != array2[i]){
			return false
		}
	}

	return true
})

//리셋 함수
Safe.member('Reset', function(){
	this.current = 0
	this.safe_array = []    //사용자 배열 초기화

	this.setSprite(this.image0)
})





















/////////////////////////////방 생성/////////////////////////////
mainRoom = new Room('mainRoom', 'mainRoom.png') 
aisle = new Room('aisle', 'aisle.png')   
physics = new Room('physics', '물리방-1.png')
chemistry = new Room('chemistry', 'chemical.png')
chemistry_tray = new Room('chemistry_tray','chemistry_tray.png')
chemistry_uv=new Room('chemistry_uv','chemistry_uv.png')
topsecret = new Room('topsecret','topSecret.png')

/////////////////////////////////시작하는 방(mainRoom)/////////////////////////////////
mainRoom.hammer = new Item(mainRoom, 'hammer', 'hammer.png')   //해머 객체 생성
mainRoom.hammer.hide()

mainRoom.hole = new Object(mainRoom, 'hole', 'crack.png') //복도로 가기 위한 구멍 생성
mainRoom.hole.resize(150)
mainRoom.hole.locate(450,280)
mainRoom.hole.lock()    //***실험을 위해 열려진 상태로

mainRoom.broom = new getItem(mainRoom, 'broom', 'broom.png', 'stone.wav')
mainRoom.broom.resize(150)
mainRoom.broom.locate(280,280)

mainRoom.stick = new Item(mainRoom, 'stick', 'stick.png')
mainRoom.stick.hide()

mainRoom.brush = new Item(mainRoom, 'brush', 'brush.png')
mainRoom.brush.hide()

game.makeCombination(mainRoom.stick.id, mainRoom.brush.id, mainRoom.broom.id)

cabinetSide = new Room('cabinetSide','cabinet_back.png')
mainRoom.cabinet = new Object(mainRoom, 'cabinet', 'cabinet.png')
mainRoom.cabinet.resize(250)
mainRoom.cabinet.locate(140,330)
mainRoom.cabinet.onClick = function(){Game.move(cabinetSide)}

cabinetSide.cabinet2 = new Object(cabinetSide, 'cabinet2', 'cabinet_closed.png')
cabinetSide.cabinet2.locate(620,360)
cabinetSide.cabinet2.resize(1280)
cabinetSide.cabinet2.lock()
cabinetSide.cabinet2.onClick = function(){
   if(cabinetSide.cabinet2.isLocked()){
	   playSound('locked.wav')
      showKeypad("number", "2049" , function(){
		 cabinetSide.cabinet2.unlock()
		 playSound('safe.wav')
         printMessage("열리는 소리가 들렸다.")
       })
   }
   else{
      cabinetSide.numlock.hide()
      cabinetSide.cabinet2.setSprite('cabinet_opened.png')
      cabinetSide.hammerHead.show()
   }
}

cabinetSide.hammerHead = new getItem(cabinetSide, 'hammerHead', 'hammerHead.png', 'stone.wav')
cabinetSide.hammerHead.resize(100)
cabinetSide.hammerHead.locate(626, 500)
cabinetSide.hammerHead.hide()
game.makeCombination(mainRoom.stick.id, cabinetSide.hammerHead.id, mainRoom.hammer.id)

cabinetSide.numlock = new Object(cabinetSide, "numlock", "numlock.png") // 오브젝트 생성
cabinetSide.numlock.resize(60) // 크기 조절
cabinetSide.numlock.locate(626, 390) // 위치 변경

cabinetSide.arrow = new Object(cabinetSide, "arrow","화살표-2.png")
cabinetSide.arrow.resize(200)
cabinetSide.arrow.locate(640,680)
cabinetSide.arrow.onClick = function(){
   cabinetSide.hammerHead.hide()
   Game.move(mainRoom)
   cabinetSide.cabinet2.setSprite('cabinet_closed.png')
   cabinetSide.numlock.show()
}

desk = new Room('desk', 'desk.png')
mainRoom.table = new Object(mainRoom, 'table', 'table.png')
mainRoom.table.resize(400)
mainRoom.table.locate(1100,450)
mainRoom.table.onClick = function(){Game.move(desk)}

desk.table = new Object(desk, 'table', 'desk_table.png')
desk.table.locate(620,360)
desk.table.resize(1280)

desk.liquid = new getItem(desk, 'liquid', 'liquid.png', 'glass.wav')
desk.liquid.locate(700, 280)
desk.liquid.resize(150)

desk.openTable = new Object(desk, 'openTable', 'none.png')
desk.openTable.close()
desk.openTable.resize(100)
desk.openTable.locate(330,480)

desk.book = new Object(desk, 'book', 'book.png')
desk.book.locate(300,510)
desk.book.resize(100)
desk.book.hide()
desk.book.onClick = function(){
	playSound('paper.wav')
   showImageViewer("letter.png", ""); // 이미지 출력
}

desk.openTable.onClick = function(){
   if (desk.openTable.isClosed()) {
      desk.openTable.open()
      desk.book.show()
      desk.table.setSprite('desk_table_opened.png') }
   else{
      desk.book.hide()
      desk.openTable.close()
      desk.table.setSprite('desk_table.png') }
}

desk.arrow = new Object(desk, "arrow","화살표-2.png")
desk.arrow.resize(200)
desk.arrow.locate(640,680)
desk.arrow.onClick = function(){Game.move(mainRoom)}

mainRoom.painted = new Object(mainRoom, 'painted', 'painted.png')
mainRoom.painted.resize(300)
mainRoom.painted.locate(700,200)
mainRoom.painted.lock()
mainRoom.painted.onClick = function(){ 
    if(game.getHandItem() == desk.liquid.id){
	playSound('water.wav')
      mainRoom.painted.setSprite('number.png')
      mainRoom.painted.locate(660,180)
    }
    else{
        printMessage("일부러 덧칠해놓은 것 같다.")
    }
}

mainRoom.hole.onClick = function(){ 
    if(mainRoom.hole.isLocked()){
        if(game.getHandItem() == mainRoom.hammer.id){  //해머가 손에 있다면!
         printMessage("벽을 부순다.")
         
         playSound('break.wav')
            //mainRoom.hole.setSprite(null)   //부순 후 이미지
            mainRoom.hole.unlock()
         mainRoom.hole.open()
         mainRoom.hole.setSprite('hole.png')
         mainRoom.hole.resize(300)
         mainRoom.hole.locate(450,280)
        }
        else{
            printMessage("균열 사이로 공간이 보인다.")
        }
    }else if(mainRoom.hole.isOpened()){
        Game.move(aisle)
    }
}

/////////////////////////////////////////통로///////////////////////////////////////////////

aisle.rightdoor = new Door1(aisle, 'rightdoor', 'rightdoor.png', 'rightdooropen.png', physics,'door.wav')
aisle.rightdoor.resize(220)
aisle.rightdoor.locate(1050, 335)

aisle.middledoor = new Door1(aisle, 'middledoor', 'middledoor.png', 'middledooropen.png', topsecret,'door.wav')
aisle.middledoor.resize(440)
aisle.middledoor.locate(650, 335)
aisle.middledoor.lock()

aisle.leftdoor = new Door1(aisle, 'leftdoor', 'leftdoor.png', 'leftdooropen.png',chemistry,'door.wav')
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






/////////////////////////////////////////chemistry///////////////////////////////////////////

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

chemistry.key2= new Item(chemistry, 'key2', 'key2.png')
chemistry.key2.hide()

chemistry.getpaper= new Item(chemistry, 'getpaper', 'getpaper.png')
chemistry.getpaper.hide()

chemistry.paper = new getItem(chemistry,'paper','paper.png','paper.wav')
chemistry.paper.resize(130)
chemistry.paper.locate(350,440)

chemistry.paper.onClick=function(){
	printMessage('화학물질이 잔뜩 묻어진 종이 하나를 얻었다.')
    playSound('paper.wav')
    chemistry.paper.hide()
    chemistry.getpaper.pick()
}

chemistry.uv = new Object(chemistry, 'uv', 'uv.png')
chemistry.uv.resize(130)
chemistry.uv.locate(1030,350)



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

chemistry.rollingpaper = new Object(chemistry, 'rollingpaper', 'rollingpaper.png')
chemistry.rollingpaper.resize(35)
chemistry.rollingpaper.locate(1085,524)
chemistry.rollingpaper.hide()

chemistry.rollingpaper.onClick=function(){
	printMessage('연구일지를 주웠다.')
	showImageViewer('getrollingpaper.png',"")
	playSound("paper.wav")
}

chemistry.keycast = new Item(chemistry, 'keycast', 'keycast.png')
chemistry.keycast.resize(35)
chemistry.keycast.locate(1088,505)
chemistry.keycast.hide()

chemistry.getkeycast = new Item(chemistry, 'getkeycast', 'getkeycast.png')
chemistry.getkeycast.hide()

chemistry.keycast.onClick=function(){
	printMessage('열쇠 주물을 얻었다.')
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
			printMessage("금고가 열렸다.")
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
game.makeCombination(chemistry.key2.id,chemistry.getkeycast.id,chemistry.keycast2.id)

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
		printMessage('화학물질이 씻겨 번호가 나타났다.')
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


chemistry.uv.onClick=function(){
	Game.move(chemistry_uv)
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
chemistry_uv.switch.lock()

chemistry_uv.key= new getItem(chemistry_uv,'key','key.png','key.wav')
chemistry_uv.key.resize(100)
chemistry_uv.key.locate(600,400)
chemistry_uv.uv.close()
chemistry_uv.key.hide()

chemistry_uv.key2= new Object(chemistry_uv,'key2','key2.png')
chemistry_uv.key2.resize(100)
chemistry_uv.key2.locate(600,400)
chemistry_uv.key2.hide()
chemistry_uv.key2.lock()

chemistry_uv.uv.onClick=function(){
	if(chemistry.key2.isHanded()&&chemistry_uv.uv.isClosed()&&chemistry_uv.key2.isLocked()){
		chemistry_uv.uv.open()
		chemistry_uv.key2.show()
	}
}

chemistry_uv.switch.onClick=function(){
	if(chemistry_uv.switch.isLocked()&&chemistry_uv.uv.isClosed()){
		playSound("switch.wav")
		chemistry_uv.switch.open()
		chemistry_uv.uv.open()

	}else if(chemistry_uv.switch.isOpened()&&chemistry_uv.uv.isOpened()){
		playSound("switch.wav")
		chemistry_uv.switch.lock()
		chemistry_uv.uv.close()
		
	}else if(chemistry_uv.switch.isLocked()&&chemistry_uv.uv.isOpened()&&chemistry_uv.key2.isLocked()){
		playSound("switch.wav")
		chemistry_uv.switch.open()
		chemistry_uv.uv.close()
		chemistry_uv.key2.hide()
	}else if(chemistry_uv.switch.isOpened()&&chemistry_uv.uv.isClosed()){
		printMessage('혼합액을 이용한 열쇠가 단단히 굳었다.')
		playSound("switch.wav")
		chemistry_uv.switch.lock()
		chemistry_uv.key.show()
		chemistry_uv.key2.open()
	}
}

chemistry_uv.switch.onOpen=function(){
	chemistry_uv.uv.setSprite("uvclose.png")
	chemistry_uv.switch.setSprite("switchon.png")
}

chemistry_uv.switch.onLock=function(){
	chemistry_uv.uv.setSprite("uvopen.png")
	chemistry_uv.switch.setSprite("switchoff.png")
}



////////////////////////////////////Physics///////////////////////////////////

//배수관 클로즈업 방, 전구 클로즈업 방, 금고 클로즈업 방
drain_close = new Room('drain_close', '물리방-2.png')
light_bulb_close = new Room('light_bulb_close','전구방-1.png')
nolight_bulb_close = new Room('nolight_bulb_close','전구방-2.png')
safe_close = new Room('safe_close', '금고방.png')

//복도로 나가는 화살표
physics.arrow = new Door(physics, 'arrow', '화살표-1.png', '화살표-1.png',aisle)
physics.arrow.resize(150)
physics.arrow.locate(1000,670)

//배수관 첫화면
physics.first_drain = new Object(physics, 'first_drain', '배수관-첫화면.png')
physics.first_drain.resize(250)
physics.first_drain.locate(250, 260)

physics.first_drain.onClick = function(){
	Game.move(drain_close)
}

//배수관 문제 풀기 
drain_close.drain1 = new Drain2(drain_close, 'drain1', '배수관-1-2.png', '배수관-1-1.png', 1)
drain_close.drain2 = new Drain1(drain_close, 'drain2', '배수관-2-1.png','배수관-2-2.png','배수관-2-3.png','배수관-2-4.png', 1)
drain_close.drain3 = new Drain1(drain_close, 'drain3', '배수관-2-2.png','배수관-2-4.png','배수관-2-3.png','배수관-2-1.png', 2)
drain_close.drain4 = new Drain1(drain_close, 'drain4', '배수관-2-3.png','배수관-2-1.png','배수관-2-2.png','배수관-2-4.png', 1)
drain_close.drain5 = new Drain1(drain_close, 'drain5', '배수관-2-1.png','배수관-2-2.png','배수관-2-3.png','배수관-2-4.png', 3)
drain_close.drain6 = new Drain2(drain_close, 'drain6', '배수관-1-2.png', '배수관-1-1.png', 1)
drain_close.drain7 = new Drain2(drain_close, 'drain7', '배수관-1-1.png', '배수관-1-2.png')
drain_close.drain8 = new Drain1(drain_close, 'drain8', '배수관-2-1.png','배수관-2-2.png','배수관-2-4.png','배수관-2-3.png')
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
drain_close.box.locate(900,465)
drain_close.box.onClick = function(){
	if (drain_close.lever.isPicked()){}
	else{
		printMessage("손이 닿질 않아서 꺼낼 수가 없다!!!")
	}
}

drain_close.pipe = new Object(drain_close, 'pipe', '파이프-1.png')
drain_close.pipe.resize(200)
drain_close.pipe.locate(845,335)

drain_close.pipe2 = new Object(drain_close, 'pipe2', '파이프-1.png')
drain_close.pipe2.resize(200)
drain_close.pipe2.locate(430,10)

drain_close.velve = new Object(drain_close, 'velve', '손잡이.png')
drain_close.velve.resize(100)
drain_close.velve.locate(975,320)
drain_close.velve.lock()

drain_close.velve.onClick = function(){
	if(drain_close.velve.isLocked()){
		playSound('bump.wav')
		drain_close.velve.open()

		if(drain_close.drain1.clear == 1 && drain_close.drain2.clear == 1 && drain_close.drain3.clear == 1 && drain_close.drain4.clear == 1 && drain_close.drain5.clear == 1 && drain_close.drain6.clear == 1 && drain_close.drain9.clear == 1){
			playSound('drain.wav')  //물소리
			drain_close.box.setSprite('물상자.png')
			drain_close.lever.show()
		}
		else{
			drain_close.drain1.Reset()
			drain_close.drain2.Reset()
			drain_close.drain3.Reset()
			drain_close.drain4.Reset()
			drain_close.drain5.Reset()
			drain_close.drain6.Reset()
			drain_close.drain7.Reset()
			drain_close.drain8.Reset()
			drain_close.drain9.Reset()
	
		}
	}
	else if(drain_close.velve.isOpened()){
		playSound('locked.wav')
		drain_close.velve.lock()
	}
}

drain_close.velve.onOpen = function(){
	drain_close.velve.setSprite('손잡이-2.png')
}
drain_close.velve.onLock = function(){
	drain_close.velve.setSprite('손잡이.png')
}

drain_close.lever = new getItem(drain_close, 'lever', '레버.png','stone.wav')
drain_close.lever.resize(100)
drain_close.lever.locate(900, 420)
drain_close.lever.hide()

//화살표 -> 다시 물리실험실로
drain_close.arrow = new Object(drain_close, 'arrow', '화살표-2.png')
drain_close.arrow.resize(200)
drain_close.arrow.locate(600, 650)

drain_close.arrow.onClick = function(){
	//배수관 게임 리셋(***뺄지 고민중***)
	drain_close.drain1.Reset()
	drain_close.drain2.Reset()
	drain_close.drain3.Reset()
	drain_close.drain4.Reset()
	drain_close.drain5.Reset()
	drain_close.drain6.Reset()
	drain_close.drain7.Reset()
	drain_close.drain8.Reset()
	drain_close.drain9.Reset()

	Game.move(physics)
}



//전구기계
physics.bulb_mach = new Object(physics, 'bulb_mach', '전구기계-1.png')
physics.bulb_mach.resize(230)
physics.bulb_mach.locate(1000, 425)
physics.bulb_mach.onClick = function(){
	if(drain_close.lever.isHanded()){
		playSound('safe.wav')
		physics.bulb_mach.setSprite('전구기계-2.png')
		Game.move(light_bulb_close)
	}
	else{
		printMessage("레버가 없어서 작동이 되지 않는것 같다...")
		physics.bulb_mach.setSprite('전구기계-1.png')
		Game.move(nolight_bulb_close)
	}
}
//전구 켜질 때의 방
light_bulb_close.bulb = new Bulb(light_bulb_close, 'bulb','전구.png','전구1.png','전구2.png','전구3.png','전구4.png', 4)
light_bulb_close.bulb.resize(300)
light_bulb_close.bulb.locate(700, 200)

light_bulb_close.lever = new Object(light_bulb_close, 'lever', '레버.png')
light_bulb_close.lever.locate(550, 600)
light_bulb_close.lever.resize(300)
light_bulb_close.lever.onClick = function(){
	playSound('beep.wav')
	light_bulb_close.bulb.Change() //전구 이미지 변화
}

light_bulb_close.arrow = new Object(light_bulb_close, 'arrow', '화살표-2.png')
light_bulb_close.arrow.resize(200)
light_bulb_close.arrow.locate(900, 650)
light_bulb_close.arrow.onClick = function(){
	//전구 리셋
	light_bulb_close.bulb.Reset()

	Game.move(physics)
}

//전구 꺼질 때의 방
nolight_bulb_close.arrow = new Object(nolight_bulb_close, 'arrow', '화살표-2.png')
nolight_bulb_close.arrow.resize(200)
nolight_bulb_close.arrow.locate(900, 650)
nolight_bulb_close.arrow.onClick = function(){
	Game.move(physics)
}



//사물함
physics.safe = new Object(physics, 'safe', '금고-닫힘.png')
physics.safe.resize(200)
physics.safe.locate(300, 550)
physics.safe.onClick = function(){
	playSound('locked.wav')
	Game.move(safe_close)
}

//열쇠
physics.key1 = new getItem(physics, 'key1', '열쇠-물리방.png','key.wav')
physics.key1.resize(50)
physics.key1.locate(300,550)
physics.key1.hide()

//사물함 클로즈업 방
safe_close.arrow = new Object(safe_close, 'arrow', '화살표-2.png')
safe_close.arrow.resize(200)
safe_close.arrow.locate(650, 650)
safe_close.arrow.onClick = function(){
	Game.move(physics)
}

//사물함 다이얼
safe_close.dial = new Safe(safe_close, 'dial', '다이얼-1.png', '다이얼-2.png', '다이얼-3.png', '다이얼-4.png', new Array(1,1,1,-1,-1,1,-1,-1,-1))
safe_close.dial.resize(300)
safe_close.dial.locate(650, 350)

//사물함 화살표
safe_close.arrow_right = new Object(safe_close, 'arrow_right', '화살표-오른쪽회전.png')
safe_close.arrow_right.resize(100)
safe_close.arrow_right.locate(900, 350)
safe_close.arrow_right.onClick = function(){
	playSound('dial.wav')
	safe_close.dial.Change(1)
}

safe_close.arrow_left = new Object(safe_close, 'arrow_left', '화살표-왼쪽회전.png')
safe_close.arrow_left.resize(100)
safe_close.arrow_left.locate(400, 350)
safe_close.arrow_left.onClick = function(){
	playSound('dial.wav')
	safe_close.dial.Change(-1)
}

//사물함 정답 누르기
safe_close.dial.onClick = function(){
	if(safe_close.dial.Compare(safe_close.dial.answer_array, safe_close.dial.safe_array)){
		playSound('safe.wav')
		physics.safe.setSprite('금고-열림.png')
		physics.safe.onClick = function(){
			printMessage("이미 열림")
		}
		physics.key1.show()
		Game.move(physics)
	}
	else{
		printMessage("땡~~~")
	}
	safe_close.dial.Reset()
}


//aisle key
aisle.chainright.onClick = function(){
	if(chemistry_uv.key.isHanded()){
		aisle.chainright.hide()
		aisle.chain1.show()
		playSound("chain.wav")
	}
	else if(physics.key1.isHanded()){
		playSound("chain2.wav")
		printMessage("이 열쇠는 안맞는거 같다. 화확실험실에서 얻은 열쇠를 사용해보자")
	}
	else if(chemistry.key2.isHanded()){
		playSound("chain2.wav")
		printMessage("이 열쇠는 너무 무뎌 사용할 수가 없다. 열쇠에 다른조치를 취해보자")

	}
	else{
		playSound("chain2.wav")
		printMessage("문이 잠겨있다.")
	}
}

aisle.chainleft.onClick = function(){
	if(physics.key1.isHanded()){
		aisle.chainleft.hide()
		aisle.chain2.show()
		playSound("chain.wav")
		aisle.middledoor.unlock()
	}
	else if(chemistry_uv.key.isHanded()){
		playSound("chain2.wav")
		printMessage("이 열쇠는 안 맞는거 같다. 물리실험실에서 얻은 열쇠를 사용해보자")
	}
	else if(chemistry.key2.isHanded()){
		playSound("chain2.wav")
		printMessage("이 열쇠는 너무 무뎌 사용할 수가 없다. 열쇠에 다른조치를 취해보자")

	}
	else{
		playSound("chain2.wav")
		printMessage("문이 잠겨있다.")
	}
}



/////////////////////////////topsecret////////////////////////////////

//감옥 확대
cage = new Room('cage', 'cage.png')

cage.hint = new Object(cage, 'hint', 'hint.png')
cage.hint.resize(500)
cage.hint.locate(750,200)
cage.hint.onClick = function(){
	showImageViewer("hint.png","")
}

cage.arrow=new Object(cage,'arrow','화살표.png')
cage.arrow.resize(50)
cage.arrow.locate(500,680)

cage.arrow.onClick=function(){
	Game.move(topsecret)
}
//몬스터
topsecret.monster = new Object(topsecret, 'monster', 'monster.png')
topsecret.monster.resize(200)
topsecret.monster.locate(850,390)
topsecret.monster.lock()

//감옥
topsecret.cage = new Door(topsecret, 'cage', 'cageclose.png','cageopen.png',cage)
topsecret.cage.resize(600)
topsecret.cage.locate(965,335)
topsecret.cage.lock()

topsecret.blood = new Object(topsecret,'blood','blood.png')
topsecret.blood.locate(300,600)
topsecret.blood.resize(200)
topsecret.blood.lock()

topsecret.blood.onClick=function(){
	if (topsecret.blood.isLocked()){
		printMessage('피속에서 열쇠 하나를 얻엇다.')
		topsecret.blood.open()
		topsecret.cagekey.pick()
		playSound('key.wav')
	}
}

topsecret.cagekey = new getItem(topsecret, 'cagekey', 'cagekey.png','key.wav')
topsecret.cagekey.hide()

topsecret.cage.onClick = function(){
    if(topsecret.tranquilizer.isHanded()&&topsecret.monster.isLocked()&&topsecret.cage.isLocked()){
		playSound('monster_dead_sound.wav')
		topsecret.monster.setSprite('dead_monster.png')
		topsecret.cage.setSprite('cageclose2.png')
		topsecret.monster.open()
		printMessage('몬스터를 해치웠다!')
	}else if(topsecret.tranquilizer.isHanded()&&topsecret.monster.isOpened()&&topsecret.cage.isLocked()){
		printMessage('이제 문을 열수 있을거 같아')
	}
	else if(topsecret.cagekey.isHanded()&&topsecret.monster.isOpened()&&topsecret.cage.isLocked()){
		topsecret.cage.open()
		playSound('prison_open.wav')
	}
	else if(topsecret.monster.isOpened()&&topsecret.cage.isOpened()){
		Game.move(cage)
	}
    else{
		printMessage('뒤에 무언가 적혀있는거 같은데 몬스터 때문에 다가가지를 못하겟다... 마취파이프를 이용해 몬스터를 해치워야겟다')
        playSound('monsteractive.wav')
    }
}

//아이템
topsecret.injection = new Item(topsecret, 'injection', 'injection.png')       //마취 주사
topsecret.injection.hide()

topsecret.tranquilizer = new Item(topsecret, 'tranquilizer', 'tranquilizer.png')  //마취 주사총
topsecret.tranquilizer.hide()

topsecret.pipe1 = new getItem(topsecret, 'pipe1', 'pipe.png','stone.wav')
topsecret.pipe1.locate(1230,600)
topsecret.pipe1.resize(80)

//서랍
topsecret.drawer = new Object(topsecret, 'drawer', 'drawer.png')
topsecret.drawer.resize(250)
topsecret.drawer.locate(180, 380)

topsecret.niddle = new getItem(topsecret, 'niddle', 'niddle.png','pick.wav')  //빈주사기
topsecret.niddle.locate(128,445)
topsecret.niddle.resize(45)
topsecret.niddle.hide()

topsecret.drug = new getItem(topsecret, 'drug', 'drug.png','pick.wav')   //마취약
topsecret.drug.locate(145,440)
topsecret.drug.resize(18)
topsecret.drug.hide()


topsecret.drawer.onClick = function(){
	playSound('drawer.wav')
	topsecret.drawer.setSprite('draweropen.png')
	topsecret.niddle.show()
	topsecret.drug.show()
}

//문
topsecret.door = new Object(topsecret, 'door', 'lastdoor.png')
topsecret.door.resize(380)
topsecret.door.locate(500, 280)
topsecret.door.lock()

topsecret.door.onClick=function(){
	if(topsecret.door.isLocked()){
		playSound('beep.wav')
		printMessage("비밀번호를 입력하세요.")
		showKeypad("telephone", "324756" , function(){
			topsecret.door.setSprite('lastdooropen.png')
			topsecret.door.open()
			playSound('prison_open.wav')
			Game.move(topsecret)
			printMessage('문이 열렸다!!!!!!!!!')
		 })
	}
	else if(topsecret.door.isOpened()){
		Game.end()
	}
}


game.makeCombination(topsecret.niddle.id, topsecret.drug.id, topsecret.injection.id)  //빈주사기 + 마취약 = 마취 주사
game.makeCombination(topsecret.pipe1.id, topsecret.injection.id, topsecret.tranquilizer.id)  //파이프 + 마취 주사 = 마취 주사 총


Game.start(mainRoom, "미친과학자한테 잡혔다.. 빨리 여기를 탈출해야해")