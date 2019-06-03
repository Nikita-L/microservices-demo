rs.initiate( {
   _id : "rs0",
   members: [
      { _id: 0, host: "todos-api-db-1:27017" },
      { _id: 1, host: "todos-api-db-2:27017" },
      { _id: 2, host: "todos-api-db-3:27017" }
   ]
});
rs.slaveOk();
