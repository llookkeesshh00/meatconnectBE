const route = require('express').Router();
const Product = require('../models/product');
const Contract = require('../models/contract');
const Delivery = require('../models/delivery');
const { User, Supplier, Buyer } = require('../models/user');
const transporter = require('../mail')
const authenticateSupplier = require('../middlewares/authmiddleware')


route.use(authenticateSupplier)

route.get('/getContracts/confirmed', authenticateSupplier, async (req, res) => {
    try {
        let user = req.user.id;
        let buyer = await Buyer.findOne({ user })
        let buyer_id = buyer._id;


        let allcontracts = await Contract.find({ buyer: buyer_id, confirmed: true }).populate('productId');
        let detailsArray = []

        if (allcontracts) {
            for (let i = 0; i < allcontracts.length; i++) {
                const contract = allcontracts[i];
                


                let supplier = await Supplier.findOne({ _id: contract.supplier });
                let currdate = new Date();


                let status = true;
                if (contract.endDate < currdate) status = false;

                const details = {
                    id: contract.supplier,
                    productId: contract.productId._id,
                    supplierName: supplier.companyName,
                    productCatogery: contract.productId.productCategory,
                    productName: contract.productId.productName,
                    productPrice: contract.productId.price,
                    duration: contract.period,
                    status,
                    createdAt: contract.startDate,

                };

                detailsArray.push(details);
            }
        }

        res.status(200).json({ detailsArray, message: "sucess", ok: true });

    }
    catch (error) {
        console.log("error:", error);
        res.status(500).json({ error, ok: false });
    }

})
route.get('/getContracts/pending', authenticateSupplier, async (req, res) => {
    try {
        let user = req.user.id;
        let buyer = await Buyer.findOne({ user })
        let buyer_id = buyer._id;


        let allcontracts = await Contract.find({ buyer: buyer_id, confirmed: false }).populate('productId');
        let detailsArray = []

        for (let i = 0; i < allcontracts.length; i++) {
            const contract = allcontracts[i];


            let supplier = await Supplier.findOne({ _id: contract.supplier });

            let currdate = new Date();


            let status = true;
            if (contract.endDate < currdate) status = false;

            const details = {
                id: contract.supplier,
                productId: contract.productId._id,
                supplierName: supplier.companyName,
                productCatogery: contract.productId.productCategory,
                productName: contract.productId.productName,
                productPrice: contract.productId.price,
                duration: contract.period,
                status,
                createdAt: contract.startDate,

            };

            detailsArray.push(details);
        }

        res.status(200).json({ detailsArray, message: "sucess", ok: true });

    }
    catch (error) {
        console.log("error:", error);
        res.status(500).json({ error, ok: false });
    }

})
route.get('/getContracts/supplier/confirmed', authenticateSupplier, async (req, res) => {
    try {
        let user = req.user.id;
        let supplier = await Supplier.findOne({ user })
        let supplier_id = supplier._id;

        let allcontracts = await Contract.find({ supplier: supplier_id, confirmed: true }).populate('productId');
        let detailsArray = []


        for (let i = 0; i < allcontracts.length; i++) {
            const contract = allcontracts[i];


            let buyer = await Buyer.findOne({ _id: contract.buyer });
            let currdate = new Date();


            let status = true;
            if (contract.endDate < currdate) status = false;

            const details = {
                id: contract.supplier,
                productId: contract.productId._id,
                buyername: buyer.companyName,
                productCatogery: contract.productId.productCategory,
                productName: contract.productId.productName,
                productPrice: contract.productId.price,
                duration: contract.period,
                status,
                createdAt: contract.startDate,

            };

            detailsArray.push(details);
        }

        res.status(200).json({ detailsArray, message: "sucess", ok: true });

    }
    catch (error) {
        console.log("error:", error);
        res.status(500).json({ error, ok: false });
    }

})
route.get('/getContracts/supplier/pending', authenticateSupplier, async (req, res) => {
    try {
        let user = req.user.id;
        let supplier = await Supplier.findOne({ user })
        let supplier_id = supplier._id;


        let allcontracts = await Contract.find({ supplier: supplier_id, confirmed: false }).populate('productId');
        let detailsArray = []

        for (let i = 0; i < allcontracts.length; i++) {
            const contract = allcontracts[i];


            let buyer = await Buyer.findOne({ _id: contract.buyer });
            let currdate = new Date();


            let status = true;
            if (contract.endDate < currdate) status = false;

            const details = {
                id: contract.supplier,
                contract_id: contract._id,
                productId: contract.productId._id,
                buyername: buyer.companyName,
                productCatogery: contract.productId.productCategory,
                productName: contract.productId.productName,
                productPrice: contract.productId.price,
                duration: contract.period,
                status,
                createdAt: contract.startDate,

            };

            detailsArray.push(details);
        }

        res.status(200).json({ detailsArray, message: "sucess", ok: true });

    }
    catch (error) {
        console.log("error:", error);
        res.status(500).json({ error, ok: false });
    }

})


route.get('/acceptContract/:id', async (req, res) => {
    let id = req.params.id;
    let new_date = new Date();
    const updatedContract = await Contract.findByIdAndUpdate(
        id,
        { $set: {
                confirmed: true,
                startDate: new_date
            }
        },
        { new: true } // Option to return the updated document
    );


    let buyer_email = await Contract.findOne({ _id: id }).populate('buyer');

    buyer_email = buyer_email.buyer.email;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: buyer_email,
        subject: 'CONTRACT CONFIRMATION',
        html: `
            <h1>Congragulations on your contract cofirmation </h1>
            <h2>Now order your products and get them hassel free</h2>    
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ ok: false, message: 'Order placed but email failed' });
        }
        console.log('Email sent:', info.response);
    });


    res.status(200).json({ok:true,message:'contract accepted sucessfully'})




})
route.post('/makeContract', async (req, res) => {
    try {
        let id = req.user.id;

        const currentDate = new Date()
        const futureDate = new Date(currentDate);
        futureDate.setMonth(currentDate.getMonth() + 6);
        //   console.log(req.body)
        let details = {
            buyer: req.body.buyerDetails.id,
            supplier: req.body.supplierDetails.id,
            productId: req.body.productDetails.id,
            startDate: currentDate,
            period: req.body.contractDetails.period,
            estimated_quantity: req.body.contractDetails.estimated_quantity,
            endDate: futureDate,
            paymentType: req.body.contractDetails.paymentType,
            paymentMode: req.body.contractDetails.paymentMode,

        }

        let newData = new Contract(details);
        await newData.save();


        let key = 'buyer';
        let value = req.body.buyerDetails.id;
        let det = req.body.deliveryLocation
        det[key] = value;


        newData = new Delivery(det);
        await newData.save();

        let supplier_Det = await Supplier.findOne({ _id: req.body.supplierDetails.id });
        let supplier_email = supplier_Det.email;


        let buyer_details = await User.findOne({ _id: id })


        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: supplier_email,
            subject: 'CONTRACT REQUEST',
            html: `
                <h1>Please negotiate and confirm the request </h1>
                <h2>contract details</h2>
                
                <p><strong>Product Category:</strong> ${req.body.productDetails.category}</p>
                <p><strong>Product Name:</strong> ${req.body.productDetails.name}</p>
                <p><strong>Estimated quantity/kg:</strong> ₹${details.estimated_quantity}</p>
                <p><strong>Payment Type:</strong> ${details.paymentType}</p>
                <p><strong>Payment Mode:</strong> ₹${details.paymentMode}</p>
                <p><strong>Period:</strong> ${details.period}(in months)</p>
                <br/>

                <h2>buyer details</h2>
                 <p><strong>Name:</strong> ${buyer_details.name}</p> 
                 <p><strong>Moblie:</strong> ${buyer_details.mobile}</p>
                 <p><strong>Hotel Name:</strong> ${det.name}</p>
                 <p><strong>Adress:</strong> ${det.area}  ${det.city} ${det.state} ${det.pincode}</p>
                
               
               
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ ok: false, message: 'Order placed but email failed' });
            }
            console.log('Email sent:', info.response);
        });


        res.status(200).json({ message: 'contact added sucessfully ypu will get notification once supplier confirms', ok: true });
    }

    catch (error) {
        console.log(error)
        res.status(500).json({ message: "error", error, ok: false });
    }





})
route.get('/getContracts/supplier/pending/notifications', authenticateSupplier, async (req, res) => {
    try {
      
        let user = req.user.id;
        let supplier = await Supplier.findOne({ user })
        let supplier_id = supplier._id;


        let allcontracts = await Contract.find({ supplier: supplier_id, confirmed: false }).populate('productId');
        let count =allcontracts.length;
       
        res.status(200).json({ count, message: "sucessfully fetched notifiations", ok: true });

    }
    catch (error) {
        console.log("error:", error);
        res.status(500).json({ error, ok: false });
    }

})


module.exports = route;