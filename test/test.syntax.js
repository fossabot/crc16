var should = require('chai').should();
var crc16 = require('../index');
var util = require('./../util/util');

var stream = '3a16070a00000000001a0000';
var sumShouldStr = '98af';
var sumShouldBuf = util.bufferFactory(sumShouldStr, 'hex');
var sumShouldInt = sumShouldBuf.readUInt16BE();
var sumShouldArry = [152, 175];

describe('Syntax to call the apis', function(){
  describe('CheckSum', function(){
    //exception
    it('Should throw an exception when input stream is null', function(){
      (function(){
        crc16.checkSum(null)
      }).should.throw();
    })
    it('Should throw an exception when input stream is invalid', function(){
      (function(){
        crc16.checkSum('qweewq', 'hex')
      }).should.throw();
    })

    //params about input
    it('Stream input should be a hex string and return a string sum by default', function(){
      var sum = crc16.checkSum(stream);
      sum.should.equal(sumShouldStr);
    })
    it('Stream input with encoding', function(){
      var sum = crc16.checkSum(stream, 'hex');
      sum.should.equal(sumShouldStr);
    })
    it('Stream input can be a buffer', function(){
      var sum = crc16.checkSum(util.bufferFactory(stream, 'hex'));
      sum.should.equal(sumShouldStr);
    })

    //params about output
    it('Returned sum can be an unsigned short int', function(){
      var sum = crc16.checkSum(stream, {retType: 'int'});
      sum.should.eql(sumShouldInt);
    })
    it('Returned sum can be a buffer', function(){
      var sum = crc16.checkSum(stream, {retType: 'buffer'});
      Buffer.isBuffer(sum).should.equal(true);
      sum.compare(sumShouldBuf).should.eql(0);
    })
    it('Returned sum can be a decimal numbers array', function(){
      var sum = crc16.checkSum(stream, {retType: 'array'});
      sum.should.eql(sumShouldArry);
    })
    it('Returned sum should be a hex string when option.retType is anything else string', function(){
      var sum = crc16.checkSum(stream, {retType: 'anything else'});
      sum.should.eql(sumShouldStr);
    })
    it('Returned sum should be a hex string when option.retType is not a string', function(){
      var sum = crc16.checkSum(stream, {retType: {foo: 'bar'}});
      sum.should.eql(sumShouldStr);
    })
  })

  describe('verifySum', function(){
    it('Should throw an exception when input stream is null', function(){
      (function(){
        crc16.verifySum(null)
      }).should.throw();
    })
    it('Should throw an exception when input stream is invalid', function(){
      (function(){
        crc16.verifySum('qweewq', 'hex')
      }).should.throw();
    })

    it('Stream input should be a hex string by default', function(){
      var isValid = crc16.verifySum(stream + sumShouldStr);
      isValid.should.equal(true);
    })
    it('Stream input with encoding', function(){
      var isValid = crc16.verifySum(stream + sumShouldStr, 'hex');
      isValid.should.equal(true);
    })
    it('Stream input can be a buffer', function(){
      var isValid = crc16.verifySum(util.bufferFactory(stream + sumShouldStr, 'hex'));
      isValid.should.equal(true);
    })

    it('Should return false when the sum is not matched the stream input', function(){
      var isValid = crc16.verifySum(stream + '7878');
      isValid.should.equal(false);
    })
  })
})


