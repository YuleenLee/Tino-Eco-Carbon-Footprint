window.onload = function() {
  let searchForm = document.getElementById('search-form');
  let searchResultList = document.querySelectorAll('.result-items');
  let result = document.getElementById('search-results');
  let searchValue = result.getElementsByTagName('p');

  searchForm.addEventListener("keyup", function() {
    for (var i = 0; i < searchValue.length; i++) {
      console.log(searchForm.value);
      let value = searchResultList[i].getElementsByTagName('p')[0];
      let filterValue = value.textContent || value.innerHTML;
      if (filterValue.toUpperCase().indexOf(searchForm.value.toUpperCase()) > -1) {
        searchResultList[i].style.display = "";
      } 
      else {
        searchResultList[i].style.display = "none";
      }
    }
  });
}

function displayDetails() {
  var description = document.getElementById("taskinfo");
  taskinfo.style.display="block";
}

function displayDetails1() {
  var description = document.getElementById("taskinfo1");
  taskinfo1.style.display="block";
}

function displayDetails2() {
  var description = document.getElementById("taskinfo2");
  taskinfo2.style.display="block";
}

function displayDetails3() {
  var description = document.getElementById("taskinfo3");
  taskinfo3.style.display="block";
}

function displayDetails4() {
  var description = document.getElementById("taskinfo4");
  taskinfo4.style.display="block";
}

function displayDetails5() {
  var description = document.getElementById("taskinfo5");
  taskinfo5.style.display="block";
}

function displayDetails6() {
  var description = document.getElementById("taskinfo6");
  taskinfo6.style.display="block";
}

function displayDetails7() {
  var description = document.getElementById("taskinfo7");
  taskinfo7.style.display="block";
}

function displayDetails8() {
  var description = document.getElementById("taskinfo8");
  taskinfo8.style.display="block";
}

function displayDetails9() {
  var description = document.getElementById("taskinfo9");
  taskinfo9.style.display="block";
}

function displayDetails10() {
  var description = document.getElementById("taskinfo10");
  taskinfo10.style.display="block";
}

function displayDetails11() {
  var description = document.getElementById("taskinfo11");
  taskinfo11.style.display="block";
}

function displayDetails12() {
  var description = document.getElementById("taskinfo12");
  taskinfo12.style.display="block";
}

function displayDetails13() {
  var description = document.getElementById("taskinfo13");
  taskinfo13.style.display="block";
}

function displayDetails14() {
  var description = document.getElementById("taskinfo14");
  taskinfo14.style.display="block";
}

function displayDetails15() {
  var description = document.getElementById("taskinfo15");
  taskinfo15.style.display="block";
}

function displayDetails16() {
  var description = document.getElementById("taskinfo16");
  taskinfo16.style.display="block";
}

function displayDetails17() {
  var description = document.getElementById("taskinfo17");
  taskinfo17.style.display="block";
}

function displayDetails18() {
  var description = document.getElementById("taskinfo18");
  taskinfo18.style.display="block";
}

function displayDetails19() {
  var description = document.getElementById("taskinfo19");
  taskinfo19.style.display="block";
}

function displayDetails20() {
  var description = document.getElementById("taskinfo20");
  taskinfo20.style.display="block";
}

function displayDetails21() {
  var description = document.getElementById("taskinfo21");
  taskinfo21.style.display="block";
}

function displayDetails22() {
  var description = document.getElementById("taskinfo22");
  taskinfo22.style.display="block";
}

function displayDetails23() {
  var description = document.getElementById("taskinfo23");
  taskinfo23.style.display="block";
}

function displayDetails24() {
  var description = document.getElementById("taskinfo24");
  taskinfo24.style.display="block";
}

function displayDetails25() {
  var description = document.getElementById("taskinfo25");
  taskinfo25.style.display="block";
}

function displayDetails26() {
  var description = document.getElementById("taskinfo26");
  taskinfo26.style.display="block";
}

function displayDetails27() {
  var description = document.getElementById("taskinfo27");
  taskinfo27.style.display="block";
}

function displayDetails28() {
  var description = document.getElementById("taskinfo28");
  taskinfo28.style.display="block";
}

function displayDetails29() {
  var description = document.getElementById("taskinfo29");
  taskinfo29.style.display="block";
}

function displayDetails30() {
  var description = document.getElementById("taskinfo30");
  taskinfo30.style.display="block";
}

function displayDetails31() {
  var description = document.getElementById("taskinfo31");
  taskinfo31.style.display="block";
}

function displayDetails32() {
  var description = document.getElementById("taskinfo32");
  taskinfo32.style.display="block";
}

function displayDetails33() {
  var description = document.getElementById("taskinfo33");
  taskinfo33.style.display="block";
}

function displayDetails34() {
  var description = document.getElementById("taskinfo34");
  taskinfo34.style.display="block";
}

function displayDetails35() {
  var description = document.getElementById("taskinfo35");
  taskinfo35.style.display="block";
}

function displayDetails36() {
  var description = document.getElementById("taskinfo36");
  taskinfo36.style.display="block";
}

function displayDetails37() {
  var description = document.getElementById("taskinfo37");
  taskinfo37.style.display="block";
}

function displayDetails38() {
  var description = document.getElementById("taskinfo38");
  taskinfo38.style.display="block";
}

function displayDetails39() {
  var description = document.getElementById("taskinfo39");
  taskinfo39.style.display="block";
}

function displayDetails40() {
  var description = document.getElementById("taskinfo40");
  taskinfo40.style.display="block";
}

function displayDetails41() {
  var description = document.getElementById("taskinfo41");
  taskinfo41.style.display="block";
}

function displayDetails42() {
  var description = document.getElementById("taskinfo42");
  taskinfo42.style.display="block";
}

function displayDetails43() {
  var description = document.getElementById("taskinfo43");
  taskinfo43.style.display="block";
}

function displayDetails44() {
  var description = document.getElementById("taskinfo44");
  taskinfo44.style.display="block";
}

function displayDetails45() {
  var description = document.getElementById("taskinfo45");
  taskinfo45.style.display="block";
}

function displayDetails46() {
  var description = document.getElementById("taskinfo46");
  taskinfo46.style.display="block";
}

function displayDetails47() {
  var description = document.getElementById("taskinfo47");
  taskinfo47.style.display="block";
}

function displayDetails48() {
  var description = document.getElementById("taskinfo48");
  taskinfo48.style.display="block";
}

function displayDetails49() {
  var description = document.getElementById("taskinfo49");
  taskinfo49.style.display="block";
}

function displayDetails50() {
  var description = document.getElementById("taskinfo50");
  taskinfo50.style.display="block";
}

function displayDetails51() {
  var description = document.getElementById("taskinfo51");
  taskinfo51.style.display="block";
}

function displayDetails52() {
  var description = document.getElementById("taskinfo52");
  taskinfo52.style.display="block";
}