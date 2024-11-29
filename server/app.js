const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./utils/db");
const userRoute = require("./routes/userRoute");
const applicationRoute = require("./routes/applicationRoute");
const jobRoute = require("./routes/jobRoute");
const companyRoute = require("./routes/companyRoute");

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors());

const port = process.env.PORT || 3000;

app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute);

app.listen(port, () => {
  connectDb();
  console.log(`Server is connected at part ${port}`);
});
