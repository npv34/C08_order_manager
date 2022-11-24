const BaseController = require('./base.controller')
const _handle = require("../../handler/_handle");
const qs = require('qs');
const fs = require('fs');

class LoginController extends BaseController{
    async showFormLogin(req, res){

        // lay cookie tu request
        let cookie = req.headers.cookie;
        let sessionID = qs.parse(cookie).uId;
        let dataFormLogin = await _handle.getTemplate('./views/login.html');

        fs.readFile("sessions/" + sessionID + ".txt", (err, data) => {
            if (err) {
                res.writeHead(200, {'Content-type': "text/html"});
                res.write(dataFormLogin);
                return res.end();
            }

            // kiem tra thong tin

            // cho  vao trang home
            res.writeHead(301, {Location: '/orders'})
            return res.end();
        })


    }

    async login(req, res){
        let data = ""
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async () => {

            let dataLogin = qs.parse(data);
            let sql = `SELECT COUNT(id) as totalUser FROM users WHERE email = "${dataLogin.email}" AND password = "${dataLogin.password}"`;
            let result = await this.querySQL(sql);
            if (result[0].totalUser === 0) {
                res.writeHead(301, {Location: '/login'})
                res.end();
            } else {
                // tao session
                let data = {
                    user: {
                        email: dataLogin.email,
                        password: dataLogin.password,
                    },
                    expires: Date.now() + 60 * 1000 * 2
                }

                // tao ten file luu session
                let nameFile = Date.now();

                let session = JSON.stringify(data);
                // luu vao file
                fs.writeFile('sessions/' + nameFile + ".txt", session, err => {
                    if (err) {
                        throw new Error(err.message)
                    }
                })

                // set cookie trong header response
                res.setHeader('Set-Cookie',  "uId="+JSON.stringify(nameFile))
                res.writeHead(301, {Location: '/orders'})
                res.end();
            }
        })
    }
}

module.exports = LoginController;
