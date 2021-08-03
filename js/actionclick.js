document.addEventListener('click', function (e) {
  e = e || window.event;
  var target = e.target || e.srcElement,
    text = target.textContent || target.innerText;
  alert('Click on, desde el nuevo archivo= ' + text);
}, false);