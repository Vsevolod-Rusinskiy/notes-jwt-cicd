db.createUser({
    user: 'root',
    pwd: 'example',
    roles: [{
        role: 'readWrite',
        db: 'admin'
    }]
});

db = new Mongo().getDB("database");
db.createUser({
    user: 'user',
    pwd: 'password',
    roles: [{
        role: 'readWrite',
        db: 'database'
    }]
});
