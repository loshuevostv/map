const mbg = document.querySelector('.mbg');
const cont = document.querySelector('.map-cont');
const app = document.querySelector('.app');
const timer = document.querySelector('#time');

window.addEventListener('resize', adaptMapSize);
mbg.addEventListener('load', adaptMapSize)

function updateMapState(elem) {
	if (elem.id != null && elem.id != undefined) {
		let t2 = elem.id.replace('t1', 't2');
		if (elem.id.endsWith('t1') && cont.classList.contains(t2)) {
			cont.classList.remove(elem.id);
			cont.classList.remove(t2);
			return;
		} 
		let t1 = elem.id.replace('t2', 't1');
		if (elem.id.endsWith('t2') && !cont.classList.contains(elem.id)) {
			cont.classList.add(elem.id);
			cont.classList.add(t1);
			return;
		}
		cont.classList.toggle(elem.id)
	}
}

function adaptMapSize() {
	cont.width = mbg.width;
	cont.height = mbg.height;
	cont.style.width = mbg.width;
	cont.style.height = mbg.height;
}

function alignMarkers() {
	for (let c of document.getElementsByClassName("marker")) {
		let t = Number(c.style.top.replace('%',''))
		let l = Number(c.style.left.replace('%',''))
		c.style.top = Math.round(t*2)/2 + "%";
		c.style.left = Math.round(l*2)/2 + "%";
	}
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }
  
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
	tpos = (elmnt.offsetTop - pos2);
	//if (tpos < 0) tpos = 0;
	lpos = (elmnt.offsetLeft - pos1);
	//if (lpos < 0) lpos = 0;
	
    elmnt.style.top = tpos;
    elmnt.style.left = lpos;
	elmnt.style.position = "absolute";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
};

var min2 = false;
var min7 = false;
var min9 = false;
function changeTime(diff) {
	let time = parseInt(cont.getAttribute('data-time'));
	if ((time + diff > 600) || (time + diff < 0)) return;
	time += diff;
	
	let m = Math.floor(time / 60);
	let s = time % 60;

	if (m < 10) m = '0' + m;
	if (s < 10) s = '0' + s;
	
	let v = m + ":" + s;
	
	timer.textContent = v;
	cont.setAttribute('data-time', time);
	
	if ((time <= 120 && !min2) || (time > 120 && min2)) {
		cont.classList.toggle('final')
		min2 = !min2;
	}
	if ((time <= 420 && !min7) || (time > 420 && min7)) {
		cont.classList.toggle('objective')
		min7 = !min7;
	}
	if ((time <= 570 && !min9) || (time > 570 && min9)) {
		cont.classList.toggle('initial')
		min9 = !min9;
	}
}

document.addEventListener("DOMContentLoaded", function() {
	for (let c of document.getElementsByClassName("draggable-items")) {
		for (let e of c.children) {
			dragElement(e);
		}
	}
	let mir = document.querySelector('.mirrorbtn');
	// let fin = document.querySelector('.timerbtn');
	let res = document.querySelector('.resetbtn');
	let minus = document.querySelector('#dec-time');
	let plus = document.querySelector('#inc-time');

	let zoomA = document.querySelector('.zoombtn.zoom-a');
	let zoomR = document.querySelector('.zoombtn.zoom-r');
	let zoomZ = document.querySelector('.zoombtn.zoom-z');
	let zoomD = document.querySelector('.zoombtn.zoom-d');

	zoomA.onclick = function() {
		app.classList.remove('zoom-rotom');
		app.classList.remove('zoom-drednaw');
		app.classList.remove('zoom-zapdos');
		res.click();
	};

	zoomR.onclick = function() {
		app.classList.remove('zoom-rotom');
		app.classList.remove('zoom-drednaw');
		app.classList.remove('zoom-zapdos');
		app.classList.add('zoom-rotom');
		res.click();
	};

	zoomZ.onclick = function() {
		app.classList.remove('zoom-rotom');
		app.classList.remove('zoom-drednaw');
		app.classList.remove('zoom-zapdos');
		app.classList.add('zoom-zapdos');
		res.click();
	};

zoomD.onclick = function() {
	app.classList.remove('zoom-rotom');
	app.classList.remove('zoom-drednaw');
	app.classList.remove('zoom-zapdos');
	app.classList.add('zoom-drednaw');
	res.click();
};
	
	minus.onclick = function() { changeTime(-30) }
	plus.onclick = function() { changeTime(+30) }
	
	mir.onclick = function() {
		mir.classList.toggle('toggled')
		app.classList.toggle('mirror')
	}
	res.onclick = function() {
		for (let c of document.getElementsByClassName("draggable-items")) {
			for (let e of c.children) {
				e.style.top = e.style.left = e.style.position = "";
			}
		}
		cont.setAttribute('data-time', "600");
		changeTime(0)

		var arrsvg = document.querySelectorAll('.arrsvg');
		for(var i=0; i<arrsvg.length; i++) arrsvg[i].outerHTML ='';
	}
	adaptMapSize();

	
	var elm_container = document.querySelector('.app');

	function drawArrowSVG(parent){
		var me = this;
		var x, y = 0;
		var drawarrow =0;
		var c_e1 ={};
		var c_e2 ={};
		var container = parent;
		var curArrow = null;
		var drawing = false;
	
		function getXYpos(elm) {
			x = elm.offsetLeft;
			y = elm.offsetTop;
	
			elm = elm.offsetParent;

			while(elm != null) {
				x = parseInt(x) + parseInt(elm.offsetLeft);
				y = parseInt(y) + parseInt(elm.offsetTop);
				elm = elm.offsetParent;
			}
	
			return {'xp':x, 'yp':y};
		}

		function onMouseDown(e) {
			var xy_pos = getXYpos(this);
	
			x = e.pageX - xy_pos['xp'];
			y = e.pageY - xy_pos['yp'];

			c_e1 = {x:x, y:y};
			drawing = true;
		}

		function onMouseMove(e) {
			if (!drawing) return;

			var xy_pos = getXYpos(this);
	
			x = e.pageX - xy_pos['xp'];
			y = e.pageY - xy_pos['yp'];

			c_e2 = {x:x, y:y};
			drawArrow(c_e1, c_e2);
		}

		function onMouseUp(e) {
			drawing = false;
			curArrow = null;
		}
	
		function drawArrow(c_e1, c_e2){
			if (!curArrow) {
				var arrsvg = '<svg class="arrsvg active" style="position:absolute; top:0; left:0; margin:0; width:99.8%; height:99.9%;"></svg>';
				container.insertAdjacentHTML('beforeend', arrsvg);
				curArrow = document.querySelector('.arrsvg.active');
				curArrow.classList.remove('active');
			}
			
			curArrow.innerHTML = '<defs><marker id="arrow" markerWidth="8" markerHeight="8" refx="3" refy="4" orient="auto"><path d="M1,1 L1,7 L7,4 L1,1" style="fill:red;" /></marker></defs><path d="M'+ c_e1.x +','+ c_e1.y +' L'+ c_e2.x +','+ c_e2.y +'" style="stroke:red; stroke-width: 5px; fill: none; marker-end: url('+ location.href.replace(/[#]*$/ig, '') +'#arrow);"/>';
		}
	
		container.addEventListener('mousedown', onMouseDown);
		container.addEventListener('mousemove', onMouseMove);
		container.addEventListener('mouseup', onMouseUp);
	}
	
	var drawAr = new drawArrowSVG(elm_container);
});