CardDrag = {
	duringDrag: false
};

CardDrag.startDrag = function(game, id, card, el) {
	this.dragging = el;
	this.duringDrag = true;

	this.card = card;

	var startEl = el;
	this.startEl = el;
	startEl.addClass("dragging");

  var offset = startEl.offset();
  var cy = offset.top + startEl.height()/2;
  var cx = offset.left + startEl.width()/2 + parseInt(startEl.find(".card").css("margin-left"))/2;
  startEl.css("transition", "none");
  
  var boardoffset = $(".board").offset();
  var boardtop = boardoffset.top;
  this.boardtop = boardoffset.top;
  var boardbottom = boardoffset.top + $(".board").height();
  this.boardbottom = boardoffset.top + $(".board").height();
  this.boardstops = [boardoffset.left];
  var boardstops = this.boardstops;
  $("#my_board .card").each(function(i, el) {
  	var mid = $(el).offset().left + $(el).width()/2;
  	boardstops.push(mid);
  });

  this.boardstops.push(boardoffset.left + $(".board").width());
  console.log(this.boardstops);
  
  var body = $("body");
  
  var mousemove = function (e) {
  	var mx = e.clientX;
  	var my = e.clientY + body.scrollTop();
    var dx = mx - cx;
    var dy = my - cy;
    startEl.css("transform", "translate("+dx+"px, "+dy+"px)");
    if (mx > boardstops[0] && mx < boardstops[boardstops.length-1] &&
      my > boardtop && my < boardbottom) {
		  var index = 1;
			while (mx > boardstops[index]) {
				index++;
			}
			index--;
			$("#my_board .card-container").each(function(i, el) {
				if (i < index) {
					$(el).css("transform", "translateX(-65px)");
				} else {
					$(el).css("transform", "translateX(65px)");
				}
			});
	  } else {
	  	$("#my_board .card-container").each(function(i, el) {
				$(el).css("transform", "none");
			});
	  }
  };
  addEventListener("mousemove", mousemove);

  this.cleanup = function() {
  	el.removeClass("dragging");
  	removeEventListener("mousemove", mousemove);
  }
}

CardDrag.endDrag = function(e, gameId, id) {
  var mx = e.clientX;
  var my = e.clientY + $("body").scrollTop();
  $("#my_board .card-container").each(function(i, el) {
    $(el).css("transition", "none");
		$(el).css("transform", "none");
    $(el).width();
    $(el).css("transition", "all .3s");
	});
  if (mx > this.boardstops[0] && mx < this.boardstops[this.boardstops.length-1] &&
      my > this.boardtop && my < this.boardbottom) {
  	var index = 1;
		while (mx > this.boardstops[index]) {
			index++;
		}
		index--;
  	this.startEl.attr("transition", "none");
	  this.startEl.css("transform", "translate(0px, 0px)");
	  this.startEl.width();
  	Meteor.call('playCard', gameId, id, this.card, index);
  } else {
    this.startEl.css("transition", "all .3s ease");
    this.startEl.css("transform", "translate(0px, 0px)");
  }
  this.cleanup();
  this.duringDrag = false;
}

CardDrag.isDuringDrag = function () {
  return this.duringDrag;
}