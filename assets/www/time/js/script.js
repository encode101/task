// JavaScript Document
jQuery(function ($) {
	var data = new Object();			
	//data.id=localStorage.length+1;
	data.id = 1;
	data.startTime=0;
	data.hrs=0;
	data.totalHrs=0;
	var fdata = JSON.stringify(data);
	localStorage.setItem(1,fdata);

    $("#start").on({
        click: function(){
			var subject=JSON.parse(localStorage.getItem(1));
			subject.startTime=moment();
			var fdata = JSON.stringify(subject);
			localStorage.setItem(1,fdata);
			return false;
        }
    });
	
	$("#pause").on({
        click: function(){
			var subject=JSON.parse(localStorage.getItem(1));
			subject.endTime=moment();
			var fdata = JSON.stringify(subject);
			localStorage.setItem(1,fdata);
			
			// Update Time Diff
			
			var now = moment(subject.endTime);
			var then = moment(subject.startTime);
			
			var ms = moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"));
			var d = moment.duration(ms);
			var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
			
			subject.totalHrs=s+subject.hrs;
			
			subject.startTime=0;
			subject.endTime=0;
			var fdata = JSON.stringify(subject);
			localStorage.setItem(1,fdata);
			
			return false;
        }
    });
	
	/* 	Resume */
	
	$("#resume").on({
        click: function(){
			var subject=JSON.parse(localStorage.getItem(1));
			subject.startTime=moment();	
			var fdata = JSON.stringify(subject);
			localStorage.setItem(1,fdata);			
			return false;
        }
    });
	
/*	function refreshList(){
		var i = 1;		
		while(i<=localStorage.length){
			var subject=JSON.parse(localStorage.getItem(i));
			$("#myList").append("<li>"+subject.startTime+" </li>");
			i++;
		}
	}
*/	
	
	
});