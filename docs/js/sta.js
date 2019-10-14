$(function(){

var gLines = {};

$.ajax({
  type: 'GET',
  url: 'data/all.txt',
  success:function(s){
    var lines = s.split(/\n/);
    var mode = 0;
    var tmp;
    var lineName;
    for(var i = 0; i < lines.length; i ++){
      if(mode == 0){
        lineName = lines[i];
      }
      if(mode == 1){
        tmp = JSON.parse(lines[i]);
	gLines[lineName] = tmp.response.station;
      }
      mode = (mode + 1) % 3;
    }
    gLines[name] = tmp;
    redraw();
  }
});

var pos = [0,0];
var scale = 5000

function redraw(){
  var canv = $('#canv')[0];
  var ctx = canv.getContext('2d');
  ctx.clearRect(0,0,1000,1000);
  ctx.save();

  ctx.save();
  ctx.scale(2,2);
  ctx.fillStyle = "white";
  ctx.fillText(gHLine, 20,20);
  ctx.restore();

  ctx.scale(scale, scale);

  ctx.translate(-139.65,35.8);
  ctx.lineWidth = 3/scale;
  for(var line in gLines){
    var r1 = Math.floor(Math.random()*256);
    var r2 = Math.floor(Math.random()*256);
    var r3 = Math.floor(Math.random()*256);
    var a = 0.3;
    if(line == gHLine){
     r1 = r2 = r3 = 255;
     a = 1;
    }
    ctx.strokeStyle="rgba("+r1+","+r2+","+r3+"," +a+")";
    ctx.beginPath();
    for(var i = 0; i < gLines[line].length; i ++){
      var sta = gLines[line][i];
      if(i==0){
        ctx.moveTo(sta.x , -sta.y);
      }else{
        ctx.lineTo(sta.x , -sta.y);
      }
    }
    //ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    for(var i = 0; i < gLines[line].length; i ++){
      var sta = gLines[line][i];
      //console.log(sta);
      var SIZE = 2;
      ctx.fillRect(sta.x - SIZE/scale, -sta.y - SIZE/scale, SIZE*2/scale, SIZE*2/scale);
      ctx.save();
      ctx.scale(1/scale, 1/scale);
      ctx.translate(sta.x*scale, -sta.y*scale)
      //ctx.scale(0.8, 0.8);
      if(line == gHLine){
        ctx.fillStyle = "white";
        ctx.fillText(sta.name, 0,0);
      }
      ctx.restore();
    }
  }
  var SIZE = 20;
  ctx.fillRect(pos[0] -SIZE/scale, -pos[1] - SIZE/scale, 2*SIZE/scale, 2*SIZE/scale);

  ctx.restore();
}
var gHLine = "";
$('#canv').mousemove(function(e){
  //console.log(e);
  var yy = $('#canv').position()['top']
  var x = (e.pageX)/scale + 139.65;
  var y = (yy  -e.pageY)/scale + 35.8;
  pos = [x,y];

  var SIZE = 20/scale;
  var sx = x - SIZE; 
  var sy = y - SIZE; 
  var ex = x + SIZE; 
  var ey = y + SIZE; 
  for(var line in gLines){
    for(var i = 0; i < gLines[line].length; i ++){
      var sta = gLines[line][i];
      if(sx < sta.x && sta.x < ex && sy < sta.y && sta.y < ey){
        // hit
	gHLine = line;
      }
    }
  }
  redraw();
});

});
