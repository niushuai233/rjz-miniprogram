const request = require('request')
const mongoose = require('mongoose')
const config = require('../config.js')

const User = mongoose.model("User");
module.exports = async (ctx, next) => {
    let user = ctx.state.userDoc
    
    if (ctx.request.body.recordType == 0) {
        user.payCategoryList.push(ctx.request.body)
    } else if (ctx.request.body.recordType == 1){
        user.incomeCategoryList.push(ctx.request.body)
    }
    await user.save()
    ctx.body = { statusCode: 200, message: '添加分类成功', code: 1};
}
