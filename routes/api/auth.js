const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const bcrypt=require('bcryptjs');
const config=require('config');
const jwt=require('jsonwebtoken');
const {check, validationResult }=require('express-validator');

const User=require('../../models/Users')

//@route  get api/auth
//@desc   Test routes
//@access  public

router.get('/',auth,async (req,res)=>{
try {
    const user=await User.findById(req.user.id).select('-password');
    res.json(user);
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
}
    

});

router.post('/',[
    check('email','please include a valid email').isEmail(),
    check('password','Password require').exists()
    
], async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }
    const {email,password}=req.body;

        try{
            let user=await User.findOne({email});

            if(!user)
            {
                return res
                .status(400)
                .json({errors:[{msg:'Invalid Credential'}]});
            }
            
          
            const isMatch=await bcrypt.compare(password, user.password);

            if(!isMatch)
            { return res
                .status(400)
                .json({errors:[{msg:'Invalid Credential'}]});}
            
           

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