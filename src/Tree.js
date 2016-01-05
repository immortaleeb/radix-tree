'use strict';

const Node = require('./Node'),
      _ = require('underscore');

/**
 * Provides the implementation of a radix tree
 */
class Tree {
  // Creates a new instance
  constructor(strings) {
    this.root = new Node();
    this._size = 0;
    strings && strings.forEach(string => this.insert(string));
  }

  // Returns the number of unique strings stored in the tree
  size() {
    return this._size;
  }

  // Inserts a string into the tree
  insert(string) {
    let currentNode = this.root, match;

    while (string.length > 0) {
      match = currentNode.getLongestPrefix(string);

      if (match) {
        // Check if we need to go deeper
        if (match.prefix.length == match.string.length) {
          // We need to search deeper in the tree
          currentNode = currentNode.children[match.string];
          string = string.substr(match.string.length);
        } else {
          // We need to insert an additional node
          let newNode = new Node();
          newNode.children[match.suffix] = currentNode.children[match.string];
          newNode.children[string.substr(match.prefix.length)] = new Node(true);
          delete currentNode.children[match.string];
          currentNode.children[match.prefix] = newNode;
          this._size++;
          return;
        }
      } else {
        // We need to insert here
        currentNode.children[string] = new Node(true);
        this._size++;
        return;
      }
    }

    // Current node should exist
    currentNode.exists = true;
  }

  // Returns true if the given string exists in the tree
  contains(string) {
    let currentNode = this.root, match;

    while (string.length > 0) {
      match = currentNode.getLongestPrefix(string);

      // If no prefixes match the edge, its definetly not in the tree
      if (!match || match.prefix.length != match.string.length)
        return false;

      // Otherwise, go deeper in the tree
      currentNode = currentNode.children[match.string];
      string = string.substr(match.string.length);
    }

    return currentNode.exists;
  }

  _iterate(currentNode, path, callback) {
    if (currentNode.exists) callback(path.join(''));

    // Iterate recursively depth first
    _.each(currentNode.children, (child, prefix) => {
      path.push(prefix);
      this._iterate(child, path.slice(0), callback);
      path.pop(prefix);
    });
  }

  // Iterates over all strings in the tree
  forEach(callback) {
    //callback = (string) => { console.log(string); callback(string); };
    this._iterate(this.root, [], callback);
  }
}

module.exports = Tree;
