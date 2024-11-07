const route = require('express').Router();
const Product = require('../models/product');
const Contract = require('../models/contract');
const Delivery = require('../models/delivery');
const { User, Supplier, Buyer } = require('../models/user');

const authenticateSupplier = require('../middlewares/authmiddleware')


route.use(authenticateSupplier)

route.get('/getContracts', authenticateSupplier, async (req, res) => {
    try {
        let user = req.user.id;
        let buyer = await Buyer.findOne({ user })
        let buyer_id = buyer._id;


        let allcontracts = await Contract.find({ buyer: buyer_id }).populate('productId');
        let detailsArray=[]
    
        for (let i = 0; i < allcontracts.length; i++) {
            const contract = allcontracts[i];
          
           
            let supplier=await Supplier.findOne({_id:contract.supplier});
            let currdate= new Date();
            

            let status=true;
            if(contract.endDate<currdate) status=false;

            const details = {
                id:contract.supplier , 
                productId:contract.productId._id,
                supplierName:supplier.companyName,
                productCatogery:contract.productId.productCategory,
                productName:contract.productId.productName,
                productPrice:contract.productId.price,
                duration:contract.period ,
                status,
                createdAt: contract.startDate,
                
            };

            detailsArray.push(details);
        }
      
      res.status(200).json({detailsArray,message:"sucess",ok:true});

    }
    catch (error) {
        console.log("error:",error);
        res.status(500).json({error,ok:false});
    }

})

route.post('/makeContract', async (req, res) => {
    try {
        const currentDate = new Date()
        const futureDate = new Date(currentDate);
        futureDate.setMonth(currentDate.getMonth() + 6);

        let details = {
            buyer: req.body.buyerDetails.id,
            supplier: req.body.supplierDetails.id,
            productId: req.body.productDetails.id,
            startDate: currentDate,
            period: req.body.contractDetails.period,
            endDate: futureDate,
            paymentType: req.body.contractDetails.paymentType,
            paymentMode: req.body.contractDetails.paymentMode,

        }
        console.log(details)

        let newData = new Contract(details);
        await newData.save();


        let key = 'buyer';
        let value = req.body.buyerDetails.id;
        let det = req.body.deliveryLocation
        det[key] = value;

        if (!Delivery.findOne({ buyer: value })) {
            newData = new Delivery(det);
            await newData.save();
        }

        res.status(200).json({ message: 'contact made sucsessfully', ok: true });
    }

    catch (error) {
        console.log(error)
        res.status(500).json({ message: "error", error, ok: false });
    }





})


module.exports = route;