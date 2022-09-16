import Joi from 'joi';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import {User,RefreshToken} from '../../models';
import bcrypt from 'bcrypt';
import JwtService from '../../services/JwtService';
import {REFRESH_SECRET} from '../../config'

const registerController = {
  async register(req,res,next){
    //validate the request
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
      repeat_password: Joi.ref('password')
    });
    console.log(req.body);
    const { error } = registerSchema.validate(req.body,{escapeHtml: true});
    

    if(error){
      
      return next(error);
    }
    
    //authorise the request
    //check if user is in the database already

    try{
      const exist = await User.findOne({email:req.body.email});
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
    let refresh_token;
    try{
      const result = await user.save();

      //generate jwt token
      access_token = JwtService.sign({_id:result._id,role:result.role});
      refresh_token = JwtService.sign({_id:result._id,role:result.role},'1y',REFRESH_SECRET);

      //database whitelist

      await RefreshToken.create({token:refresh_token});
    }catch(err){
      return next(err);
    }
    
    //send response
    res.json({access_token,refresh_token});
  }
}

export default registerController;