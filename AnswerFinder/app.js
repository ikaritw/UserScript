/*
小學一年級生數學題目一枚：

請從 1 - 10 取出 4 個數字，4 個數字不可重複，總和必須為 15。例如：1, 2, 3, 9。

ref http://blog.darkthread.net/post-2014-09-21-coding4fun-k-sum-problem.aspx
ref https://www.facebook.com/darkthread.net/posts/573942959400565
ref http://mathworld.wolfram.com/SubsetSumProblem.html

*/
var util = require('util');


var simpleAnswerFinder = function() {
    var answers = [];
    var Sum = 15;
    var MinNumber = 1;
    var MaxNumber = 9;

    this.explore = function() {
        var n1, n2, n3, n4;
        for (n1 = MinNumber; n1 <= MaxNumber; n1++) {
            for (n2 = n1 + 1; n2 <= MaxNumber; n2++) {
                for (n3 = n2 + 1; n3 <= MaxNumber; n3++) {
                    if (n3 == n2 || n3 == n1) {
                        continue;
                    }
                    n4 = Sum - n3 - n2 - n1;
                    if (n4 <= n3) {
                        //需比前一個大
                        continue;
                    }
                    if (n4 < 1) {
                        break; //前3個加起來過大
                    }
                    answers.push(util.format('%s,%s,%s,%s', n1, n2, n3, n4));
                }
            }
        }
    };

    this.output = function() {
        console.log("Done! %s answers found.", answers.length);
        console.log("MaxLength:%s,Sum:%s,MinNumber:%s,MaxNumber:%s", 4, Sum, MinNumber, MaxNumber);
        for (var j = 0; j < answers.length; j++) {
            console.log(answers[j]);
        }
    }

    return this;
};

var advancedAnswerFinder = function(maxLen, sum, min, max) {
    var MaxLength = maxLen || 4;
    var Sum = sum || 15;
    var MinNumber = min || 1;
    var MaxNumber = max || 9;

    var Digits = [];
    var lastDigFixed = false;
    var delta = Sum;
    var Min = MinNumber,
        Max = MaxNumber;
    var Perfect = false;
    var currSum = 0;
    var answers = [];

    this.reset = function() {
        Digits = [];
        lastDigFixed = false;
        delta = Sum;
        Min = MinNumber;
        Max = MaxNumber;
        Perfect = false;
        currSum = 0;
        answers = [];
    };

    this.Set = function(maxLen, sum, min, max) {
        MaxLength = maxLen;
        Sum = sum;
        MinNumber = min;
        MaxNumber = max;

        this.reset();
    };



    this.updateStats = function(sumChange) {
        currSum = currSum + sumChange;

        var currLen = Digits.length; //目前數字長度
        if (currLen == 0) {
            return; //組合已無數字不需重算
        }

        lastDigFixed = (MaxLength - currLen == 1); //最後一位數確定

        delta = Sum - currSum; //目前總和與目標總和的差額
        /*
        delta = Sum - Digits.reduce(function(pv, cv) {
            return pv + cv;
        }, 0);
        */

        Perfect = (MaxLength == currLen && delta == 0); //是否符合要求

        //下個可用數字為為已使用數字之最大者＋1
        var nextNum = Math.max.apply(null, Digits) + 1;

        //若只剩一位且差額在可用數字範圍，以差額為Min；否則取下一可用數字
        Min = (lastDigFixed && delta >= nextNum) ? delta : nextNum;

        //若只剩一位且差額在可用數字範圍內，以差額為Max；否則取數字上限及差額較小者
        Max = (lastDigFixed && delta <= MaxNumber) ? delta : Math.min(MaxNumber, delta);
    };

    this.Push = function(num) {
        Digits.push(num); //將數字放進組合
        this.updateStats(num);
    };

    this.Pop = function() {
        var num = Digits.pop(); //將數字從組合換下來
        this.updateStats(-num);
    };

    this.Explore = function() {
        var min = Min,
            max = Max;
        for (var n = min; n <= max; n++) {
            this.Push(n);
            if (Perfect) {
                answers.push(Digits.join(","));
            } else {
                this.Explore();
            }
            this.Pop();
        }
        return;
    };

    this.output = function() {
        //return util.format('%s,%s,%s,%s', MaxLength, Sum, MinNumber, MaxNumber);
        console.log("Done! %s answers found.", answers.length);
        console.log("MaxLength:%s,Sum:%s,MinNumber:%s,MaxNumber:%s", MaxLength, Sum, MinNumber, MaxNumber);
        for (var i = 0; i < answers.length; i++) {
            console.log(answers[i]);
        }
    };

    return this;
};

//簡易版求解，迴圈數固定
var simpleAnsfinfer = new simpleAnswerFinder();
console.time("simpleAnswerFinder");
simpleAnsfinfer.explore();
console.timeEnd("simpleAnswerFinder");
simpleAnsfinfer.output();


//參數可調整
var ansfinder = new advancedAnswerFinder();

console.time("AnswerFinder1");
ansfinder.Explore();
console.timeEnd("AnswerFinder1");
ansfinder.output();

console.log("------");

ansfinder.Set(3, 15, 1, 9); //9宮格
console.time("AnswerFinder2");
ansfinder.Explore();
console.timeEnd("AnswerFinder2");
ansfinder.output();

console.log("------");

ansfinder.Set(8, 224, 1, 32); //大數
console.time("AnswerFinder3");
ansfinder.Explore();
console.timeEnd("AnswerFinder3");
ansfinder.output();

console.log("------");

//建構時傳參數
var ansfinder2 = new advancedAnswerFinder(3, 15, 1, 9);
console.time("AnswerFinder4");
ansfinder2.Explore();
console.timeEnd("AnswerFinder4");
ansfinder2.output();