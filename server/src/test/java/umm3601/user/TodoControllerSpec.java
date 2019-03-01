package umm3601.user;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import umm3601.todo.TodoController;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

public class TodoControllerSpec {

  private TodoController todoController;
  private ObjectId meganId;

  @Before
  public void clearAndPopulateDB(){

    MongoClient mongoClient = new MongoClient();

    MongoDatabase testDB = mongoClient.getDatabase("test");

    MongoCollection<Document> todoDocuments = testDB.getCollection("todos");
    todoDocuments.drop();

    List<Document> testTodos = new ArrayList<>();

    testTodos.add(Document.parse("{\n" +
      "                    owner: \"Kaelan\",\n" +
      "                    status: true,\n" +
      "                    body: \"eatLays\",\n" +
      "                    category: \"food\"\n" +
      "                }"));
    testTodos.add(Document.parse("{\n" +
      "                    owner: \"Nic\",\n" +
      "                    status: false,\n" +
      "                    body: \"winFortnite\",\n" +
      "                    category: \"hobby\"\n" +
      "                }"));
    testTodos.add(Document.parse("{\n" +
      "                    owner: \"Utkarsh\",\n" +
      "                    status: false,\n" +
      "                    body: \"sleep\",\n" +
      "                    category: \"survival\"\n" +
      "                }"));

    meganId = new ObjectId();
    BasicDBObject megan = new BasicDBObject("_id", meganId);
    megan = megan.append("owner", "Megan")
      .append("status", true)
      .append("body", "passO-Chem")
      .append("category","survival");


      todoDocuments.insertMany(testTodos);
      todoDocuments.insertOne(Document.parse(megan.toJson()));

      todoController = new TodoController(testDB);
  }

  private BsonArray parseJsonArray(String json) {
    final CodecRegistry codecRegistry
      = CodecRegistries.fromProviders(Arrays.asList(
      new ValueCodecProvider(),
      new BsonValueCodecProvider(),
      new DocumentCodecProvider()));

    JsonReader reader = new JsonReader(json);
    BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

    return arrayReader.decode(reader, DecoderContext.builder().build());
  }

  private static String getOwner(BsonValue val) {
    BsonDocument doc = val.asDocument();
    return ((BsonString) doc.get("owner")).getValue();
  }

  @Test
  public void getAllTodos() {
    Map<String, String[]> emptyMap = new HashMap<>();
    String jsonResult = todoController.getTodos(emptyMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 4 todos", 4, docs.size());
    List<String> owners = docs
      .stream()
      .map(TodoControllerSpec::getOwner)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedNames = Arrays.asList("Kaelan", "Nic", "Utkarsh", "Megan");
    assertEquals("Owners should match", expectedNames, owners);
  }

  @Test
  public void getStatusWhichAreFalse() {
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("status", new String[]{"false"});
    String jsonResult = todoController.getTodos(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 2 todos", 2, docs.size());
    List<String> owners = docs
      .stream()
      .map(TodoControllerSpec::getOwner)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedOwners = Arrays.asList("Nic", "Utkarsh");
    assertEquals("Owners should match", expectedOwners, owners);
  }

  @Test
  public void getMeganById() {
    String jsonResult = todoController.getTodo(meganId.toHexString());
    Document megan = Document.parse(jsonResult);
    assertEquals("Owner should match", "Megan", megan.get("owner"));
    String noJsonResult = todoController.getTodo(new ObjectId().toString());
    assertNull("No owner should match", noJsonResult);

  }

  @Test
  public void addTodoTest() {
    String newId = todoController.addNewTodo("KK", true, "professor", "CSci");

    assertNotNull("Add new todo should return true when todo is added,", newId);
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("status", new String[]{"true"});
    String jsonResult = todoController.getTodos(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    List<String> owner = docs
      .stream()
      .map(TodoControllerSpec::getOwner)
      .sorted()
      .collect(Collectors.toList());
    assertEquals("Should return owner of new todo", "KK", owner.get(0));
  }

  @Test
  public void getTodoByCategory() {
    Map<String, String[]> argMap = new HashMap<>();
    //Mongo in TodoController is doing a regex search so it can just take a Java Reg. Expression
    //This will search the category starting with an h or an s
    argMap.put("category", new String[]{"[h,s]"});
    String jsonResult = todoController.getTodos(argMap);
    BsonArray docs = parseJsonArray(jsonResult);
    assertEquals("Should be 3 owners", 3, docs.size());
    List<String> owner = docs
      .stream()
      .map(TodoControllerSpec::getOwner)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedOwner = Arrays.asList("Nic", "Utkarsh", "Megan");
    assertEquals("Owners should match", expectedOwner, owner);

  }


}


