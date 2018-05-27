var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var scoreLabel = document.getElementById('score');

var score = 0;
var size = 4;
/*definit nombre de separation et "5" le positionnement du bloc*/
var width = canvas.width / size - 6;

var cells = [];
var fontSize;
var loss = false;

startGame();

function startGame() {
  createCells();
  drawAllCells();
  randomNumber();
  randomNumber(); /* 2fois pour que 2 chiffre apparaisent*/
}
/*les "chiffres" = positionnement*/
function cell(row, coll) {
  this.value = 0; /*this ce refere à cell*/
  this.x = coll * width + 5 * (coll + 1); /*premier chiffre decale chaque coll separement et le deuxième chiffre tout le bloc de coll*/
  this.y = row * width + 5 * (row + 1); /* idem pour les lignes*/
}

function createCells() {   /*i = nbre de ligne et j = nbre de coll CREER*/
  for (var i = 0; i < size; i++) {
    cells[i]= [];
    for (var j = 0; j < size; j++) {
    cells[i][j] = new cell(i, j);
    }
  }
}
/*definit chaque celulle*/
function drawCell(cell) {
  /*debut du chemin*/
  ctx.beginPath();
  /*creation rectangle*/
  ctx.rect(cell.x, cell.y, width, width);
  switch (cell.value) {
    case 0 : ctx.fillStyle = '#ebdcb7'; break;
    case 2 : ctx.fillStyle = '#f8db8e'; break;
    case 4 : ctx.fillStyle = '#f1cd6c'; break;
    case 8 : ctx.fillStyle = '#d5b769'; break;
    case 16 : ctx.fillStyle = '#977006'; break;
    case 32 : ctx.fillStyle = '#c7a05a'; break;
    case 64 : ctx.fillStyle = '#ad730a'; break;
    case 128 : ctx.fillStyle = '#f8c744'; break;
    case 256 : ctx.fillStyle = '#eec800'; break;
    case 512 : ctx.fillStyle = '#e98e39'; break;
    case 1024 : ctx.fillStyle = '#f7b70f'; break;
    case 2048 : ctx.fillStyle = '#f5eace'; break;
    case 4096 : ctx.fillStyle = '#f7340f'; break;
    default : ctx.fillStyle = '#f7edd4';
  }

  ctx.fill();
  /*execute les parametres de l'aspect que l'on a choisit*/
  if (cell.value) { /*s'il y a une valeur*/
    fontSize = width / 2;
    ctx.font = fontSize + 'px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(cell.value, cell.x + width / 2, cell.y + width / 2 + width / 7); /*placemment du texte*/
  }
}

/*i = nbre de ligne et j = nbre de coll DESSINE*/
function drawAllCells() {
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
     drawCell(cells[i][j]);
    }
  }
}

function randomNumber() {
  var countFree = 0;
 var i, j;
 for(i = 0; i < size; i++) {
   for(j = 0; j < size; j++) {
     if(!cells[i][j].value) { /*s'il y a des cases vides*/
       countFree++; /* continue compter case vides */
     }
   }
 }
 if(!countFree) { /* plus de cases vides*/
   finishGame();
   return;
 }
  while (true) { /*execute en boucle tant que c'est true (pas perdue)*/
    var row = Math.floor(Math.random() * size); /*Math.floor arrondi  nbr entier INFERIEUR*/
    var coll = Math.floor(Math.random() * size);
    if (!cells[row][coll].value) { /*si ya pas de nb*/
       cells[row][coll].value = 2 * Math.ceil(Math.random() * 2); /*Math.ceil arrondie nbr entier SUPERIEUR*/
      drawAllCells();
      return;
    }
  }
}

document.onkeydown = function (event) {
  if(!loss) {
    if(event.keyCode === 38 || event.keyCode === 87) moveUp(); /*= numero des touche du clavier*/
    else if(event.keyCode === 39 || event.keyCode === 68) moveRight();
    else if(event.keyCode === 40 || event.keyCode === 83) moveDown();
    else if(event.keyCode === 37 || event.keyCode === 65) moveLeft();
    scoreLabel.innerHTML =  score;
  }
}


/*la premiere ligne de dessus i =  0 puis on croit jusqu'à ligne i = 3*/
function moveUp() {
  var i, j;
  for (j = 0; j < size; j++) {
    for (i = 1; i < size; i++) { /*croissant ligne par ligne*/
      if (cells[i][j].value) {
        var row = i;
          while(row > 0) {
            if (!cells[row - 1][j].value) { /*cellule sans valeur*/
              cells[row - 1][j].value = cells[row][j].value; /*cellule ligne de dessous = cellule ligne de dessus*/
              cells[row][j].value = 0; /*cellules = 0*/
              row--;
            }
            else if (cells[row - 1][j].value == cells[row][j].value) { /*si 2 cellule meme valeur*/
              cells[row - 1][j].value *= 2; /* *= : multiplie par 2 la cellule*/
              score += cells[row - 1][j].value; /* += : additionne*/ /*score = valeur cellule*/
              cells[row][j].value = 0; /*cellules = 0 (*/
              break; /*n'additionne qu'une seule fois 2 cellules après in click*/
            }
            else {
               break; /*si c'est autre pas d'action*/
            }
          }
        }
      }
    }
 randomNumber(); /*recreer des nouvelles cellules avec des chiffres de manière aleatoire*/
}

function moveRight() {
  var i, j;
  for(i = 0; i < size; i++) {
    for(j = size - 2; j >= 0; j--) {
      if(cells[i][j].value) {
        coll = j;
        while (coll + 1 < size) {
          if (!cells[i][coll + 1].value) {
            cells[i][coll + 1].value = cells[i][coll].value;
            cells[i][coll].value = 0;
            coll++;
          } else if (cells[i][coll].value == cells[i][coll + 1].value) {
            cells[i][coll + 1].value *= 2;
            score +=  cells[i][coll + 1].value;
            cells[i][coll].value = 0;
            break;
          }
          else {
            break;
          }
        }
      }
    }
  }
 randomNumber();
}

function moveDown() {
  var i, j;
  for (j = 0; j < size; j++) {
      for (i = size - 2; i >= 0; i--) { /*decroit ligne par ligne*/
        if (cells[i][j].value) {
          var row = i;
            while(row + 1 < size) {
              if (!cells[row + 1][j].value) {
                cells[row + 1][j].value = cells[row][j].value;
                cells[row][j].value = 0;
                row++;
              }
              else if (cells[row + 1][j].value == cells[row][j].value) {
                cells[row + 1][j].value *= 2;
                score += cells[row + 1][j].value;
                cells[row][j].value = 0;
                break;
               }
              else {
                break;
              }
            }
          }
        }
      }
   randomNumber();
}

function moveLeft() {
  var i, j;
  for(i = 0; i < size; i++) {
      for(j = 1; j < size; j++) {
        if(cells[i][j].value) {
          coll = j;
          while (coll - 1 >= 0) {
            if (!cells[i][coll - 1].value) {
              cells[i][coll - 1].value = cells[i][coll].value;
              cells[i][coll].value = 0;
              coll--;
             }
            else if (cells[i][coll].value == cells[i][coll - 1].value) {
              cells[i][coll - 1].value *= 2;
              score +=   cells[i][coll - 1].value;
              cells[i][coll].value = 0;
              break;
            }
             else {
              break;
             }
           }
         }
       }
     }
  randomNumber();
}

function finishGame() {

  canvas.style.opacity = '0.5';
  loss = true;

}
