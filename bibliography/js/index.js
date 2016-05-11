
function index(value, array){
      return array.indexOf(value) > -1;
}

function search(e){
	found = []
	//hide all the divs, search all the divs
	item = document.querySelectorAll('.item')
	for (var i = item.length - 1; i >= 0; i--) {
		item[i].style.display = 'none'
		thisid = item[i].id
		desc = item[i].textContent.toLowerCase().split(" ")
		checkInput(e,desc,thisid)
		}
  console.log(found)
	found.forEach(function(f){
			document.querySelector('#'+f).style.display = 'block'
	})

}
function checkInput(e,d,t){
	inputs = e.value.toLowerCase().split(" ")
	for (var i = inputs.length - 1; i >= 0; i--) {
		if (index(inputs[i],d)){
			//console.log(inputs[i])
			found.push(t)
		}
	}
}

function loadHash(d) { 
  //if url has hash, add as input
  if (window.location.hash != ''){
    document.querySelector("input").value = decodeURIComponent(window.location.hash).replace('#','').replace('tag=','')
    search(document.querySelector("input"))
  }
  document.querySelector("input").onkeyup = function(e) {

    window.location.hash = ''
    
    // var items = document.querySelectorAll(".item");
    // for(var i=0; i<items.length; i++) {
    //   items[i].style.display = "none"
    // }

    var words = this.value.split(" ");
    window.location.hash = encodeURIComponent(this.value)
    search(this)
  }
  if (document.querySelector("input").value = ""){
    item = document.querySelectorAll('.item').style.display.block
  }
}

var xhr = new XMLHttpRequest();
xhr.open("GET", "./bibliography.json", true);

xhr.onload = function() {
  if (xhr.status === 200) {
  	var data = JSON.parse(xhr.responseText.trim());
    for (var i = data.length - 1; i >= 0; i--) {
    	d = document.createElement('div')
    	d.id = 'item_'+data[i].hash
    	d.className = 'item col-md-4'
    	d.innerHTML = '<h3><a href="'+ data[i].href +'">' + data[i].description + '</a></h3><hr>'
    	document.querySelector('#reads').appendChild(d)
    	tags = data[i].tags.split(' ')
    	tags.forEach(function(t){
			s = document.createElement('a')
    		s.id = 'meta_'+t
    		s.className= 'tags'
    		s.href = '#tag='+t
    		s.innerHTML = " "+t+" "
    		d.appendChild(s)
    		s.onclick = function(){
    			document.querySelector('input').value = t
    			search(document.querySelector('input'))
    		}
    	})
    }
  loadHash(data);
  }
}
xhr.send()
