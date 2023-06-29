module.exports = {
  generalErrorHandler (err, req, res, next) {
    if (err instanceof Error) { /// /判斷傳入的 err 是不是一個 Error 物件
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`) // 如果不是 Error 物件，可能傳進來一堆錯誤報告，直接把字串印出來即可
    }
    res.redirect('back') /// 把使用者導回錯誤發生的前一頁 。因為使用者是從前一頁來的，表示前一頁應該是沒問題
    next(err) /// 把 Error 物件傳給下一個error handler，在更正規的開發程序中，會再細分錯誤的類型 Error Handler，例如：資料庫出錯、伺服器運作錯誤、網路連線失敗...等狀況，一個一個往下判斷接到的錯誤是哪種類型、要做哪些對應的處理或提示。所以 err 傳下去可以做為伺服器運作錯誤的 log，或是其他用途
  }
}
