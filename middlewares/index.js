const isLoggedIn = (req, res, next) => {
  if (req.session.currentUser.userRole === "user" || req.session.currentUser.userRole === "tattooer") {
    next();
  } else {
    res.redirect('auth/login');
  }
};

const isLoggedTattooer = (req, res, next) => {
  if (!req.session.currentUser.userRole === "tattooer") {
    res.redirect('auth/login');
  } else {
    next();
  }
};

const isLoggedUser = (req, res, next) => {
  if (!req.session.currentUser.userRole === "user") {
    res.redirect('auth/login');
  } else {
    next();
  }
};

module.exports = {
  isLoggedIn,
  isLoggedTattooer,
  isLoggedUser
}