

const FILE_MODE = {
    OPEN_OR_CREATE : 'a',
    OPEN: 'ax',
    READ_OR_CREATE: 'a+',
    READ: 'ax+',
    OPEN_FILE_SYNC: 'as',
    OPEN_FILE_APPEND_SYNC: 'as+',
    READ: 'r',
    READ_WRITE: 'r+',
    READ_WRITE_SYNC: 'rs+',
    WRITE_OR_CREATE: 'w',
    WRITE: 'wx',
    RW_CREATE_DEL: 'w+',
    RW: 'wx+'
}

const ENTITY = {
    USERS: '/users'
}

module.exports = {FILE_MODE,ENTITY};
