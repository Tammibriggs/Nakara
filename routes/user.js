const router = require('express').Router()
const User = require('../models/User')
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken')

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

// set interest route to be used in the admin page
router.get('/setInterestAdmin/:id', async(req, res) => {
  const date = new Date()
  const tomorrow = date.setDate(date.getDate() + 1)

  try{
    const user = await User.findById(req.params.id)
    const {wallet} = user._doc
    const {lockedAmount, interestTime, lockedFundsDuration} = wallet

    // if the locked amount is less than 5000, set the interest time to 0
    if(lockedAmount < 5000){
      const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, {
        $set: {'wallet.interestTime' : 0}
      }, {new: true})
      const {wallet} = updatedUser._doc
      return res.status(200).json({status: 'ok', wallet})
    }

    // if the locked amount is greater than 5000 and the interest equals 0
    // set the interest time to the next day
    if(lockedAmount >= 5000 && interestTime === 0){ 
      if(lockedFundsDuration === 0){
        return res.status(422).json({status: 'error', message:'Locked funds duration has not been set.'})
      }else{
        const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, {
          $set: {'wallet.interestTime' : tomorrow}
        }, {new : true})
        const {wallet} = updatedUser._doc
        return res.status(200).json({status: 'ok', wallet})
      }
    }

    return res.status(200).json({status:'ok', wallet})
  }catch(err){
    res.status(500).json({status:'error', message:'Unable to add interest'})
  }
})

// Add interst to wallet balance
router.get('/addInterest/:id', verifyTokenAndAuthorization, async (req, res) => {
  const date = new Date()
  const today = date.getTime()
  const tomorrow = date.setDate(date.getDate() + 1)

  try{
    const user = await User.findById(req.params.id)
    const {wallet} = user._doc
    const {lockedAmount, interestTime, availableAmount, lockedFundsDuration} = wallet

    // if the locked amount is less than 5000, set the interest time to 0
    if(lockedAmount < 5000) {
      const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, {
        $set: {'wallet.interestTime' : 0}
      }, {new: true})
      const {wallet} = updatedUser._doc
      return res.status(200).json({status: 'ok', wallet})
    }

    // if the locked amount is greater than 5000 and the interest equals 0
    // set the interest time to the next day
    if(lockedAmount >= 5000 && interestTime === 0){ 
      if(lockedFundsDuration === 0){
        return res.status(422).json({status: 'error', message:'Locked funds duration has not been set.',})
      }else{
        const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, {
          $set: {'wallet.interestTime' : tomorrow}
        }, {new : true})
        const {wallet} = updatedUser._doc
        return res.status(200).json({status: 'ok', wallet})
      }
    }
    
    // if the locked amount is greater than 5000, the interest time is greater and 0
    // and less than or equal to today's time, increase the wallet balance by 0.3333%
    // in respect the number of days the interest time is less than today
    if(lockedAmount >= 5000 && interestTime > 0 && interestTime <= today){
      let interest = 0
      let absoluteDay = 0
      let newAvailableAmount = 0

      
      if(lockedFundsDuration > 0 && today >= lockedFundsDuration){
        const timeDifference = lockedFundsDuration - interestTime
        const dayDifference = timeDifference / (1000 * 3600 * 24)
        absoluteDay = Math.abs(Math.round(dayDifference))
        
        // set the interest base on the days past since the interest was added (absolute day)
        if(absoluteDay === 0){
          interest = lockedAmount * (0.3333/100)
        }else if(absoluteDay >= 1){
          absoluteDay += 1
          interest = (lockedAmount * (0.3333/100)) * absoluteDay
        }

        newAvailableAmount = availableAmount + lockedAmount + interest
        const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, {
          $set: {
            'wallet.availableAmount' : Math.round(newAvailableAmount),
            'wallet.lockedAmount' : 0,
            'wallet.interestTime' : 0,
            'wallet.lockedFundsDuration' : 0
          }
        }, {new : true})
        const {wallet} = updatedUser._doc
        return res.status(200).json({status: 'ok', wallet})

      }else{
        const timeDifference = today - interestTime
        const dayDifference = timeDifference / (1000 * 3600 * 24);
        absoluteDay = Math.abs(Math.round(dayDifference))
        
        // set the interest base on the days past since the interest was added (absolute day)
        if(absoluteDay === 0){
          interest = lockedAmount * (0.3333/100)
        }else if(absoluteDay >= 1){
          absoluteDay += 1
          interest = (lockedAmount * (0.3333/100)) * absoluteDay
        }

        newAvailableAmount = availableAmount + interest
        const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, {
          $set: {
            'wallet.availableAmount' : Math.round(newAvailableAmount),
            'wallet.interestTime' : tomorrow
          }
        }, {new : true})
        const {wallet} = updatedUser._doc

        return res.status(200).json({status: 'ok', wallet})
      } 
    }

    return res.status(200).json({status: 'ok', wallet})
  }catch(err){
    res.status(500).json({status:'error', message:'Unable to add interest'})
  }
})

module.exports = router