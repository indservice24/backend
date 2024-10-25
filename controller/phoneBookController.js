import phoneBookModel from "../model/phoneBookModel.js";


const phoneBook = async (req,res) => {
    try {
        const book = new phoneBookModel(req.body);
        await book.save();
        res.json({success: true, message:"book successfully"})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


const bookedPhone = async (req,res) => {
    try {
        const book = await phoneBookModel.find()
        res.json({success: true, book})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export {phoneBook,bookedPhone}