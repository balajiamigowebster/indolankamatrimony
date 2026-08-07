const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "amigoweb_indolankamatrimony_amigo",
  "amigoweb_indolankamatrimony_amigo",
  "&}.V;M59d],L!5-O",
  {
    host: "amigowebster.in",
    dialect: "mysql",
    port: 3306,
    logging: console.log,
  }
);

async function test() {
  try {
    await sequelize.authenticate();
    console.log("✅ Successfully connected to remote database!");
    
    const [adminsCount] = await sequelize.query("SELECT COUNT(*) AS count FROM admins;");
    console.log("Admins Count:", adminsCount[0].count);
    
    const [profilesCount] = await sequelize.query("SELECT COUNT(*) AS count FROM profile;");
    console.log("Profiles Count:", profilesCount[0].count);
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await sequelize.close();
  }
}

test();
