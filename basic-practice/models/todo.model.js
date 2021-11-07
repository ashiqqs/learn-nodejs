const mongoos = require('mongoose');

const TodoSchema = mongoos.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    completed: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoos.model('Todo', TodoSchema);