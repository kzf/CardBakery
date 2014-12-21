CardAnimator = {};

Template.cardAnimate.rendered = function(){
  var template = this;

  template._animation_helper_parentNode = this.firstNode.parentNode;

  template._animation_helper_parentNode._uihooks = {
    insertElement: function (node, next) {
      var $node = $(node);

      $node.insertBefore(next);

      $node.css("transition", "none");
      $node.css("transform", "translateY(-250px) translateX(80px) rotate(15deg) scale(1.4)");

      Meteor.setTimeout(function() {
        $node.css("transition", "all .3s");
        $node.css("transform", "none");
      }, 300);

    },
    removeElement: function (node) {
      var $node = $(node);

      // Find the one we actually removed
      var index = CardAnimator.justRemovedFromHand;
      var cards = $("#my_hand .card");

      var next;
      console.log(index, cards.length);
      if (index < cards.length - 1) {
        console.log("NOT AT END");
        // fix its properties (opacity, transform)
        next = $(cards[index]);

        // adjust properties of neighbours
        next.addClass("notransition");
        next.css("opacity", 1);
        next.css("margin-left", "120px");
      } else {
        console.log("AT END");
        // fix its properties (opacity, transform)
        next = $(cards[index-1]);

        // adjust properties of neighbours
        next.addClass("notransition");
        next.css("opacity", 1);
        next.css("margin-right", "120px");
      }

      // remove end one
      $node.remove();

      // force redraw
      next.width();

      // clean up
      next.removeClass("notransition");

      if (index < cards.length - 1) {
        next.css("margin-left", "-40px");
      } else {
        next.css("margin-right", "0px");
      }
      console.log(
      next);

    }
  };
};

Template.boardAnimate.rendered = function(){
  var template = this;

  template._animation_helper_parentNode = this.firstNode.parentNode;

  template._animation_helper_parentNode._uihooks = {
    insertElement: function (node, next) {
      var $node = $(node);
      var $card = $node.find(".card");

      var index = CardAnimator.playedOnBoardIndex;

      var cards = $("#my_board .card");

      // adjust position of other board pieces;
      cards.each(function(i, el) {
        var $el = $(el);
        $el.addClass("notransition");
        if (i !== index) {
          $el.css("transform", "none");
        } else {
          $el.css("transform", "translateY(-30px)");
          $el.css("opacity", "0");
        }
      });
      if (index === cards.length) {
        $card.css("transform", "translateY(-30px)");
        $card.css("opacity", "0.5");
      }

      console.log(index, cards.length);

      // insert
      $node.insertBefore(next);

      $card.width();

      cards.each(function(i, el) {
        var $el = $(el);
        $el.removeClass("notransition");
        if (i === index) {
          $el.css("transform", "none");
          $el.css("opacity", "1");
        }
      });
      if (index === cards.length) {
        $card.css("transform", "none");
        $card.css("opacity", "1");
      }
      console.log(index, cards.length);

    }
  };
};