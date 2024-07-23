var check = document.getElementById("checkboxes");

if (isMobile) {
  check.style.position = "fixed";
  check.style.zIndex = '1000';
  check.style.left = '50%';
  check.style.top = '50%';
  check.style.bottom = "auto";
  check.style.width = "90%";
  check.style.transform = "translate(-50%,-50%)";
  openSort();
}

function openSort(e) {
  if (check.style.opacity == '100') {
    check.style.opacity = '0';
    check.style.pointerEvents = "none";
  } else {
    check.style.opacity = '100';
    check.style.pointerEvents = "auto";
  }
}

document.getElementById("openSort").addEventListener("click", openSort);
document.getElementById("closeSort").addEventListener("click", openSort);


var children = document.getElementById("itemsParent").children;

var typesorters = document.getElementsByClassName("typesort");

function displayType(e) {
  var type = e.target.id;
  if (e.target.checked == false) {
    for (const child of children) {
      if (child.style.getPropertyValue('--type') == type) {
        child.hidden = true;
      }
    }
  } else {
    for (const child of children) {
      if (child.style.getPropertyValue('--type') == type) {
        child.hidden = false;
      }    
    }
  }

  let allHidden = true;
  let hiddenelt = document.getElementById("allhidden");
  for (const child of children) {
    if (child.hidden == false) {
      allHidden = false;
    }    
  }
  if (allHidden) {
    hiddenelt.hidden = false;
  } else {
    hiddenelt.hidden = true;
  }
}

for (let i = 0; i < typesorters.length; i++) {
  typesorters[i].addEventListener("change", displayType);
}

var listsorters = document.getElementsByClassName("listsort");

function bubbleSort(arr, param, reverse) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < (arr.length - i - 1); j++) {
      if (reverse) {
        if (arr[j].style.getPropertyValue(param) > arr[j+1].style.getPropertyValue(param)) {
          arr[j].parentNode.insertBefore(arr[j+1], arr[j]);
        }
      } else {
        if (arr[j].style.getPropertyValue(param) < arr[j+1].style.getPropertyValue(param)) {
          arr[j].parentNode.insertBefore(arr[j+1], arr[j]);
        }
      }
    }
  }
}

function sortList(e) {
  var type = e.target.id;
  let uniquecheck = true;
  for (item of listsorters) {
    if (item.checked == true) {
      item.checked = false;
      uniquecheck = false;
    }    
  }
  e.target.checked = true;
  if (!uniquecheck) {
    switch(type) {
      case 'az':
        bubbleSort(children, '--name', true);
        break;
      case 'za':
        bubbleSort(children, '--name', false);
        break;
      case 'asc':
        bubbleSort(children, '--price', true);
        break;
      case 'desc':
        bubbleSort(children, '--price', false);
        break;
      case 'new':
        bubbleSort(children, '--date', false);
        break;
      case 'old':
        bubbleSort(children, '--date', true);
        break;
      default:
        //do nothing
    }
  }
}

bubbleSort(children, '--date', false);

for (let i = 0; i < listsorters.length; i++) {
  listsorters[i].addEventListener("change", sortList);
}