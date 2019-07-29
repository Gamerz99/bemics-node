const express = require('express');
const router = express.Router();
const users = require('../models/users');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const verify = require('../verify');
const randomstring = require('randomstring');
const mailer = require('../misc/mailer');

const UserSchema = joi.object().keys({
  email: joi.string().email().required(),
  name: joi.string().required(),
  password: joi.string().required()
})

const LoginSchema = joi.object().keys({
  email: joi.string().email().required(),
  password: joi.string().required()
})

/* GET users listing. */
router.get('/', verify.ensureToken, async (req, res, next) => {
  try {
    const data = await users.find({});
    if (!data) {
      res.status(500).json({ message: "Not Found" });
      return
    }

    res.status(200).json({ message: "success", data: data })
  } catch (error) {
    next(error)
  }

});

//GET users by id
router.get('/:id', verify.ensureToken, async (req, res, next) => {
  try {
    const data = await users.findOne({ _id: req.params.id });
    if (!data) {
      res.status(404).json({ message: "Not Found" });
      return
    }

    delete data.password;
    res.status(200).json({ message: "success", data: data })
  } catch (error) {
    next(error)
  }
});

//Verify user
router.post('/verify', async (req, res, next) => {
  try {
    const secrettoken = req.body.secrettoken
    const user = await users.findOne({ secrettoken: secrettoken });
    if (!user) {
      res.status(404).json({ message: "Not Valid Token" });
      return
    }

    user.active = true;
    user.secrettoken = '';

    const update = await users.findByIdAndUpdate({ _id: user._id }, user);
    if (!update) {
      res.status(404).json({ message: "Not Success" })
      return
    }

    res.status(200).send({ message: "success" })

  } catch (error) {
    next(error)
  }
});

//POST users
router.post('/', async (req, res, next) => {
  try {
    const result = joi.validate(req.body, UserSchema);
    if (result.error) {
      res.status(404).json({ message: 'Data is not valid' });
      return
    }

    const email = await users.findOne({ email: result.value.email });
    if (email) {
      res.status(404).json({ message: "Already exist" });
      return
    }

    const hash = await users.hashPassword(result.value.password);
    const secrettoken = await randomstring.generate();

    result.value.password = hash;
    result.value.active = false;
    result.value.secrettoken = secrettoken;

    const user = await new users(result.value)
    const out = await user.save();
    if (!out) {
      res.status(500).json({ message: "Not Success" })
      return
    }

    const html = 'Hi there, <br/> Thank you for registering! <br/><br/> Please verify your email by typing the following token <br/> Token :<b> ' + secrettoken + ' </b> <br/> On the following page : <a href="http://localhost:3000/users/verify"> http://localhost:3000/users/verify</a> <br/><br/> Thank you'
    const from = "admin@bemics.com";
    const subject = "Verification"

    await mailer.sendmail(from, result.value.email, subject, html);

    res.status(200).send({ message: "success" })

  } catch (error) {
    next(error);
  }

});

//Login users
router.post('/login', async (req, res, next) => {
  try {
    const result = joi.validate(req.body, LoginSchema);
    if (result.error) {
      res.status(404).json({ message: 'Data is not valid' })
      return
    }

    const login = await users.findOne({ email: result.value.email });
    if (!login) {
      res.status(404).json({ message: "Invalid User" })
      return
    }

    const valid = await users.comparePasswords(result.value.password, login.password);
    if (!valid) {
      res.status(404).json({ message: "Invalid Password" })
      return
    }

    if (!login.active) {
      res.status(404).json({ message: "Inactive" })
      return
    }

    let payload = { subject: login._id }
    let token = jwt.sign(payload, 'bemicskey')
    res.status(200).send({ message: "success", userdata: login, token: token })

  } catch (error) {
    next(error);
  }

});

//UPDATE users
router.put('/:id', verify.ensureToken, async (req, res, next) => {
  try {
    const result = joi.validate(req.body, UserSchema);
    if (result.error) {
      res.status(404).json({ message: 'Data is not valid' })
      return
    }

    const user = await users.findOne({ _id: req.params.id });
    if (!user) {
      res.status(404).json({ message: "Invalid User" })
      return
    }

    if (user.email != result.value.email) {
      res.status(404).json({ message: "Email can't change" })
      return
    }

    const hash = await users.hashPassword(result.value.password)
    user.name = result.value.name;
    user.email = result.value.email;
    user.password = hash;

    const update = await user.save();
    if (!update) {
      res.status(404).json({ message: "Not Success" })
      return
    }

    const data = await users.findOne({ _id: req.params.id });
    if (!data) {
      res.status(404).json({ message: "Not Found" })
      return
    }

    delete data.password;
    res.status(200).json({ message: "success", data: data })

  } catch (error) {
    next(error);
  }

})

module.exports = router;
