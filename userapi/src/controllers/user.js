const db = require('../dbClient')

module.exports = {
  create: (user, callback) => {
    // Check parameters
    if(!user.username)
      return callback(new Error("Wrong user parameters"), null)
    
      // Create User schema
    const userObj = {
      firstname: user.firstname,
      lastname: user.lastname,
    }
    // TODO check if user already exists

    db.hexists(user.username, 'firstname', (err, exists) => {
      if (err) {
        return callback(err, null);
      }

      if (exists) {
        return callback(new Error("L'utilisateur existe déjà"), null);
      }
    // Save to DB

    db.hmset(user.username, userObj, (err, res) => {
      if (err) return callback(err, null)
      callback(null, res) // Return callback
    })
  })
  },
   get: (username, callback) => {
     // TODO create this method
     // Récupérer les données de l'utilisateur à partir de la database
      db.hgetall(username, (err, userData) => {
        if (err) {
          return callback(err, null);
        }
  
        if (!userData || Object.keys(userData).length === 0) {
          // L'utilisateur n'existe pas
          return callback(new Error("L'utilisateur n'existe pas"), null);
        }
  
        // L'utilisateur a été trouvé, renvoyer ses données
        callback(null, userData);
      })
    }
}
