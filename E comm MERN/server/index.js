import express from "express" ;
import mongoose from "mongoose" ;
import dotenv from "dotenv" ;
import cors from "cors" ;
import {fileURLToPath} from "url";
import path from "path" ;
import { createUser, loginUser, updateUser } from "./controllers/user.js";
import UploadProductImages from "./configes/productImages.js";
import { getAllProducts, getRandomProducts, saveProducts, searchProducts } from "./controllers/product.js";
import { addAddress, getAddressByUser } from "./controllers/address.js";
import { addWishlistItem, deleteWishlistItem, getWishlistItems } from "./controllers/wishlist.js";
import { addReview, getReviewsForProduct } from "./controllers/review.js";
import { addToCart, checkProductInCart, emptyCart, getCart, removeFromCart } from "./controllers/cart.js";
import { cancelOrder, ConfirmOrder, confirmOrderStatus, getOrders, placeOrder } from "./controllers/order.js";

dotenv.config() ;
const app = express() ;
app.use(express.json());
app.use(cors()) ;

const __filename = fileURLToPath(import.meta.url) ;
const __dirname = path.dirname(__filename) ;

app.use("/ProductImages", express.static(path.join(__dirname, "ProductImages")));

const PORT = 8081 ;
const mongo_url = "mongodb://localhost:27017/ecommdata"  ;

console.log("The database url is",mongo_url);

if(!mongo_url){
    console.error("The database is not connected successfully, please recheck the url in env file and try again!!")
    process.exit(1) ;
}

mongoose.connect(mongo_url,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("The database has been connected successfully!!");
    app.listen(PORT,()=>{
        console.log(`server is running on ${PORT}`);
    });
}).catch((error)=>{
  console.error("Something went wrong while connecting to database",error);
});

app.post("/createAccount",createUser);

app.post("/loginUser",loginUser) ;

app.post("/products",UploadProductImages.single("image"),saveProducts);

app.get("/getAllProducts",getAllProducts);

app.put("/updateUser",updateUser);

app.put("/addAddress",addAddress);

app.get("/getAddressByUser",getAddressByUser);

app.post("/addWishlistItem",addWishlistItem);

app.delete("/deleteWishlistItem/:id",deleteWishlistItem);

app.get("/getWishlistItems",getWishlistItems);

app.get("/searchProducts",searchProducts);

app.post("/addReview",addReview);

app.get("/getReviewsForProduct",getReviewsForProduct);

app.get("/randomProducts",getRandomProducts);

app.post("/addToCart",addToCart);

app.get("/productExists",checkProductInCart);

app.delete("/removeFromCart",removeFromCart);

app.get("/getCart",getCart);

app.put("/emptyCart",emptyCart);

app.post("/confirmOrder",ConfirmOrder);

app.get("/getOrders",getOrders);

app.put("/confirmOrderStatus",confirmOrderStatus);

app.put("/cancelOrder",cancelOrder);

app.post("/placeOrder",placeOrder);