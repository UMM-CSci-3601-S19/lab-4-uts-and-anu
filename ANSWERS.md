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


2. So method in unserRequestHandler call userController.getUser(id) where id is a string we got from req.params("id") and that id was part of the endpoint. The method getUser in userController turns id into an object and looks for matching object with the associated key value, aka: "_id". Then an iterator checks if there are mroe things int he document with the method .hasNext() goes through the document and returns all the associated values in that document.

3. The request handler uses the method get users. it calls usercontoller to run the method get users which takes key and value and looks for the key age and gets the value. 
