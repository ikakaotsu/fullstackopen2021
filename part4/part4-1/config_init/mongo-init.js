print("Start creating database ##########################");
// Used to return another database without modifying the db variable in the shell environmen
db1 = db.getSiblingDB("part4_1_db");
// Creates a new user for the database on which the method is run
db1.createUser({
  user: "part4_1_user",
  pwd: "part321",
  roles: [{ role: "readWrite", db: "part4_1_db" }],
});
print("End creating database ##########################");
