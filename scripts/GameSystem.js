/**
* GameSystem class
*/
function GameSystem(){
	//	elements container
	var gameElements = [];
	
	/**
	* public
	*/
	//  add new element
	this.add = function(gameElement){
		if(gameElement){
			gameElements.push(gameElement);
		}
	}
	//  remove the element from the container
	this.remove = function(index){
		if (gameElements.length > 1){
            gameElements[index] = gameElements[gameElements.length - 1];
        	gameElements.pop();	
		}
	}
	//  apply changes
	this.applyChanges = function(position){
		changeStarStatus(position);	
		changeButton(position);
		changeTimeBox();
		changeScoreBox();
		
		//应用已更改的其它元素
		
	}
	//  render all of the elements
	this.render = function(ctx){
		for(var e in gameElements){
			var element = gameElements[e];
			element.draw();	
		}
		
		//其它待定要画的元素
		//尾巴什么的
		
	}
	//  start the timer
	this.startTimer = function(){
	
		//开始计时
		
	}
	
	
	/**
	* private
	*/
	//  change the status of the star
	function changeStarStatus(position){
		
		//判断边界，更换星星状态和图片
		
	}
	//  change the picture of the buttons
	function changeButton(position){
		
		//判断位置，触发按钮点击事件并更改按钮图片
			
	}
	//  change the time box
	function changeTimeBox(){
		
		//增长进度条并更改计时数字
			
	}
	//  change the score box
	function changeScoreBox(){
		
		//更改分数框的内容
	
	}
}