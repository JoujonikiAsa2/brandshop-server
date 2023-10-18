const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config()
const app = express()

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ghkhwep.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();


        const productCollection = client.db("ElectronicsProduct").collection("products")
        const categoryCollection = client.db("ElectronicsProduct").collection("categories")

        app.get('/products', async(req,res)=>{
            const cursor = productCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/categories', async(req,res)=>{
            const cursor = categoryCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/products/:brandName', async(req,res)=>{
            const category = req.params.brandName
            const query = {brandName: category}
            const product = productCollection.find(query)
            const result = await product.toArray()
            res.send(result)
        })

        app.post('/products', async (req, res) => {
            const product = req.body
            const result = await productCollection.insertOne(product)
            console.log(result)
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Server runnning...........")
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})