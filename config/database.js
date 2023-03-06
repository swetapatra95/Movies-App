require('dotenv').config()

module.exports = {
    url : "mongodb+srv://admin:" + process.env.DB_PASS + 
          "@cluster0.dsyetgf.mongodb.net/" + 
          process.env.DATABASE + "?retryWrites=true&w=majority"
};
