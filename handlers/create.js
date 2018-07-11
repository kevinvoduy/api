const uuid = require('uuid');
const DynamoDB = require('../libs/dynamodb-lib');

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.username !== 'string') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Validation failed: Couldn\'t add user.',
    });
    return;
  }

  const params = {
    TableName: process.env.USERS_TABLE,
    Item: {
      userId: uuid.v1(),
      username: data.username,
      age: data.age,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the todo to the database
  DynamoDB.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error('Error:', error.message);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Server error: Couldn\'t add user.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
