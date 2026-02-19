
import express from 'express';  
import http from 'http';
import cors from 'cors'
import { mongooseConnection} from './database'
import authRoutes  from './Routes/authRoutes';
import dotenv from "dotenv"
import uploadRoute from './Routes/uploadRoute';
import companyRoutes from './Routes/companyRoutes';
import productRoutes from './Routes/productRoutes';
import billRoutes from './Routes/billRoutes';
import userRoutes from "./Routes/user.Routes"
import cookieParser from "cookie-parser"
import path from "path"


dotenv.config({ path: ".env" })

 
const app = express();


app.use(cors(
    {
        origin: ["http://localhost:5173", "http://localhost:4173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }
))

app.use(cookieParser())
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 

mongooseConnection

app.use("/api/auth",authRoutes)
app.use("/api/upload", uploadRoute)
app.use("/api/companies", companyRoutes)
app.use("/api/products", productRoutes)
app.use("/api/bills", billRoutes)
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"));



app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});



app.get('/isServerUp', (req, res) => {
    res.send('Server is running ');
});




let server = new http.Server(app);
export default server;
