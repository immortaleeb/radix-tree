'use strict';

const _ = require('underscore');

function longestPrefixMatch(string, match) {
  let index = 0;

  while (index < string.length && index < match.length && (string.charAt(index) == match.charAt(index))) {
    index++;
  }

  return {
    prefix: string.substr(0, index),
    suffix: string.substr(index)
  };
}

/**
 * Implementation of a node in a radix tree
 */
class Node {
  constructor(exists) {
    this.children = {};
    this.exists = !!exists;
  }

  getLongestPrefix(string) {
    let keys = Object.keys(this.children);
    for (let i = 0; i < keys.length; ++i) {
      let prefix = keys[i],
          child = this.children[prefix],
          match = longestPrefixMatch(prefix, string);

      if (match.prefix.length > 0) {
        match.string = prefix;
        return match;
      }
    }

    return null;
  }

  isLeaf() {
    return _.size(this.children) == 0;
  }
}

module.exports = Node;
