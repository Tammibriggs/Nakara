const router = require('express').Router()
const User = require('../models/User')
const {verifyTokenAndAuthorization} = require('./verifyToken')

// GET USER
router.get('/find/:id', verifyTokenAndAuthorization, async (req, res) => {
  try{
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).json({status: 'error', message: 'User not found'})

    const {password, verificationCode,  ...others} = user._doc
    res.status(200).json({status: 'ok', data: others})
  }catch(err){
    res.status(500).json({status:'error', message:'An Error occured while trying to get user'}) 
  }
})

// Add interst to wallet balance
router.post('/addInterest/:id', verifyTokenAndAuthorization, async (req, res) => {
  const date = new Date()
  const today = date.getTime()
  const tomorrow = date.setDate(date.getDate() + 1)

  try{
    const user = await User.findById(req.params.id)
    const {wallet} = user._doc
    const {lockedAmount, interestTime, availableAmount} = wallet

    // if the locked amount is less than 5000, set the interest time to 0
    if(lockedAmount < 5000) {
      const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, {
        $set: {'wallet.interestTime' : 0}
      }, {new : true})
      const {wallet} = updatedUser._doc
      return res.status(422).json({
        status: 'error',
        error: 'insufficientLockedAmount',
        message: "can't recieve interest. Insufficient locked fund",
        wallet
      })
    }

    // if the locked amount is greater than 5000 and the interest equals 0
    // set the interest time to the next day
    if(lockedAmount >= 5000 && interestTime === 0){ 
      const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, {
        $set: {'wallet.interestTime' : tomorrow}
      }, {new : true})
      const {wallet} = updatedUser._doc
      return res.status(200).json({status: 'ok', wallet})
    }
    
    // if the locked amount is greater than 5000, the interest time is greater and 0
    // and less than or equal to today's time, increase the wallet balance by 0.3333%
    // in respect the number of days the interest time is less than today
    if(lockedAmount >= 5000 && interestTime > 0 && interestTime <= today){
      let interest = 0
      const timeDifference = today - interestTime
      const dayDifference = timeDifference / (1000 * 3600 * 24);
      let roundedDay = Math.round(dayDifference)
      
      if(roundedDay === 0){
        interest = lockedAmount * (0.3333/100)
      }else if(roundedDay >= 1){
        roundedDay += 1
        interest = (lockedAmount * (0.3333/100)) * roundedDay
      }
      
      console.log(roundedDay, interest)
      const newAvailableAmount = availableAmount + interest
      const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, {
        $set: {
          'wallet.availableAmount' : newAvailableAmount,
          'wallet.interestTime' : tomorrow
        }
      }, {new : true})
      const {wallet} = updatedUser._doc
      return res.status(200).json({status: 'ok', wallet})
    }
    
    return res.status(200).json({status: 'ok', wallet})
  }catch(err){
    res.status(500).json({status:'error', message:'Unable to add interest'})
  }
})

module.exports = router