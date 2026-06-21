const authService =
    require('../services/authService');

async function signup(req,res){

    try{

        const {
            username,
            email,
            password
        } = req.body;

        const user =
            await authService.signup(
                username,
                email,
                password
            );

        res.status(201).json({
            message:'User created',
            userId:user.id
        });

    }catch(error){

        if(error.message==='EMAIL_EXISTS'){
            return res.status(409).json({
                error:'Email already exists'
            });
        }

        res.status(500).json({
            error:'Internal Server Error'
        });
    }
}

async function login(req,res){

    try{

        const {
            email,
            password
        } = req.body;

        const token =
            await authService.login(
                email,
                password
            );

        res.status(200).json({
            token
        });

    }catch(error){

        if(
            error.message ===
            'INVALID_CREDENTIALS'
        ){
            return res.status(401).json({
                error:'Invalid credentials'
            });
        }

        res.status(500).json({
            error:'Internal Server Error'
        });
    }
}

module.exports = {
    signup,
    login
};