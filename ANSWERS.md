## Questions

1. :question: What do we do in the `Server` and `UserController` constructors
to set up our connection to the development database?
2. :question: How do we retrieve a user by ID in the `UserController.getUser(String)` method?
3. :question: How do we retrieve all the users with a given age 
in `UserController.getUsers(Map...)`? What's the role of `filterDoc` in that
method?
4. :question: What are these `Document` objects that we use in the `UserController`? 
Why and how are we using them?
5. :question: What does `UserControllerSpec.clearAndPopulateDb` do?
6. :question: What's being tested in `UserControllerSpec.getUsersWhoAre37()`?
How is that being tested?
7. :question: Follow the process for adding a new user. What role do `UserController` and 
`UserRequestHandler` play in the process?

## Your Team's Answers

1. We assign the name of the database "dev" as a string and then pass it on to the mongoClient using the .getDatabase function. Afterwards,w e pass that to the userController and pass the userController to the UserRequestHandler. Request handler has methods that are called from server when the associated endpoint is recieved. There is an int value,4567, associated to the serverPort and we configure Spark using serverPort.


2. So method in unserRequestHandler call userController.getUser(id) where id is a string we got from req.params("id") and that id was part of the endpoint. The method getUser in userController turns id into an object and looks for matching object with the associated key value, aka: "_id". Then an iterator checks if there is a thing in the document with the method .hasNext() which goes through the document and returns the associated value in that document.

3. The request handler uses the method get users. It calls usercontoller to run the method get users which takes a key and a value and looks for the value matching that key. filterDoc is a document that appends the key we give it as a string and the values it has parse or found using regex. Then it's passed on to userCollection.find which makes a new iterabler of type document called matchingUsers. getUsers returns the value of serializeIterable function with the input matchjingUsers.

4. The valuies are like json files, except they append a key and value and are passed on to functions like "insertOne" and "serializeIterable" which go through these documents and get the data.

5. It uses .drop() method to clear the document userDocuments, so we don't have anything leftover in our document and then it populated the document with testUsers.add. This way we know exactly what and how many things we have in the document. Then, it creates a BasicDBObject that has the key "_id" and random oid value to the id. After that, it adds, name,age,company and email to that document as well as their associated values, respectively. Then userDocument.insertMany adds the data made in testUsers to the document and insert one adds the data created in sam to document. Finally, that document is passed to the userController.

6. It is testing the database we made in clearAndPopulateDB. It creates a HashMap, passes the string "age" and the string age value,so 37 in this case), and runs .getUSers on that HashMap. For testing, it uses docs.size checks that the right number of people age 37 are  returned. Afterwards, it checks that the right people age 37 are returned.

7. Server calls on addNewUser in UserRequestHandler, which gets the name, age, company and email using .getString from server. Then it calls the addNewUser in userController passing on the values. UserController creates new document with the values and uses insertOne ti put in the user. Try and catch are used to make sure the process is successful.


Our server side filters are Owner and Status on the Fry's Incomplete Todos page. That page also has body and category as angular filtering. The reason we chose owner and status to be server side filtering is because it's realistic that a person using this app would only want to look at their incomplete todos and know what they have left. Since, there is no login system we just chose to pretend we are fry and filter owner for him and status as incomplete. The body and category for angular filtering makes sense, because Fry will still want to reduce all his todos down to specific todos(by body) or specific categories(ex: how much homework he has left).

