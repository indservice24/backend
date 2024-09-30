import contactModel from '../model/contactModel.js'


const addContact = async (req,res) => {
    try {
        const {name,email,subject,message} = req.body
        const contact = new contactModel({name,email,subject,message})
        await contact.save()
        res.json({success:true,message:"contact added"})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// message for list on admin

const listcontact = async (req,res) =>{
    try {
         
        const contact = await contactModel.find({});
        res.json({success:true,contact})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}



export {addContact,listcontact}
