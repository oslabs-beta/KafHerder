class Topic {
    constructor (name, partitionEnds){
        this.name = name;
        this.partitions = {}; // key: partitionNumber, value: Partition object
        this.consumerOffsetConfigs = {}; // key: config, value: array of partitions that have it
        this.numConfigs = 0;
        this.partitionEnds = partitionEnds;
        this.addEnds();
    }

    addConsumerOffset(partitionNumber, offset, consumerGroupId){
        if (!this.partitions[partitionNumber]){
            this.partitions[partitionNumber] = new Partition(partitionNumber);
        }
        this.partitions[partitionNumber].consumerOffsetLL.add(offset, consumerGroupId);
    }

    addEnds(){ // this adds the __end nodes to the linkedlists
        for (const partitionEnd of this.partitionEnds){
            const { partition, high } = partitionEnd;
            this.addConsumerOffset(partition, high, '__end');
        }
    }

    getAllConsumerOffsetConfigs(){
        for (const [partitionNumber, partition] of Object.entries(this.partitions)){
            const config = partition.getConsumerOffsetConfig();

            if (!this.consumerOffsetConfigs[config]){
                this.consumerOffsetConfigs[config] = [];
            }
            this.consumerOffsetConfigs[config].push(partitionNumber);
        }
        this.numConfigs = Object.keys(this.consumerOffsetConfigs).length;
        return this.consumerOffsetConfigs;
    }
}

class Partition {
    constructor (partitionNumber){
        this.partitionNumber = partitionNumber; // probably unnecessary
        this.consumerOffsetLL = new ConsumerOffsetLL;
        // this.length should be defined
        // then this.consumerOffsetLL.add(String(this.length), '__end')
        // this.consumerOffsetConfig = '';
    }

    // Method to generate string representing all the offsets in the list
    getConsumerOffsetConfig() {
        let consumerOffsetConfig = 'config:';
        let currentNode = this.consumerOffsetLL.head;
        while (currentNode !== null) {
            consumerOffsetConfig += `-${currentNode.consumerGroupId}`;
            currentNode = currentNode.next;
        };
        return consumerOffsetConfig;
    }
}

class ConsumerOffsetLL {
    constructor (){
        this.head = null;
        this.tail = null;
    }

    // Method to add a new node to the linked list in sorted order
    add(offset, consumerGroupId) {
        const newNode = new ConsumerOffsetNode(offset, consumerGroupId);
        const numericOffset = parseInt(offset, 10);

        const shouldInsertBefore = (a, b) => {
            if (a.consumerGroupId === '__end') return false;
            if (b.consumerGroupId === '__end') return true;
            return a.consumerGroupId > b.consumerGroupId;
        };

        if (this.head === null || 
            parseInt(this.head.offset, 10) > numericOffset || 
            (parseInt(this.head.offset, 10) === numericOffset && shouldInsertBefore(this.head, newNode))) {
            newNode.next = this.head;
            this.head = newNode;
            if (this.tail === null) {
                this.tail = newNode;
            }
            return;
        }

        let currentNode = this.head;
        while (currentNode.next !== null &&
               (parseInt(currentNode.next.offset, 10) < numericOffset ||
               (parseInt(currentNode.next.offset, 10) === numericOffset && 
               !shouldInsertBefore(currentNode.next, newNode)))) {
            currentNode = currentNode.next;
        }

        newNode.next = currentNode.next;
        currentNode.next = newNode;
        if (newNode.next === null) {
            this.tail = newNode;
        }
    }
}

class ConsumerOffsetNode {
    constructor (offset, consumerGroupId){
        this.next = null;
        this.offset = offset; // THIS IS A STRING for consistency with KafkaJS
        this.consumerGroupId = consumerGroupId; // string
    }
}

module.exports = {
    Topic,
    Partition,
    ConsumerOffsetLL,
    ConsumerOffsetNode
}