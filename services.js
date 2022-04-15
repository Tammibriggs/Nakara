const dotenv = require('dotenv')
const path = require('path')
const sgMail = require('@sendgrid/mail')

// set location to get env
const localEnvPath = path.resolve(process.cwd(), '.env.local')
dotenv.config({path: localEnvPath}) ? dotenv.config() : dotenv.config({path: localEnvPath})

const sendGridKey = process.env.SENDGRID_API_KEY
const verifiedEmail = process.env.EMAIL_USER

// SendGrid
sgMail.setApiKey(sendGridKey)

module.exports.sendVerificationEmail = (email, name, verificationCode, redirectUrl) => {
  const message = {
    from: {
      name: 'noreply@YZXchange.com',
      email: verifiedEmail
    },
    to: email,
    subject: 'Verify your email address',
    text: `Hello ${name}\nFollow this link to verify your email address.\n
    https://nakara.herokuapp.com/api/auth/verify-email?code=${verificationCode}&redirectUrl=${redirectUrl}\nif you didn't ask to verify this address, 
    you can ignore this email.\nThanks.\nSupport@YZXchange.com
    `,
    html: 
    `
     <h4>Hello ${name}</h4>
     <p>Follow this link to verify your email address.</p>
     <a target='_blank' href='https://nakara.herokuapp.com/api/auth/verify-email?code=${verificationCode}&redirectUrl=${redirectUrl}'>Verify your email</a>
     <p>if you didn't ask to verify this address, you can ignore this email.</p>
     <p>Thanks.<p>
     <p>Support@YZXchange.com</p>

    `
  }
  return sgMail.send(message)
}

module.exports.sendResetPasswordEmail = ({email, name, resetPasswordCode, redirectUrl}) => {
  const message = {
    from: {
      name: 'noreply@YZXchange.com',
      email: verifiedEmail
    },
    to: email,
    subject: 'Reset your password',
    text: `Hello ${name}\nFollow the link below to reset your password.\n
    https://nakara.herokuapp.com/api/auth/verify-reset-user-redirect?code=${resetPasswordCode}&redirectUrl=${redirectUrl}\nif you didn't ask to reset your password, 
    you can ignore this email.\nThanks.\nSupport@YZXchange.com
    `,
    html: 
    `
     <h4>Hello ${name}</h4>
     <p>Follow the link below to reset your password.</p>
     <a target='_blank' href='http://localhost:8800/api/auth/verify-reset-user-redirect?code=${resetPasswordCode}&redirectUrl=${redirectUrl}'>Reset your password</a>
     <p>if you didn't ask to reset your password, you can ignore this email.</p>
     <p>Thanks.<p>
     <p>Support@YZXchange.com</p>

    `
  }
  return sgMail.send(message)
}

module.exports.sendBuyCryptoAdminEmail = ({name, currency, amount, walletAddress}) => {
  const message = {
    from: {
      name: 'noreply@YZXchange.com',
      email: verifiedEmail
    },
    to: verifiedEmail,
    subject: 'Buy Crypto Request',
    text: `
      Name: ${name}\n
      currency: ${currency}
      Currency Amount: ${amount.currencyAmount}\n
      Naira: ${amount.nairaAmount}\n
      Wallet Address: ${walletAddress}\n
    `,
    html: `
      <p>
        <strong>Name:</strong> ${name}<br/>
        <strong>Currency:</strong> ${currency}<br/>
        <strong>Currency amount:</strong> ${amount.currencyAmount}<br/>
        <strong>Naira:</strong> ${amount.nairaAmount}<br/>
        <strong>Wallet address:</strong> ${walletAddress}
      </p>
    `
  }
  return sgMail.send(message)
}

module.exports.sendBuyCryptoUserEmail = ({name, email, currency, amount, walletAddress}) => {
  const message = {
    from: {
      name: 'noreply@YZXchange.com',
      email: verifiedEmail
    },
    to: email,
    subject: 'Buy Crypto Request',
    text: `Your request is processing\n
      Name: ${name}\n
      Currency amount: ${amount.currencyAmount}\n
      Naira: ${amount.nairaAmount}\n
      Wallet Address: ${walletAddress}\n
      Please Contact Support if you didn’t initiate this transaction\n\nSupport@YZXchange.com
    `,
    html: `
      <div>
        <h3>Your request to buy crypto is processing</h3>
        <h4>Here are your details:</h4>
        <p>
          <strong>Name:</strong> ${name}<br/>
          <strong>Currency:</strong> ${currency}<br/>
          <strong>Currency amount:</strong> ${amount.currencyAmount}<br/>
          <strong>Naira:</strong> ${amount.nairaAmount}<br/>
          <strong>Wallet address:</strong> ${walletAddress}
        </p>
        <p>Please contact Support if you didn’t initiate this Transaction.</p><br/>
        Support@YZXchange.com
      <div>
    `
  }
  return sgMail.send(message)
}

module.exports.sendSellCryptoAdminEmail = ({name, currency, amount, bankName, accountName, accountNumber, img}) => {
  const message = {
    from: {
      name: 'Support@YZXchange.com',
      email: verifiedEmail
    },
    to: verifiedEmail,
    subject: 'Sell Crypto Request',
    text: `
      Name: ${name}\n
      currency: ${currency}
      Currency amount: ${amount.currencyAmount}\n
      Naira: ${amount.nairaAmount}\n
      Bank name: ${bankName}\n
      Account name: ${accountName}
      Account number: ${accountNumber}\n
      Image: ${img}
    `,
    html: `
      <p>
        <strong>Name:</strong> ${name}<br/>
        <strong>Currency:</strong> ${currency}<br/>
        <strong>Currency amount:</strong> ${amount.currencyAmount}<br/>
        <strong>Naira:</strong> ${amount.nairaAmount}<br/>
        <strong>Bank name:</strong> ${bankName}<br/>
        <strong>Account name:</strong> ${accountName}<br/>
        <strong>Account number:</strong> ${accountNumber}<br/>
        <strong>Image:</strong> ${img}
      </p>
    `
  }
  return sgMail.send(message)
}

module.exports.sendSellCryptoUserEmail = ({name, email, currency, amount, bankName, accountName, accountNumber, img}) => {
  const message = {
    from: {
      name: 'Support@YZXchange.com',
      email: verifiedEmail
    },
    to: email,
    subject: 'Sell Crypto Request',
    text: `Your request to sell crypto is processing
      Name: ${name}\n
      currency: ${currency}
      Currency amount: ${amount.currencyAmount}\n
      Naira: ${amount.nairaAmount}\n
      Bank name: ${bankName}\n
      Account name: ${accountName}
      Account number: ${accountNumber}\n
      Image: ${img}
    `,
    html: `
      <div>
        <h3>Your request is to sell crypto is processing</h3>
        <h4>Here are your details:</h4>
        <p>
          <strong>Name:</strong> ${name}<br/>
          <strong>Currency:</strong> ${currency}<br/>
          <strong>Currency amount:</strong> ${amount.currencyAmount}<br/>
          <strong>Naira:</strong> ${amount.nairaAmount}<br/>
          <strong>Bank name:</strong> ${bankName}<br/>
          <strong>Account name:</strong> ${accountName}<br/>
          <strong>Account number:</strong> ${accountNumber}<br/>
          <strong>Image:</strong> <a href='${img}'>view image</a>
        </p>
      </div>
    `
  }
  return sgMail.send(message)
}

module.exports.addFundsAdminEmail = ({bankName, accountName, amount, img}, date) => {
  const message = {
    from: {
      name: 'Support@YZXchange.com',
      email: verifiedEmail
    },
    to: verifiedEmail,
    subject: 'Add funds request',
    text: `
      Bank name: ${bankName}\n
      Account name: ${accountName}
      Amount: ${amount}\n
      Image: ${img}\n
      Date: ${date}
    `,
    html: `
      <div>
        <p>
          <strong>Bank name:</strong> ${bankName}<br/>
          <strong>Account name:</strong> ${accountName}<br/>
          <strong>Amount:</strong> ${amount}<br/>
          <strong>Image:</strong> ${img}<br/>
          <strong>Date:</strong> ${date}
        </p>
      </div>
    `
  }
  return sgMail.send(message)
}

module.exports.addFundsUserEmail = ({bankName, email, accountName, amount, img}, date) => {
  const message = {
    from: {
      name: 'Support@YZXchange.com',
      email: verifiedEmail
    },
    to: email,
    subject: 'Add Funds Request',
    text: `Your request to fund your wallet is processing. 
      Bank name: ${bankName}\n
      Account name: ${accountName}
      Amount: ${amount}\n
      Image: ${img}\n
      Date: ${date}
    `,
    html: `
      <div>
        <h3>Your request to fund your wallet is processing.</h3>
        <h4>Here are your details:</h4>
        <p>
        <strong>Bank name:</strong> ${bankName}<br/>
        <strong>Account name:</strong> ${accountName}<br/>
        <strong>Amount:</strong> ${amount}<br/>
        <strong>Image:</strong> ${img}<br/>
        <strong>Date:</strong> ${date}
        </p>
      </div>
    `
  }
  return sgMail.send(message)
}

module.exports.sendIdVerifyAdminEmail = ({name, phoneNumber, idNumber, idType, selfieImage, movImage}) => {
  const message = {
    from: {
      name: 'Support@YZXchange.com',
      email: verifiedEmail
    },
    to: verifiedEmail,
    subject: 'New user verification',
    text: `
      Name: ${name}\n
      Phone number ${phoneNumber}
      ID number ${idNumber}\n
      ID type ${idType}\n
      Means of Verification image: ${movImage}\n
      Selfie image: ${selfieImage}
    `,
    html: `
      <p>
        <strong>Name:</strong> ${name}<br/>
        <strong>Phone number</strong> ${phoneNumber}<br/>
        <strong>ID number</strong> ${idNumber}<br/>
        <strong>ID type</strong> ${idType}<br/>
        <strong>Means of Verification image:</strong> ${movImage}<br/>
        <strong>Selfie image:</strong> ${selfieImage}
      </p>
    `
  }
  return sgMail.send(message)
}

module.exports.sendIdVerifyUserEmail = ({name, email, phoneNumber, idNumber, idType, selfieImage, movImage}) => {
  const message = {
    from: {
      name: 'Support@YZXchange.com',
      email: verifiedEmail
    },
    to: email,
    subject: 'New user verification',
    text: `These are the details you submitted for cerification. We will process it shortly and get back to you.
      Name: ${name}\n
      Phone number: ${phoneNumber}
      ID number: ${idNumber}\n
      ID type: ${idType}\n
      Means of Verification image: ${movImage}\n
      Selfie image: ${selfieImage}
    `,
    html: `
      <div>
        <h3>These are the details you submitted for cerification. We will process it shortly and get back to you.</h3>
        <p>
          <strong>Name:</strong> ${name}<br/>
          <strong>Phone number:</strong> ${phoneNumber}<br/>
          <strong>ID number:</strong> ${idNumber}<br/>
          <strong>ID type:</strong> ${idType}<br/>
          <strong>Means of Verification image:</strong> ${movImage}<br/>
          <strong>Selfie image:</strong> ${selfieImage}
        </p>
      </div>
    `
  }
  return sgMail.send(message)
}

module.exports.lockFundsAdminEmail = ({name, amount, monthsDuration}, date) => {
  const message = {
    from: {
      name: 'Support@YZXchange.com',
      email: verifiedEmail
    },
    to: verifiedEmail,
    subject: 'Lock funds request',
    text: `
      Name: ${name}\n
      Amount: ${amount}\n
      Duration: ${monthsDuration} months\n
      Date: ${date}
    `,
    html: `
      <p>
        <strong>Name:</strong> ${name}<br/>
        <strong>Amount:</strong> ${amount}<br/>
        <strong>Duration:</strong> ${monthsDuration} months<br/>
        <strong>Date:</strong> ${date}
      </p>
    `
  }
  return sgMail.send(message)
}

module.exports.lockFundsUserEmail = ({name, email, amount, monthsDuration}, date) => {
  const message = {
    from: {
      name: 'Support@YZXchange.com',
      email: verifiedEmail
    },
    to: email,
    subject: 'Lock funds',
    text: `You have successfully submitted your request to lock your funds. Your details are below.
      Name: ${name}\n
      Amount ${amount}\n
      Duration ${monthsDuration} months\n
      Date: ${date}
    `,
    html: `
      <div>
        <h3>You have successfully submitted your request to lock your funds. Your details are below.</h3>
        <p>
          <strong>Name:</strong> ${name}<br/>
          <strong>Amount:</strong> ${amount}<br/>
          <strong>Duration:</strong> ${monthsDuration} months<br/>
          <strong>Date:</strong> ${date}
        </p>
        <p>Please contact Support if you didn’t initiate this Transaction.</p><br/>
        Support@YZXchange.com
      </div>
    `
  }
  return sgMail.send(message)
}
