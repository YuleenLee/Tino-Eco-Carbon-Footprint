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