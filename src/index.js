import { app } from "./app.js";
import dotenv from 'dotenv';
import sequelize from "./db/dbConnection.js";



dotenv.config({
  path: './env'
})


app.listen(process.env.PORT || 3000, () => {
  try {
    sequelize.sync({ force: false }) // force: true will drop & recreate the table
      .then(() => {
        // console.log('✅ Table created successfully in Aiven DB!');
      })
      .catch(err => {
        console.error('❌ Sync error:', err);
      });
    console.log('🚀 Server running on http://localhost:3000');
  } catch (err) {
    console.error('❌ Failed to sync DB:', err.message);
  }
})
