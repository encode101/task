// JavaScript Document
jQuery(function(){
	$(document).on('tap', function(e) {
        $('.ui-btn').removeClass($.mobile.activeBtnClass);
	});
	
	/* Add Task */
	$("#save").on({
		click:function(event){
			var data = new Object();			
			data.id=localStorage.length+1;
			data.task=$("#task").val();	
			data.startTime= 0;//moment();
			data.hrs=0;
			subject.totalHrs=0;
			data.status="inactive"	;
			
			var fdata = JSON.stringify(data);
			localStorage.setItem(localStorage.length+1,fdata);	
			loadList();		
			return false;
		}
	});
	
	loadList();	
	//updateDiff();
	
	

	/*	^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^		Helper Class	^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
	
	// Reset LocalStorage Data
	
	$("#resetStore").on({
		click:function(){
			localStorage.clear();
			$.mobile.changePage( 'index.html');
			console.log("Homepage Loaded");
		}
	})
	
	// Loads *** TASK LIST OF DASHBOARD ***
	
	function loadList(){
		$("#dataList li").remove();
		var i = 1;
		if(localStorage.length=0){
			console.log("No Data");
			$("#dataList").append("<li>NO Data</li>");
			$("#dataList").append("<li id="+subject.id+" class='inactive ui-btn addTask ui-corner-all'><a href='#addtaskPage'>Add Task</a></span></li>");
		}else{
			while(i<=localStorage.length){
				var subject=JSON.parse(localStorage.getItem(i));	// Parsing String To Object
					
					if(subject.status=="active"){
					$("#dataList").append("<li id="+subject.id+" class='active ui-btn'>"+subject.task+"</span></li>");
					}else{
					$("#dataList").append("<li id="+subject.id+" class='ui-btn'>"+subject.task+"</span></li>");
					}
				i++;
			}
			$("#dataList").append("<li class='inactive ui-btn addTask ui-corner-all'><a href='#addtaskPage' data-transition='slideup'>Add Task</a></span></li>");
		}
	}

	// Load Status List On Each Page Load Of	***	 STATUS REPORT *** Page
	
	$(document).on("pagebeforeshow","#status",function(){
		//updateDiff();
		 function statusList(){
			 $("#statusList tr").remove();
			var i = 1;
			if(localStorage.length=0){
				$("#statusList").append("<li>NO Data</li>");
			}else{				
				while(i<=localStorage.length){						
					var subject=JSON.parse(localStorage.getItem(i));	// Parsing String To Object
					if(subject.startTime==0){
						$("#statusList").append("<tr><td width='40%' id="+subject.id+">"+subject.task+"</td><td width='30%'>"+subject.hrs+"</td><td width='30%'>"+subject.totalHrs+"</td></tr>");
					}else{
						updateDiff();
						$("#statusList").append("<tr><td width='40%' id="+subject.id+">"+subject.task+"</td><td width='30%'>"+subject.hrs+"</td></td><td width='30%'>"+subject.totalHrs+"</td></tr>");
					}
				i++;
				}
			}
			}
		statusList();
	}); 
	
	// Update Diff	*** UPDATES DIFF *** Whenever Called
	
	function updateDiff(){
		var limit = localStorage.length;
		var i =1;
		while(i<=limit){
			var subject = JSON.parse(localStorage.getItem(i));
			if(subject.status=="active"){
			var now = moment();
			var then = moment(subject.startTime);
			//subject.startTime=moment();
	
			var ms = moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"));
			var d = moment.duration(ms);
			var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
			
			subject.hrs=s;									
			
			var fdata = JSON.stringify(subject);
			localStorage.setItem(i,fdata);
			}else{
				console.log("I Did Nothing");
			}
			i++
		}
	}
	
	//	 ***	START / STOP / UPDATE 	***
	
	 $("#dataList").delegate("li","click",function(){
		var subject = JSON.parse(localStorage.getItem($(this).attr("id")));	
		if(subject.status=="inactive"){
			$(this).addClass("active");
			subject.startTime=moment();
			subject.status="active"									
			var fdata = JSON.stringify(subject);
			localStorage.setItem($(this).attr("id"),fdata);
			
		} else if(subject.status=="active"){
			$(this).removeClass("active");
			var now = moment();
			var then = moment(subject.startTime);
	
			var ms = moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"));
			var d = moment.duration(ms);
			var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
			console.log(s);
			subject.status="inactive";
			subject.startTime=0;
			//var prevHrs = subject.hrs;
			//subject.hrs=moment().add(prevHrs,s);
			subject.hrs=(s);
			subject.totalHrs = moment().add(s+subject.hrs);
			var fdata = JSON.stringify(subject);
			localStorage.setItem($(this).attr("id"),fdata);
		}			
	});	
	
	/* Reload Stats Page */
	
	$("#reloadStats").on({
		click:function(){
			$.mobile.changePage("index.html#status");
			console.log("Reload Called");
		}
	})
});

/*
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady(){
	document.addEventListener("backbutton",asktoexit,false);
	function onConfirm(){
		navigator.app.exitApp();
	}
	function asktoexit(){
		 navigator.notification.confirm(
            'Exit Application?', // message
             onConfirm,            // callback to invoke with index of button pressed
            'Game Over',           // title
            ['Yes','No']         // buttonLabels
        );

	}
	
}
*/