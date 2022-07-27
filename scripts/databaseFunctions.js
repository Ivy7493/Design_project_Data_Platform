const e = require('express');
const {MongoClient} = require('mongodb');
let connectionString = "mongodb+srv://city-energy:city-energy@cluster0.utc0s.mongodb.net/?retryWrites=true&w=majority"
let client = new MongoClient(connectionString);
client.connect()
async function connectToDB(){
    let client = new MongoClient(connectionString);
    try{
      await client.connect();
      connection = client
      return client
    }catch(e){
      console.log("Failed to connect to DB")
    }
  }

  async function registerNewUser(username,password){
    try{
        client.db("AdminDB").collection('userLogins').insertOne({
            username: username,
            password: password
          })
    }catch(e){
        console.log("Registration failed")
        return -1
    }
    return 1
  }

  async function loginUser(username,password){
    try{
        let result = await client.db("AdminDB").collection('userLogins').count({
            username: username,
            password: password
          })
        console.log("This is what we got from the request")
        console.log("Accounts found: ",result)
        if(result == 0){
            return -1
        }else{
            return 1
        }
    }catch(e){
        console.log("login failed")
        return -1
    }
  }


  async function closeConnection(db){
    try{
        await db.close()
    }catch(e){
        console.log("Error in terminating the connection to db")
    }
  }


  module.exports = {connectToDB, closeConnection, registerNewUser, loginUser};