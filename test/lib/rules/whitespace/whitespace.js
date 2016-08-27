/**
 * @fileoverview Tests for whitespace rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var should = require ('should');
var Solium = require ('../../../../lib/solium'),
	fs = require ('fs'),
	path = require ('path');

var userConfig = {
  "custom-rules-filename": null,
  "rules": {
    "whitespace": true
  }
};

describe ('[RULE] whitespace: Acceptances', function () {

	it ('should allow function / event calls with 0 args only if the name is followed by "()"', function (done) {
		var code = 'func ();',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should allow function / event calls with no extraneous whitespace', function (done) {
		var code = 'spam(ham[1], Coin({name: "ham"}));',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should allow single-line function body to have 1 extraneous space on either side', function (done) {
		var code = 'function singleLine() { spam(); }',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		//it is fine EVEN IF there is no extraneous space
		code = 'function singleLine() {spam();}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should allow code which doesn\'t have whitespace immediately before a comma or semicolon', function (done) {
		var code = 'function spam(uint i, Coin coin);',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should allow exactly 1 space on either side of an assignment operator', function (done) {
		var code = 'x = 100; y = "hello world"; string exa = "bytes";',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

});


describe ('[RULE] whitespace: Rejections', function () {

	it ('should reject function / event calls with 0 args if the name is followed by brackets with whitespace between them', function (done) {
		var code = 'func ( );',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'func (\t);';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'func (\n);';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});

	it ('should reject function / event calls with having extraneous whitespace', function (done) {
		var code = 'spam( ham[ 1 ], Coin( { name: "ham" } ) );',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (8);

		Solium.reset ();
		done ();
	});

	/*it ('should reject code which has whitespace immediately before a comma or semicolon', function (done) {
		var code = 'function spam(uint i , Coin coin) ;',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		code = '[1 , 2, 3 , 4,5];',
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		code = 'call (10\t, 20, 30 ,40,50);',
		errors = Solium.lint (code, userConfig);
		
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		code = 'call ({name: "foo" , age: 20,id: 1 ,dept: "math"})',
		errors = Solium.lint (code, userConfig);
		
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		code = 'var x  , y,z\t,  foo;',
		errors = Solium.lint (code, userConfig);
		
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		code = 'var (x  , y,z\t,  foo) = (1 ,2 ,3 ,4)',
		errors = Solium.lint (code, userConfig);
		
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (5);

		/*code = 'var (x  , y,z\t,  foo) = (1,2,3,4)',
		errors = Solium.lint (code, userConfig);
		
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);*

		Solium.reset ();
		done ();
	});*/

	it ('should reject assignment operators that do not have exactly 1 space on either side of them', function (done) {
		var code = [
			'x             = 1;',
			'y =             1;',
			'string exa\t=\t"bytes";',
			'uint a = \t20;',
			'uint c\t=190;',
			'string octa\n= "gon";',
			'bytes32 hexa="gon";',
			'address mine= 0x0;',
			'address his =0x1;'
		];
		var errors;

		errors = Solium.lint (code [0], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		errors = Solium.lint (code [1], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		errors = Solium.lint (code [2], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		errors = Solium.lint (code [3], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		errors = Solium.lint (code [4], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		errors = Solium.lint (code [5], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		errors = Solium.lint (code [6], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		errors = Solium.lint (code [7], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		errors = Solium.lint (code [8], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});

});