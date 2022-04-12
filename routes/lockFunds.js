const router = require('express').Router()
const {verifyTokenAndAdmin} = require('./verifyToken')
const { lockFundsAdminEmail, lockFundsUserEmail} = require('../services')
const LockFund = require('../models/LockFund')
const User = require('../models/User')

const validateLockFunds = (req, res, next) => {
  const emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const {name, email, amount, monthsDuration} = req.body

  if(!name || typeof name !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid name'})
  }
  else if(!amount || typeof amount !== 'number'){
    return res.status(401).json({status: 'error', message: 'Invalid amount'})
  }
  else if(!email.match(emailValidator)){
    return res.status(401).json({status: 'error', message: 'Invalid email'})
  }
  else if(!monthsDuration || typeof monthsDuration !== 'number'){
    return res.status(401).json({status: 'error', message: 'Invalid duration'})
  }
  else{
    next()
  }
}

// CREATE
router.post('/:id', validateLockFunds, verifyTokenAndAdmin, async(req, res) => {
  const {amount} = req.body
  const numAmount = Number(amount)

  console.log(numAmount)

  try{
    const user = await User.findById(req.params.id)
    const {wallet} = user._doc
  
    // check if the requested amout is greater that the available amount 
    // if it is send and error message else continue
    if(numAmount > wallet.availableAmount){
      return res.status(422).json({status: 'error', error:'insufficientBalance', message: 'You wallet balance is less that the amount requested'})
    }

    const createdLockFunds = await LockFund.create(req.body)
    const date = new Date(createdLockFunds.createdAt).toLocaleDateString()
    try{
      await lockFundsAdminEmail(req.body, date)
      await lockFundsUserEmail(req.body, date)
      res.status(200).json({status: 'ok'})
    }catch(err){
      res.status(500).json({status: 'error', error:'emailSendError', message:'Failed to send email'})
    }
  }catch(err){
    res.status(500).json({status:'error', message:'Failed to send lock funds request'})
  } 
})

module.exports = router