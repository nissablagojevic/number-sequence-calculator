;(function ($, win, doc, und) {
	
	function sequenceCalculator() {
		this.init();
	}	
	
	sequenceCalculator.prototype = {
		init: function() {
			$form = $("form");
				
			$form.on("submit", function(e) {
				e.preventDefault();
				
				var $startValue,
					results;

				$("#result-area").html("");
				$startValue = $("form #ns_startValue").val();
				//if number value of startValue is same as parseInt and greater than 0
				if(+$startValue == parseInt($startValue, 10) && +$startValue > 0) {
					results = seqC.calculate.init(+$startValue);
					
					for(var i = 0; i < results.length; i++) {
						if(results[i] === '') {
							results[i] = ['No results.'];
						}						
						$("#result-area").append('<div class="slabel">Sequence ' + (i+1) + ': </div><div class="result">' + results[i].join(', ')  + "</div>");
					}
				}
				else {
					results = "Please input a whole number above 0.";
					var alertBox = '<div data-alert id="error" abindex="0" aria-live="assertive" role="dialogalert">' 
									+ results 
									+ '<button href="#" tabindex="0" class="close" aria-label="Close Alert">&times;</button></div>';
					$("#result-area").append(alertBox).foundation("alert");
				}
            });
		},

		calculate:  {
			init: function(value) {
				var sAll = [],
					sOdds = [],
					sEvens = [],
					sFizzBuzzs = [],
					sFibs = [];
					
				for(var i = 1; i <= value; i++) {
					sAll.push(this.sCount(i));
					sFizzBuzzs.push(this.sFizzBuzz(i));
					
					if(this.sOddEvenCount(i) === "even") {
						sEvens.push(i);
					}
					else {
						sOdds.push(i);
					}
					
					if(this.sFib(i,sFibs)) {
						sFibs.push(i);
					}
				}
				return [sAll, sOdds, sEvens, sFizzBuzzs, sFibs];
			},
		
			sCount: function(value) {
				// count all numbers inclusive
				return value;
			},
			
			sOddEvenCount: function(value) {
				//If even, add to sEvens[], otherwise add to sOdds[]
				if(value%2 === 0) {
					return 'even';
				}
				return 'odd';
			},
			
			sFizzBuzz: function(value) {
				//Fizzbuzz-like sequence creation
				if(value % 15 === 0) {
					return 'Z';
				} 
				else if (value % 3 === 0) {
				    return 'C';
				} 
				else if (value % 5 === 0) {
					return 'E';
				} 
				return value;
			},
			
			sFib: function(value, fibArray) {
				//if we have enough elements in our Fibonacci sequence[4] calculate if previous 2 numbers equal current
				var fibLength = fibArray.length;
				if(fibLength > 1) { 
					if(value - fibArray[fibLength - 1] == fibArray[fibLength - 2]) {
						return value;
					}
				}
				//not enough numbers in the fibonacci yet, add the first 2 as we go
				else {
					return value;
				}
				
				return;
			}

		}
	};
	
	unitTest = {
		init: function() {
			$("#unit-tests").html("");
			$("#unit-tests").append("UI tests ... " + ((this.testUI.init()) ? "PASSED" : "FAILED") + "<br/>");
			$("#unit-tests").append("Calculate tests ... " + ((this.testCalculate.init()) ? "PASSED" : "FAILED") + "<br/>");
		},
		
		clearForm: function() {
			$("#result-area").html("");
			$("input[type='text']").val("");
		},
		
		compareArrays: function(actualResult, expectedResult) {
			if(actualResult.length == expectedResult.length) {
				for(var i = 0; i < actualResult.length; i++) {
					if(actualResult[i] !== expectedResult[i]) {
						return false;
					}
				}
				return true;
			}
			return false;
		},
		
		testUI: {
			init: function() {
				var calcInput = [-5, 0, 3.2, 4, 5, 'a', ' ', null, '"', 1];		
				if(this.validResult(calcInput)
					&& this.returnsAlert(calcInput))  {
						return true;
					}
				return false;
			},
			validResult: function(array) {
				var uiExpectedResult,
					uiActualResult = [];

				//Test 1: Whether UI gives results only for valid values
				uiExpectedResult = [false, false, false, true, true, false, false, false, false, true];

				for(var i = 0; i < array.length; i++) {			
					$("form #ns_startValue").val(array[i]);
					$form.submit();

					//valid result will always have 5 sequences
					if($(".result").length === 5) {
						//sequences are never empty text
						if($(".result").eq(0).text().length !== 0) {
							uiActualResult.push(true);
						}
						else {
							uiActualResult.push(false);
						}
					}
					else {
						uiActualResult.push(false);
					}
				}

				unitTest.clearForm();
				
				return unitTest.compareArrays(uiActualResult, uiExpectedResult);
			},
			returnsAlert: function(array) {
				var uiExpectedResult,
					uiActualResult = [];
					
				uiExpectedResult = [true, true, true, false, false, true, true, true, true, false];
					
				for(var i = 0; i < array.length; i++) {			
					$("form #ns_startValue").val(array[i]);
					$form.submit();

					//valid result will always have 5 sequences
					if($("#error").length !== 0) {
						//errors are never empty text
						if($("#error").text().length !== 0) {
							uiActualResult.push(true);
						}
						else {
							uiActualResult.push(false);
						}
					}
					else {
						uiActualResult.push(false);
					}
				}
				
				unitTest.clearForm();
					
				//Test 2: Similar to test 1, but making sure our error is coming up
				return unitTest.compareArrays(uiActualResult, uiExpectedResult);
			}
		},
		testCalculate: {
			init: function() {
				var calcInput = [-5, 0, 3.2, 4, 5, 'a', ' ', null, '"', 1];
				
				if(this.testCount(calcInput) 
					&& this.testOddEven(calcInput)
					&& this.testOddEven(calcInput)
					&& this.testFizzBuzz(calcInput)
					&& this.testFib(calcInput)) {
						return true;
					}
				return false;
			},
			testCount: function(array) {
				var countResult = [];
				var expectedResult = [-5, 0, 3.2, 4, 5, 'a', ' ', null, '"', 1];
				for(var i = 0; i < array.length; i++) {
					countResult.push(seqC.calculate.sCount(array[i]));
				}
				return unitTest.compareArrays(countResult, expectedResult);
			},
			testOddEven: function(array) {
				var countResult = [];
				var expectedResult = ['odd', 'even', 'odd', 'even', 'odd', 'odd', 'even', 'even', 'odd', 'odd'];
				for(var i = 0; i < array.length; i++) {
					countResult.push(seqC.calculate.sOddEvenCount(array[i]));
				}
				return unitTest.compareArrays(countResult, expectedResult);
			},
			testFizzBuzz: function(array) {
				var countResult = [];
				var expectedResult = ['E', 'Z', 3.2, 4, 'E', 'a', 'Z', 'Z', '"', 1];
				for(var i = 0; i < array.length; i++) {
					countResult.push(seqC.calculate.sFizzBuzz(array[i]));
				}
				return unitTest.compareArrays(countResult, expectedResult);
			},
			testFib: function(array) {
				var countResult = [];
				var expectedResult = [[], [], [1,2,3], [1,2,3], [1,2,3,5], [], [], [], [], [1]];
				var multiArrayTest = true;
				for(var i = 0; i < array.length; i++) {
					
					var tFib = [];
					for(var j = 1; j <= array[i]; j++) {
						if(seqC.calculate.sFib(j,tFib)) {
							tFib.push(j);
						}
					}
					
					countResult.push(tFib);
				}

				for(var i = 0; i < expectedResult.length; i++) {
					if(!unitTest.compareArrays(countResult[i], expectedResult[i])) {
						multiArrayTest = false;
					}
				}

				return multiArrayTest;
			}
		}
	};
	
	win.sequenceCalculator = sequenceCalculator;
	
})(jQuery, window, document);

jQuery(function() { seqC = new sequenceCalculator(); });


	
