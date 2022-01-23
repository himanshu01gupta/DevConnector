// const express=require('express');
// const router=express.Router();


// router.get('/',(req,res)=>res.send('User route'));

// module.exports=router;

const express=require('express');
const router=express.Router();
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const config=require('config');
const jwt=require('jsonwebtoken');
const {check, validationResult }=require('express-validator');

const User =require('../../models/Users');

//@route    POST api/users
//@desc     Register user
//@access   Public

router.post('/',[
    check('name','Name is Required').not().isEmpty(),
    check('email','please include a valid email').isEmail(),
    check('password',
    'please enter a password with 6 or more character').isLength({min:6})
    
], async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }
    const {name,email,password}=req.body;

        try{
            let user=await User.findOne({email});

            if(user)
            {
                res.status(400).json({errors:[{msg:'User already Exist'}]});
            }
            
            const avatar=gravatar.url(email,{
                s:'200',
                r:'pg',
                d:'mm'
            })
  //get users gravitar
            user=new User({
                name,
                avatar,
                email,
                password
            });


            const salt =await bcrypt.genSalt(10);
            
            user.password=await bcrypt.hash(password,salt);

            await user.save();
            //Encrypt password
            
           

            const payload={
                user:{
                    id:user.id
                }
            };

            jwt.sign(

                payload,
                config.get('jwtSecret'),
                {expiresIn:360000},
                (err,token)=>{
                    if(err) throw err;
                    res.json({token});
                }
            );

        }catch(err){
console.error(err.message);
res.status(500).send('server error');
        }


    
    console.log(req.body);
});

module.exports=router;