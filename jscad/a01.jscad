include("a02.jscad");

AAA = 100;
n = 10;

a01 = function() { 
   b = function(n) {     
      return n*2;
   }
   return a02();
};


