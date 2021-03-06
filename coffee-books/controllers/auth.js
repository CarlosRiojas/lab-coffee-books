const bcrypt = require("bcrypt")
const User = require("../models/User")
const passport = require("../config/passport")

exports.signupView = (req, res) => res.render("auth/signup")

//controller del regular login
exports.signupProcess = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.render("auth/signup", {
        errorMessage: "provide  email and password"
      })
    }
    const user = await User.findOne({ email })
  if (user) {
    return res.render("auth/signup", {
      errorMessage: "Error"
    })
  }

  const salt = bcrypt.genSaltSync(12)
  const hashPass = bcrypt.hashSync(password, salt)
  await User.create({
    email,
    password: hashPass
  })
  res.redirect("/login")
}

exports.loginView = (req, res) => {
    res.render("auth/login", { errorMessage: req.flash("error") })
  }

  exports.loginProcess = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })

  exports.privatePage = (req, res) => {
    res.render("private", req.user)
  }

  exports.logout = (req, res) => {
    req.logout()
    res.redirect("/login")
  }

//Exports de facebook

  exports.facebookInit= passport.authenticate("facebook")
  exports.facebookCb = passport.authenticate("facebook",{
      successRedirect: "/private-page",
      failureRedirect: "/login"  
  })


  //exports de google
  exports.googleInit = passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })

  exports.googleCb = passport.authenticate("google", {
    successRedirect: "/private-page",
    failureRedirect: "/login"
  })
  