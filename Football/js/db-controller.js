playerplayerconst idbPromised = idb.open('players_database', 1, upgradedDb => {
    if (!upgradedDb.objectStoreNames.contains('players')) {
        upgradedDb.createObjectStore("players", {keyPath: "bookId"});
    }
});

const dbGetAllPlayer = () => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("players", `readonly`);
            return transaction.objectStore("players").getAll();
        }).then(data => {
            if (data !== undefined) {
                resolve(data)
            } else {
                reject(new Error("Favorite not Found"))
            }
        })
    })
};

const dbInsertPlayer = player => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("players", `readwrite`);
            transaction.objectStore("players").add(player);
            return transaction;
        }).then(transaction => {
            if (transaction.complete) {
                resolve(true)
            } else {
                reject(new Error(transaction.onerror))
            }
        })
    })
};

const dbDeletePlayer = bookId => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("players", `readwrite`);
            transaction.objectStore("players").delete(bookId);
            return transaction;
        }).then(transaction => {
            if (transaction.complete) {
                resolve(true)
            } else {
                reject(new Error(transaction.onerror))
            }
        })
    })
};
