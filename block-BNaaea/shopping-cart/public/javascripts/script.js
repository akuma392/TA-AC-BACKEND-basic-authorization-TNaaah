let like = document.querySelector('.btn-like');
let dislike = document.querySelector('.btn-dislike');

let noOflike = document.querySelector('h5 span');
let num = noOflike.innerText;
// var Article = require('../models/article');

var Article = require('../../models/article');

function handleEvent(event) {
  noOflike.innerText = Number(num) + 1;
  Article;
}

function dislikeEvent(event) {
  if (Number(num) > 0) {
    noOflike.innerText = Number(num) - 1;
  }
}
like.addEventListener('click', handleEvent);
dislike.addEventListener('click', dislikeEvent);
