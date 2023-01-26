const data = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane.doe@example.com",
  },
];

const config = {
  keyMap: {
    id: "user_id",
    name: "full_name",
  },
  valueMap: {
    email: (email) => email.toLowerCase(),
  },
};

// Transform the keys and values of the objects in the data array
const transformedData = data.map((obj) => {
  const transformedObj = {};
  Object.keys(obj).forEach((key) => {
    // Apply the key mapping from the config
    let transformedKey = key;
    if (config.keyMap[key]) {
      transformedKey = config.keyMap[key];
    }

    // Apply the value mapping from the config
    let transformedValue = obj[key];
    if (config.valueMap[key]) {
      transformedValue = config.valueMap[key](obj[key]);
    }

    transformedObj[transformedKey] = transformedValue;
  });
  return transformedObj;
});

console.log(transformedData);
// Output: [
//   { user_id: 1, full_name: 'John Doe', email: 'john.doe@example.com' },
//   { user_id: 2, full_name: 'Jane Doe', email: 'jane.doe@example.com' },
// ]

// Function to transform an array of objects based on a JSON configuration
function transformArray(array, config) {
  // Loop through the array of objects
  return array.map((obj) => {
    const newObj = {};

    // Loop through the keys in the config object
    for (const key in config) {
      // Check if the key exists in the original object
      if (obj.hasOwnProperty(key)) {
        // Check if the value of the key in the config is null
        if (config[key] === null) {
          // If the value is null, delete the key from the original object
          delete obj[key];
        } else {
          // If the value is not null, add a new key-value pair to the new object
          // using the value from the config as the key and the value from the original object as the value
          newObj[config[key]] = obj[key];
        }
      }
    }

    // Return the new object
    return newObj;
  });
}
