const mbg = document.querySelector('.mbg');
const cont = document.querySelector('.map-cont');
const app = document.querySelector('.app');

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
document.addEventListener("DOMContentLoaded", function() {
	for (let c of document.getElementsByClassName("draggable-items")) {
		for (let e of c.children) {
			dragElement(e);
		}
	}
	let mir = document.querySelector('.mirrorbtn');
	let fin = document.querySelector('.finalbtn');
	fin.onclick = function() {
		fin.classList.toggle('toggled')
		cont.classList.toggle('final')
	}
	mir.onclick = function() {
		mir.classList.toggle('toggled')
		app.classList.toggle('mirror')
	}
	
	window.history.pushState("404 Map", "404 Unite Coaching Map", "/");
});