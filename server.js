const http = require('http');
const PORT = 8000;
const url = require('url');
const qs = require('qs');
const HomeController = require("./src/controllers/home.controller");
const OrderController = require("./src/controllers/order.controller");


const homeController = new HomeController();
const orderController = new OrderController();

const server = http.createServer(((req, res) => {
    let urlPath = url.parse(req.url);
    //console.log(urlPath)
    // router
    switch (urlPath.pathname){
        case "/":
            homeController.showHomePage(req, res);
            break;
        case "/orders":
            orderController.index(req, res);
            break;
        case "/orders/detail":
            let id = qs.parse(urlPath.query).id;
            orderController.getDetail(req, res, id);
            break;
        default:
            res.end();

    }
}))

server.listen(PORT, 'localhost', () => {
    console.log('Server running on port ' + PORT)
});
