import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import connectDB from "./dbConnection.js";
import productModel from "./models/productModel.js";

connectDB();

// const products = [
//    {id:1,name:"Samsung M51",price:20000,category:"electronics"},
//    {id:2,name:"Samsung A51",price:15000,category:"electronics"},
// ]

const app = express();

const apolloServer = new ApolloServer({
  // u need to define the type of data , functions {adding ! , makes it mandatory }
  typeDefs: `
      type Product{
         id:ID!,
         name:String!, 
         price:Int!,
         category:String!,
         quantity:Int!,
         imageUrl:String!,
         createdAt:String!,
         updatedAt:String!,
      }

      type Query{
         getProducts:[Product],
         getProduct(id:ID):Product,
         getProductByName(name:String):[Product]
      }
      type Mutation{
         delete(id:ID):Boolean,
         create(name:String!, price:Int!,category:String!,quantity:Int!,imageUrl:String!):Product
         update(id:ID,name:String!, price:Int!,category:String!,quantity:Int!,imageUrl:String!):Product
      }
   `,
  resolvers: {
    Query: {
      getProducts: async () => {
        return await productModel.find(); // .find() returns array of products in then
      },
      getProduct: async (_, { id }) => {
        // parent "_" ,always reqrd,  argument passed in {id}
        return await productModel.findById(id);
      },
      getProductByName: async (_, { name }) => {
        return await productModel.find({ name }); // name become propery and value JavaScript
      },
    },
    Mutation: {
      delete: async (_, { id }) => {
        let result = await productModel.deleteOne({ _id: id });
        if (result.deletedCount != 0) {
          return true;
        }
        return false;
      },
      create: async (_, { name, price, category,quantity, imageUrl }) => {
        
         try { 
            let product = { name, price,category, quantity, imageUrl };
            return await productModel.create(product);
         }
         catch(err){
            throw new Error(" Some Problem ")
         }
      },
      update: async (_, {id, name, price, category,quantity, imageUrl }) => {
        let product = { name, price,category, quantity, imageUrl };
        return await productModel.findByIdAndUpdate(id,product);
      },
    },
  },
});

app.use(cors());
app.use(express.json());
await apolloServer.start();
app.use("/graphql", expressMiddleware(apolloServer));

app.use((err,req,res,next)=>{
   res.status(500).send(err.message)
});

app.listen(8000, () => {
  console.log("Server up");
});
