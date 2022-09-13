import Joi from 'joi';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import {User} from '../../models';
import bcrypt from 'bcrypt';
import JwtService from '../../services/JwtService';

const registerController = {
  async register(req,res,next){
    //validate the request
    const registerSchema = Joi.object({
      name:Joi.string().min(3).max(30).required,
      email:Joi.string().email().required(),
      password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
      repeat_password:Joi.ref('password')
    })

    const [error] = registerSchema.validate(req.body);

    if(error){
      return next(error);
    }
    
    //authorise the request
    //check if user is in the database already

    try{
      const exist = await User.exits({email:req.body.email});
      if(exist){
        return next(CustomErrorHandler.alreadyExist('this email is already taken!'))
      }
    }catch(err){
      return next(err);
    }

    //Hash password
    const {name,email,password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);

    //prepare model
    
    const user = new User({
      name,
      email,
      password:hashedPassword
    });

    //store in database
    let access_token;
    try{
      const result = await user.save();

      //generate jwt token
      access_token = JwtService.sign({_id:result._id,role:result.role});
    }catch(err){
      return next(err);
    }
    
    //send response
    res.json({access_token:access_token});
  }
}

export default registerController;