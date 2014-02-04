// JavaScript Document
jQuery(function(){
	
	/* Add Task */
	
	$("#save").on({
		submit:function(event){
			var data = new Object();			
			data.id=localStorage.length+1;
			data.task=$("#newTask").val();	
			data.startTime= 0;//moment();
			data.hrs=0;
			data.totalHrs=0;
			data.status="inactive";
			
			var fdata = JSON.stringify(data);
			localStorage.setItem(localStorage.length+1,fdata);	
			loadList();
			$("#newTask").val("");
			$.mobile.changePage("index.html#home");
			return false;
		}
	});
	
	loadList();	
	
	

	/*	^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^		Helper Class		^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
	
	// Reset LocalStorage Data
	
	$("#resetStore").on({
		click:function(){
			localStorage.clear();
			$("#dataList li").remove();
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
		}
	}

	// Load Status List On Each Page Load Of	***	 STATUS REPORT *** Panel
	
	$(document).on("pagebeforeshow","#status",function(){
		 function statusList(){
			$("#statusList tr").remove();
			
			var i = 1;
			if(localStorage.length<=0){
				$("#statusList").append("<tr><td><h3 style='color:red'>No Tasks Added Yet</h3></td></tr>");
			}else{	
			$("#statusList").append("<tr class='tableHeader' id='statusList'><td width='40%'>Task Name</td><td width='30%'>Time Spent</td><td width='30%'>Total Time</td></tr>");				
				while(i<=localStorage.length){						
					var subject=JSON.parse(localStorage.getItem(i));	// Parsing String To Object
					if(subject.startTime==0){
						$("#statusList").append("<tr><td width='60%' id="+subject.id+">"+subject.task+"</td><td>"+fHrs(subject.hrs)+"</td><td>"+fHrs(subject.totalHrs)+"</td></tr>");
					}else{
						updateDiff();
						$("#statusList").append("<tr><td width='60%' id="+subject.id+">"+subject.task+"</td><td>"+fHrs(subject.hrs)+"</td><td>"+fHrs(subject.totalHrs)+"</td></tr>");
					}
				i++;
				}
			}
			}
		statusList();
	}); 
	
	// Takes Input As 	*** 	MILLISECONDS TO HH:MM:SS	***
	
	function fHrs(ms){
		if(ms==0){
			return " -- ";
		} else{
			var d = moment.duration(ms);
			var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
			return s;
		}
	}
	
	// Update Diff	*** UPDATES DIFF *** Whenever Called
	
	function updateDiff(){
		var limit = localStorage.length;
		var i =1;
		while(i<=limit){
			var subject = JSON.parse(localStorage.getItem(i));
			if(subject.status=="active"){
			var now = moment();
			var then = moment(subject.startTime);
	
			var ms = moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"));
			subject.hrs=ms; // Time the task is currently runnng for in milliseconds
			
			// var previousHrs = subject.totalHrs;	// Previously Recorded Time
			// subject.totalHrs = (ms+subject.totalHrs);
			
			var fdata = JSON.stringify(subject);
			localStorage.setItem(i,fdata);
			console.log("Updated Stats");
			}else{
				console.log("I Did Nothing");
			}
			i++
		}
	}
	
	//	 ***	START / STOP / UPDATE 	***
	
	 $("#dataList").delegate("li","click",function(){
		var subject = JSON.parse(localStorage.getItem($(this).attr("id")));	
		var now = moment();
		var then = moment(subject.startTime);

		if(subject.status=="inactive"){
			$(this).addClass("active");
			subject.startTime=moment();
			subject.status="active";								
			
			var fdata = JSON.stringify(subject);
			localStorage.setItem($(this).attr("id"),fdata);
			
		} else if(subject.status=="active"){
			$(this).removeClass("active");			
			subject.status="inactive";				
			
			var ms = moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"));
			currentHrs = ms;
			previousHrs = subject.totalHrs;
			subject.totalHrs=(currentHrs+previousHrs);
			console.log(currentHrs+"+"+previousHrs+"="+subject.totalHrs);
			subject.hrs=ms;	
			subject.startTime=0;			
			var fdata = JSON.stringify(subject);
			localStorage.setItem($(this).attr("id"),fdata);
			
			subject.hrs=0;	
			subject.startTime=0;			
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