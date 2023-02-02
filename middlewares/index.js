const isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('auth/login');
  }
};

const isLoggedTattooer = (req, res, next) => {
  console.log(req.session.currentUser)
  if (req.session.currentUser.userRole === "tattooer") {
    console.log("no soy tattooer")
    next();
  } else {
    console.log("sí soy tattooer")
    res.redirect('auth/login');
  }
};

const isLoggedUser = (req, res, next) => {
  if (req.session.currentUser.userRole === "user") {
    console.log("sí soy user")
    next();
  } else {
    console.log("no soy user")
    res.redirect('auth/login');
  }
};

module.exports = {
  isLoggedIn,
  isLoggedTattooer,
  isLoggedUser
}