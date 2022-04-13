require("dotenv").config({ path: __dirname + "/../.env" });

const { MongoClient } = require("mongodb");

const LOGIN = process.env["DB_LOGIN"];
const PASSWORD = process.env["DB_PASSWORD"];
const URL = `mongodb+srv://${LOGIN}:${PASSWORD}@bohdanv2.rlux9.mongodb.net/bohdanv2?retryWrites=true&w=majority`;
const CLIENT = new MongoClient(URL);

const isValidUser = async (login, password) => {
    try {
        await CLIENT.connect();
        let admins = await CLIENT.db().collection("admins");
        
        const user = await admins.findOne({name: login, password: password});
        console.log(user);
        return !!user;
    } catch (e) {   
        console.log(e);
        return false;
    }
};


const getUsers = async () => {
    try {
        await CLIENT.connect();

        let collection = CLIENT.db().collection("users");

        const users = await collection.find().toArray();

        return users;
    } catch (e) {
        console.log(e);
        return [];
    }
}

// const addUsers = async (name, rank) => {
//     try {
//         await CLIENT.connect();
//         let works = await CLIENT.db().collection("works");
//         const user = await works.find({date});
        
//         return !!user;
//     } catch (e) {
//         console.log(e);
//         return false;
//     }
// }

const getWorksByDate = async (date) => {
    try {
        await CLIENT.connect();
        const worksCollection = await CLIENT.db().collection("works");
        const works = await worksCollection.find({date}).toArray();
        
        return works;
    } catch (e) {
        console.log(e);
        return [];
    }
}

const getWorks = async (filter={}) => {
    try {
        await CLIENT.connect();
        const worksCollection = await CLIENT.db().collection("works");
        const works = await worksCollection.find(filter).toArray();

        console.log(works);
        
        return works;
    } catch (e) {
        console.log(e);
        return [];
    }
}

const addWork = async (work) => {
    try {
        await CLIENT.connect();
        const worksCollection = await CLIENT.db().collection("works");
        let status = await worksCollection.insertOne(work)
        
        console.log(status);
    } catch (e) {
        console.log(e);
    }
}

const removeWorkByDateAndTime = async (date, time) => {
    try {
        await CLIENT.connect();
        const worksCollection = await CLIENT.db().collection("works");
        let status = await worksCollection.deleteOne({date: date, time: time})
        
        console.log(status);
    } catch (e) {
        console.log(e);
    }
}

module.exports = { isValidUser, getUsers, addWork, getWorks, removeWorkByDateAndTime };
