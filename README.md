# **CITY ENERGY**

| Developers: |
| ----------- |
| Ivan von Staden | 
| Nicolas Criticos | 
| Tristan Basel | 
| Van Niekerk Ferreira | 

## **Description:**

This app has been developed as a minimum viable product for tracking energy consumption in transport systems for companies with vehicle fleets. The main purpose is to provide proof of concept and highlight areas of unanticipated hurdles that may arise.

### **Admin Testing Account Login info:**

Username: Simon
Password: Dawg

### **Main functionality implemented:**

- User can login/register account.
- Admin portal to manage sensitive information.
- Sends confirmation email for account registration.
- Easy navigation throught web-app.
- Input checks and prompt messages to insure correct inputs
- Plot total energy usage for two different vehicles, on the same route.
- Plot energy usage/second, for two drivers, along the same route.
- Kinetic model is used to determine energy usage.
- Fuel model used to determine fuel consumption (not displayed on app).
- Device connection for real data collection.
- Storage of this information for data analytics.
- Control of devices through web-app (backend for MVP).
- Processing and manipulation of data accessed from database (MongoDB).

## **App Link:**

Click the following link to access our application hosted on heroku!

### https://city-energy.herokuapp.com/

- Note: The app is basic and may not include all features discussed under design.
- Note: As of 28 November 2022, heroku will no longer allow free deployment and the link may not work.

## **Development:**

Node.js is used for a web server in conjunction with the Express framework. Socket.io is used for communication.
Data models were created using mongoose, which ensures data entries are precise and cannot contain irrelevant information.


## **Project management:**

Under the project tab of the Git repo, there is a project titled *To Do*, this shows tasks as well as a basic scrum handling of the development process. Sprint 0 was a skeletal development of the app on which features could be added as desired by the development team. For all artifacts of these meetings and project progression, look under the docs file in the repository. Due to the fact that this is a design phase, the developers are aware that a project may be handled slightly differently in implementation as the documentation shows, but as previously mentioned, the main purpose was to provide proof of concept of design.
Sprint 0 lasted much longer than the other sprints as it was the initial setup phase. Thereafter, sprints spanned a week, to ensure tasks were consistently being completed.