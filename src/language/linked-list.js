class _Node {
    constructor(value, next) {
        this.value = value;
        this.next = next;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    insertFirst(item) {
        this.head = new _Node(item, this.head);
    }

    insertLast(item) {
        if (this.head === null) {
            this.insertFirst(item);
        }
        else {
            let tempNode = this.head;
            while (tempNode.next !== null) {
                tempNode = tempNode.next;
            }
            tempNode.next = new _Node(item, null);
        }
    }

    insertBefore(item, key) {
        if (this.head === null) { // if head is null return empty 
          this.insertFirst(item);
          return;
        }
        let current = this.head; // As I walk through the list, current is holding the current node
        let previous = null;
        while ((current !== null) && (current.value !== key)) { // As long as I have not reached the end of the list and the current value is not the key that im looking for
          previous = current;
          current = current.next;
        }
        if (previous === null) {
          this.head = new _Node(item, current.next); // insert node 
        } else {
          previous.next = new _Node(item, current);
        }
    }

    insertAfter(item, key) {
        if (this.head === null) {
          this.insertFirst(item);
        }
        let current = this.head;
    
        let previous = this.head;
    
        while ((current !== null) && (previous.value !== key)) {
          previous = current;
          current = current.next;
        }
        previous.next = new _Node(item, current);
    }

    insertAt(nthPosition, itemToInsert) {
        if (nthPosition < 0) {
            throw new Error('Position error');
        }
        if (nthPosition === 0) {
            this.insertFirst(itemToInsert);
        }else {
            // Find the node which we want to insert after
            const node = this._findNthElement(nthPosition - 1);
            const newNode = new _Node(itemToInsert, null);
            newNode.next = node.next; 
            node.next = newNode;
        }
    }

    _findNthElement(position) {
        let node = this.head;
        for (let i=0; i<position; i++) {
            node = node.next;
        }
        return node;
    }
    

    find(item) { 
        // Start at the head
        let currNode = this.head;
        // If the list is empty
        if (!this.head) {
            return null;
        }
        // Check for the item 
        while (currNode.value !== item) {
            /* Return null if it's the end of the list 
               and the item is not on the list */
            if (currNode.next === null) {
                return null;
            }
            else {
                // Otherwise, keep looking 
                currNode = currNode.next;
            }
        }
        // Found it
        return currNode;

    }

    remove(item){ 
        // If the list is empty
        if (!this.head) {
            return null;
        }
        // If the node to be removed is head, make the next node head
        if (this.head.value === item) {
            this.head = this.head.next;
            return;
        }
        // Start at the head
        let currNode = this.head;
        // Keep track of previous
        let previousNode = this.head;

        while ((currNode !== null) && (currNode.value !== item)) {
            // Save the previous node 
            previousNode = currNode;
            currNode = currNode.next;
        }
        if (currNode === null) {
            console.log('Item not found');
            return;
        }
        previousNode.next = currNode.next;
    }

    displayList(){
        let list = "";
        let currNode = this.head;
        while (currNode !== null) {
            list += `${currNode.value.id} => `;
            currNode = currNode.next;
        }
        console.log(list)
    }

}

module.exports = LinkedList;