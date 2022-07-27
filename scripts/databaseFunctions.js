const {MongoClient} = require('mongodb');
let connectionString = "mongodb+srv://city-energy:city-energy@cluster0.utc0s.mongodb.net/?retryWrites=true&w=majority"

async function connectToDB(){
    let client = new MongoClient(connectionString);
    try{
      await client.connect();
      databasesList = await client.db().admin().listDatabases();
      console.log("Databases:");
      databasesList.databases.forEach(db => console.log(` - ${db.name}`));
      return client
    }catch(e){
      console.log("Failed to connect to DB")
    }
  }


  async function closeConnection(db){
    try{
        await db.close()
    }catch(e){
        console.log("Error in terminating the connection to db")
    }
  }


  module.exports = {connectToDB, closeConnection};