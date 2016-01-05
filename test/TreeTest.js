'use strict';

const chai = require('chai'),
      should = chai.should(),
      fs = require('fs'),
      Tree = require('../src/Tree');

// Location of the system's dictionary
const DICT_FILE = '/usr/share/dict/words';

describe('Tree', () => {
  describe('#constructor()', () => {
    it('should add strings from array', () => {
      let tree = new Tree(['abc', 'def']);
      tree.contains('abc').should.equal(true);
      tree.contains('def').should.equal(true);
    });
  });

  describe('#contains()', () => {
    it('should return false on an empty tree', () => {
      let tree = new Tree();
      tree.contains('a').should.equal(false);
      tree.contains('ba').should.equal(false);
      tree.contains('cba').should.equal(false);
    });

    it('should not contain a prefix of an inserted word', () => {
      let tree = new Tree();
      tree.insert('abc');
      tree.contains('a').should.equal(false);
      tree.contains('ab').should.equal(false);
    });

    it('should find prefixes of words when inserted', () => {
      let tree = new Tree();
      tree.insert('abc');
      tree.insert('abcd');
      tree.contains('abc').should.equal(true);
      tree.contains('abcd').should.equal(true);
    });
  });

  describe('#insert()', () => {
    it('should insert a single letter', () => {
      let tree = new Tree();
      tree.insert('a');
      tree.contains('a').should.equal(true);
    });

    it('should insert multiple letters', () => {
      let tree = new Tree();
      tree.insert('a');
      tree.insert('d');
      tree.insert('z');
      tree.contains('a').should.equal(true);
      tree.contains('d').should.equal(true);
      tree.contains('z').should.equal(true);
    });

    it('should insert a single word', () => {
      let tree = new Tree();
      tree.insert('word');
      tree.contains('word').should.equal(true);
    });

    it('should insert multiple non-overlapping words', () => {
      let tree = new Tree();
      tree.insert('abc');
      tree.insert('dbk');
      tree.contains('abc').should.equal(true);
      tree.contains('dbk').should.equal(true);
    });

    it('should insert multiple overlapping words', () => {
      let tree = new Tree();
      tree.insert('abcd');
      tree.insert('abce');
      tree.contains('abcd').should.equal(true);
      tree.contains('abce').should.equal(true);
    });
  });

  describe('#forEach()', () => {
    it('should loop over all strings in a tree', () => {
      let strings = ['abc', 'def', 'ghi', 'jkl'],
          counted = [0, 0, 0, 0],
          tree = new Tree(strings);
      tree.forEach(string => {
        let index = strings.indexOf(string);
        index.should.be.above(-1);

        let count = ++counted[index];
        count.should.equal(1);
      });
    });
  });

  describe('dictionary test', () => {
    it('should loop over all words in the dictionary', function(done) {
      // disable timeout, cause this might take a while
      this.timeout(0);

      let tree = new Tree();
      console.log('reading file');
      fs.readFile(DICT_FILE, 'utf8', (err, data) => {
        if (err) throw err;
        console.log('splitting words');
        let words = data.split('\n'),
            counted = new Map();

        console.log('inserting words');
        words.forEach(word => tree.insert(word));
        console.log('checking words');
        words.forEach(word => tree.contains(word).should.equal(true));
        console.log('looping words');
        tree.forEach(word => {
          should.equal(counted.get(word), undefined);
          counted.set(word, true);
        });

        done();
      });
    });
  });
});
