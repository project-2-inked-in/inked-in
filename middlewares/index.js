const isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('auth/login');
  }
};

const isLoggedButOut = (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/welcome');
  } else {
    next();
  }
};

const isLoggedTattooer = (req, res, next) => {
  if (req.session.currentUser.userRole === "tattooer") {
    next();
  } else {
    res.redirect('auth/login');
  }
};

const isLoggedUser = (req, res, next) => {
  if (req.session.currentUser.userRole === "user") {
    next();
  } else {
    res.redirect('auth/login');
  }
};

module.exports = {
  isLoggedIn,
  isLoggedTattooer,
  isLoggedUser,
  isLoggedButOut
}