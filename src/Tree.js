'use strict';

/**
 * Provides the implementation of a radix tree
 */
class Tree {
  // Creates a new instance
  constructor(strings) {
    strings && strings.forEach(string => this.insert(string));
  }

  // Inserts a string into the tree
  insert(string) {
    throw new Error('Not yet implemented');
  }

  // Returns true if the given string exists in the tree
  contains(string) {
    throw new Error('Not yet implemented');
  }

  // Iterates over all strings in the tree
  forEach(callback) {
    throw new Error('Not yet implemented');
  }
}

module.exports = Tree;
