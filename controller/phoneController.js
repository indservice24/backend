import phoneModel from "../model/phoneModel.js"

const addPhone  = async (req, res) => {

  try {
    const phone = new phoneModel(req.body);
    await phone.save();
    res.json({success: true, message: 'Phone added successfully'})
  } catch (error) {
    res.json({success: false, message: error.message})
  }

}


const removePhone = async (req, res) => {
  try {
    const{id} = req.body;
    const deletePhone = await phoneModel.findByIdAndDelete(id);
    if(!deletePhone){
      return res.json({success: false, message:"Couldn't find"});
    }

    res.json({success: true, message: 'remove phone successfully'});

  } catch (error) {
      res.json({success: false, message: error.message})
  }
}


 const updateStock = async (req,res) => {
  try {
    const{id} = req.body;
    const update = await phoneModel.findByIdAndUpdate(id , {availability:"Out of Stock"});
    if(!update){
      return res.json({success: false, message:"Couldn't update" });
    }
    res.json({success: true, message: "stock updated successfully"});
  } catch (error) {
    res.json({success: false, message: error.message})
  }
 }


 const updateofStock = async (req,res) => {
  try {
    const{id} = req.body;
    const update = await phoneModel.findByIdAndUpdate(id , {availability:"In Stock"});
    if(!update){
      return res.json({success: false, message:"Couldn't update" });
    }
    res.json({success: true, message: "stock updated successfully"});
  } catch (error) {
    res.json({success: false, message: error.message})
  }
 }


 const singlePhone = async (req,res) => {
  try {
    const{id} = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: "phone ID is required" });
  }

  const PhoneData = await phoneModel.findById(id);
        
  if (!PhoneData) {
      return res.status(404).json({ success: false, message: "phone not found" });
  }
  
  res.status(200).json({ success: true, PhoneData });
  } catch (error) {
    
  }
 }



 const phonelist = async (req,res) => {
  try {
    const list = await phoneModel.find()
    res.json({success: true, list});
  } catch (error) {
    res.json({success: false, message: error.message})
  }
 }


export { addPhone, removePhone, updateStock , phonelist,updateofStock,singlePhone}