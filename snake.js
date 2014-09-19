var snake = {
    position: -1,
    segments: [],
    color: new Color('white'),
    x: -1,
    y: -1,
    direction: '',
};

var food = {
    position: -1,
    color: new Color('yellow'),
    x: -1,
    y: -1,
};

var tweenedValues = {
    hue: 0
};

var color = new Color();
var game_over = false;
var debug = false;

return {
    init: function(display,timeline) {

              this.display = display;
              display.clear();

              display.tween(tweenedValues,{
                  to: {lightness: 1},
                  duration: 50000,
                  repeat: Infinity,
                  yoyo: true,
                  delay: 10000000,
                  easing: TWEEN.Easing.Cubic.InOut
              });

              snake.generate_pos = function(){
                  snake.position = Math.floor(Math.random()*96);
                  snake.x = snake.position % (display.cols);
                  snake.y  = Math.floor(snake.position/display.cols);
                  snake.segments = [];
                  snake.direction = '';
              };

              food.generate_pos = function(){
                  food.position = Math.floor(Math.random()*96);
                  food.x = food.position % (display.cols);
                  food.y  = Math.floor(food.position/display.cols);
              };

              snake.inc_x = function(){
                  display.setColor(snake.position, new Color('black'));
                  snake.segments.unshift(snake.position);
                  snake.position += 1;
                  snake.segments.pop();
                  snake.x++;
                  snake.direction="right";
              };

              snake.inc_y = function(){
                  display.setColor(snake.position, new Color('black'));
                  snake.segments.unshift(snake.position);
                  snake.position += display.cols;
                  snake.segments.pop();
                  snake.y++;
                  snake.direction="down";
              };

              snake.dec_x = function(){
                  display.setColor(snake.position, new Color('black'));
                  snake.segments.unshift(snake.position);
                  snake.position -= 1;                        
                  snake.segments.pop();
                  snake.x--;
                  snake.direction="left";
              };

              snake.dec_y = function(){
                  display.setColor(snake.position, new Color('black'));
                  snake.segments.unshift(snake.position);
                  snake.position -= display.cols;
                  snake.segments.pop();
                  snake.y--;
                  snake.direction="up";
              };

              food.generate_pos();
              snake.generate_pos();

              if (debug) {
                  console.log(
                          "index: \t\t" + snake.position + 
                          "\ncolumn: \t" + snake.x + 
                          "\nrow \t\t" + snake.y
                          );

                  console.log(
                          "\t0 1 2 3 4 5 6 7 8 9 A B"
                          );

                  var line = "";
                  for(var i = 0; i < 96; i++){ 
                      if (i == snake.position){
                          line = line + "S ";
                      } else if (i == food.position) {
                          line = line + "@ ";
                      } else {
                          line = line + "x ";   
                      }

                      if ((i + 1) % display.cols == 0 && i != 0) {
                          console.log(((i + 1) / display.cols) - 1 + "\t" + line);
                          line = "";
                      }
                  }
              }

              display.setColor(food.position, food.color);
              display.setColor(snake.position, snake.color);

          },

        onUpdate: function(display, data) {

          if (game_over) {
              console.log('game over');
              game_over = false;
              snake.generate_pos();
              food.generate_pos();
              clear('black');
              redraw(snake);
              redraw(food);
              console.log('end');

          } else {
              if (snake.x == food.x && snake.y == food.y) {
                  display.setColor(food.position, new Color('black'));
                  snake.segments.unshift(snake.position);
                  clear('black');
                  redraw(snake);
                  snake.length++;
                  food.generate_pos();
                  redraw(food);
              } else {
                  if (snake.x < food.x) {
                      if (snake.direction != "left") {
                          snake.inc_x();
                      } else {
                          // Better logic
                      }
                  } else if (snake.x > food.x) {
                      if (snake.direction != "right") {
                          snake.dec_x();
                      } else {
                          // Better logic
                      }
                  } else if (snake.y < food.y) {
                      if (snake.direction != "up") {
                          snake.inc_y();
                      } else {
                          // Better logic
                      }
                  } else if (snake.y > food.y) {
                      if (snake.direction != "down") {
                          snake.dec_y();
                      } else {
                          // Better logic
                      }
                  }
                  clear('black');
                  if (snake_collision()){
                      game_over = true;
                  } else {
                      redraw(food);
                      redraw(snake);
                  }
              }
          }

          function clear(clear_color){
              for(var i = 0; i < display.cols * display.rows; i++){
                  display.setColor(i, new Color(clear_color));
              }
          }

          function redraw(obj) {
              display.setColor(obj.position, obj.color);
              if (obj.hasOwnProperty('segments')) {
                  for (var i = 0; i < obj.segments.length; i++){
                      display.setColor(obj.segments[i],obj.color)
                  }
              }
          }
          function snake_collision(){
              for (var i = 0; i < snake.segments.length; i++){
                  if (snake.segments[i] == snake.position){
                      return true;
                  }
              }

              return false;
          }
      }
};
