let searchForm = document.getElementById('search-form');
let searchResultList = document.querySelectorAll('.result-items');
let result = document.getElementById('search-results');
let searchValue = result.getElementsByTagName('h3');

searchForm.addEventListener("keyup", function() {
  for (var i = 0; i < searchValue.length; i++) {
    console.log(searchForm.value);
    let value = searchResultList[i].getElementsByTagName('h3')[0];
    let filterValue = value.textContent || value.innerHTML;
    if (filterValue.toUpperCase().indexOf(searchForm.value.toUpperCase()) > -1) {
      searchResultList[i].style.display = "";
    } 
    else {
      searchResultList[i].style.display = "none";
    }
  }
});

function displayDetails() {
  var description = document.getElementById("description");
  description.style.display="block";
}

function displayDetails1() {
  var description = document.getElementById("description1");
  description.style.display="block";
}

function displayDetails2() {
  var description = document.getElementById("description2");
  description.style.display="block";
}

function displayDetails3() {
  var description = document.getElementById("description3");
  description.style.display="block";
}

function displayDetails4() {
  var description = document.getElementById("description4");
  description.style.display="block";
}

function displayDetails5() {
  var description = document.getElementById("description5");
  description.style.display="block";
}

function displayDetails6() {
  var description = document.getElementById("description6");
  description.style.display="block";
}

function displayDetails7() {
  var description = document.getElementById("description7");
  description.style.display="block";
}

function displayDetails8() {
  var description = document.getElementById("description8");
  description.style.display="block";
}

function displayDetails9() {
  var description = document.getElementById("description9");
  description.style.display="block";
}

function displayDetails10() {
  var description = document.getElementById("description10");
  description.style.display="block";
}

function displayDetails11() {
  var description = document.getElementById("description11");
  description.style.display="block";
}

function displayDetails12() {
  var description = document.getElementById("description12");
  description.style.display="block";
}

function displayDetails13() {
  var description = document.getElementById("description13");
  description.style.display="block";
}

function displayDetails14() {
  var description = document.getElementById("description14");
  description.style.display="block";
}

function displayDetails15() {
  var description = document.getElementById("description15");
  description.style.display="block";
}

function displayDetails16() {
  var description = document.getElementById("description16");
  description.style.display="block";
}

function displayDetails17() {
  var description = document.getElementById("description17");
  description.style.display="block";
}

function displayDetails18() {
  var description = document.getElementById("description18");
  description.style.display="block";
}

function displayDetails19() {
  var description = document.getElementById("description19");
  description.style.display="block";
}

function displayDetails20() {
  var description = document.getElementById("description20");
  description.style.display="block";
}