import app from "./app";
import connectDb from "./config/connectDb";
import envProvider from "./utils/envProvider";

connectDb()
  .then(() => {
    app.listen(envProvider.PORT, () => {
      console.log(
        "Server is fire at " + `http://localhost:${envProvider.PORT} 🚀`
      );
    });
  })
  .catch((err) => console.error(err));
