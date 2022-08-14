const e = require('express');
const {MongoClient} = require('mongodb');
const userModel = require("../scripts/models/userModel")
var bcrypt = require("bcryptjs");
const { request } = require('express');


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
async function returnSpeedData(){
    try{
        let result = await client.db("AdminDB").collection('testData').find()
        result=await result.toArray()
        let speedData=[]
        result.map(x=>{
          speedData.push(x.Speed)
        })
        console.log(speedData)
        return speedData
    }catch(e){
        console.log("Data retrieval failed")
        return -1
    }
  }
  returnResultData()
  async function returnResultData(){
    try{
        let result = await client.db("AdminDB").collection('resultData').find()
        result=await result.toArray()
        let resultDataPoints=[]
        result.map(x=>{
          resultDataPoints.push(x.Energy) //Energy Consumption //(kWh)
        })
        console.log('hi',resultDataPoints)
        return resultDataPoints
    }catch(e){
        console.log("Data retrieval failed")
        return -1
    }
  }

  async function returnTimeData(){
    try{
        let result = await client.db("AdminDB").collection('testData').find()
        result=await result.toArray()
        let timeData=[]
        result.map(x=>{
          timeData.push(x.Time)
        })
        console.log(timeData)
        return timeData
    }catch(e){
        console.log("Data retrieval failed")
        return -1
    }
  }
  async function returnAltitude(){
    try{
        let result = await client.db("AdminDB").collection('testData').find()
        result = await result.toArray()
        let altitudeData=[]
        result.map(x=>{
          altitudeData.push(x.Altitude)
        })
        console.log(altitudeData)
        return altitudeData
    }catch(e){
        console.log("Data retrieval of Altitude failed")
        return -1
    }
  }

  async function returnLongitude(){
    try{
      let result = await client.db("AdminDB").collection('testData').find()
      result=await result.toArray()
      let speedData=[]
      result.map(x=>{
        speedData.push(x.Longitude)
      })
      console.log(speedData)
      return speedData
  }catch(e){
      console.log("Data retrieval failed")
      return -1
  }
  }
  async function returnLatitude(){ 
    try{
      let result = await client.db("AdminDB").collection('testData').find()
      result=await result.toArray()
      let speedData=[]
      result.map(x=>{
        speedData.push(x.Latitude)
      })
      console.log(speedData)
      return speedData
  }catch(e){
      console.log("Data retrieval failed")
      return -1
  }
  }

  async function returnCoordinateData(){
    try{
      let result = await client.db("AdminDB").collection('testData').find()
      result=await result.toArray()
      let speedData=[]
      result.map(x=>{
        temp = x.Latitude + "," + x.Longitude
        speedData.push(temp)
      })
      console.log(speedData)
      return speedData
  }catch(e){
      console.log("Data retrieval failed")
      return -1
  }
  }
  async function registerNewUser(user){
    try{
        client.db("AdminDB").collection('userLogins').insertOne({
           user
          })
    }catch(e){
        console.log("Registration failed")
        return -1
    }
    return 1
  }

  async function confirmNewUser(confirmationCode){
    const query = {'user.confirmationCode': confirmationCode };
    try{
       let result = await client.db("AdminDB").collection('userLogins').findOneAndUpdate(query, { $set: { 'user.status': 'Active' }})
       if(result.value != null){
        return 1
       }else if(result.value == null){
        return -1
       }
  }catch(e){
      console.log("account confirmation failed")
      return -1
  }
  }

  async function loginUser(user){
    const query = {'user.username': user.username};
    try{
        let result = await client.db("AdminDB").collection('userLogins').findOne(query)
        const validPassword = await bcrypt.compare(user.password, result.user.password);
        if(validPassword == true && result.user.status == 'Active'){
            return result.user.confirmationCode
        }else{
            return -1
        }
    }catch(e){
        console.log("login failed")
        return -1
    }
  }

  async function retrieveAllAccounts(){
    try{
      let result = await client.db("AdminDB").collection('userLogins').find()
      let temp  = result.toArray()
      return temp
    }catch(e){

    }
  }

  async function hasAdminAccess(ID){
    const query = {'user.confirmationCode': ID };
    try{
       let result = await client.db("AdminDB").collection('userLogins').findOne(query)
       if(result.user.level == 'admin'){
        return true
       }else{
        return false
       }
  }catch(e){
      console.log("account access failed")
      return false
  }
  }

  async function deleteUserAccount(ID){
    const query = {'user.email': ID };
    let result = await client.db("AdminDB").collection("userLogins").deleteOne(query)
    return result
  }


  async function makeUserAdmin(ID){
    const query = {'user.username': ID };
    let result = await client.db("AdminDB").collection('userLogins').findOneAndUpdate(query, { $set: { 'user.level': 'admin' }})
    if(result){
      return true
    }else{
      return false
    }
  }


  async function getallDrivers(){
    try{
      let result = await client.db("Driver").collection("Drivers").find()
      let temp = await result.toArray()
      let namesOnly = []
      temp.map(x=>{
          console.log(x.driver)
          namesOnly.push(x.driver)
      })
      return namesOnly
    }catch(e){
      console.log("Eish Error")
      console.log(e)
      return -1 
    }
    
  }


  async function deleteDriver(ID){
    try{
      const query = {'driver.driverID':  ID};
      let result = await client.db("Driver").collection("Drivers").findOneAndUpdate(query, { $set: { 'driver.employement': 'fired' }})
      return result.lastErrorObject.updatedExisting
    }catch(e){
      console.log("Error deleting driver: ", e)
      return -1 
    }
    
  }

  async function addDriver(driver){
    try{
      await client.db("Driver").collection('Drivers').insertOne({
         driver
        })
  }catch(e){
      console.log("Driver creation failed")
      return -1
  }
  return 1
  }

  //Car section
  async function getAllCars(){
    try{
      let result = await client.db("Car").collection("Cars").find()
      let temp = await result.toArray()
      let namesOnly = []
      temp.map(x=>{
          namesOnly.push(x.Car)
      })
      console.log(namesOnly,'jiiii')
      return namesOnly
    }catch(e){
      console.log("Eish Error")
      console.log(e)
      return -1 
    }

  }
  async function returnCarsMass(){
    try{
      let result = await client.db("Car").collection("Cars").find()
      let temp = await result.toArray()
      let massArray = []
      temp.map(x=>{
          massArray.push(x.Car.mass)
      })
      console.log('kii',massArray)
      return massArray
    }catch(e){
      console.log("Eish Error")
      console.log(e)
      return -1 
    }

  }
  async function returnCarsArea(){
    try{
      let result = await client.db("Car").collection("Cars").find()
      let temp = await result.toArray()
      let areaArray = []
      temp.map(x=>{
          areaArray.push(x.Car.area)
      })
      console.log('kii area',areaArray)
      return areaArray
    }catch(e){
      console.log("Eish Error")
      console.log(e)
      return -1 
    }

  }
  async function addCar(Car){
    try{
      let result = await client.db("Car").collection('Cars').insertOne({
         Car
        })
        return result
  }catch(e){
      console.log("Car creation failed")
      return -1
  }
    
  }

  async function deleteCar(ID){
    try{
      const query = {'Car.carID':  ID};
      let result = await client.db("Car").collection("Cars").findOneAndUpdate(query, { $set: { 'Car.operation': 'Retired' }})
      console.log("Anyy poggers? ", result.lastErrorObject.updatedExisting)
      return result.lastErrorObject.updatedExisting
    }catch(e){
      console.log("Error deleting driver: ", e)
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


  module.exports = {connectToDB, closeConnection, registerNewUser, loginUser, confirmNewUser, retrieveAllAccounts, hasAdminAccess, deleteUserAccount,makeUserAdmin,returnSpeedData, returnCoordinateData, returnTimeData, getallDrivers, addDriver, deleteDriver
  , addCar, getAllCars, deleteCar,returnAltitude, returnLatitude,returnLongitude, returnResultData, returnCarsMass, returnCarsArea};
