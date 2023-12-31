const bcrypt = require('bcryptjs') // 載入 bcrypt
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => { /// /負責 render 註冊的頁面
    res.render('signup')
  },
  signUp: (req, res, next) => { /// /負責實際處理註冊的行為
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    // 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // 前面加 return
      })
      .then(hash => User.create({ // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！') // 並顯示成功訊息
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants') /// / 動作裡看起來沒有任何的邏輯，就直接轉址了，這是因為等一下我們會用 Passport 的 middleware 來處理，所以不必自己實作
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout() // 這個方法會把 user id 對應的 session 清除掉，對伺服器來說 session 消失就等於是把使用者登出了
    res.redirect('/signin')
  }
}
module.exports = userController
