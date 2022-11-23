const _handle = require("../../handler/_handle");
const connection = require("../model/DBConnect");
const BaseController = require("./base.controller");

class OrderController extends BaseController {

    async index(req, res) {
        const sql = 'SELECT * FROM orders LIMIT 10';
        let orders = await this.querySQL(sql);

        let html = "";

        orders.forEach((order, index) => {
            let date = new Date(order.orderDate);
            let orderDate = date.toLocaleString()
            html += "<tr>";
            html += `<td>${index + 1}</td>`;
            html += `<td>${order.orderNumber}</td>`;
            html += `<td>${orderDate}</td>`;
            html += `<td>${order.status}</td>`;
            html += `<td><a class="btn btn-primary" href="/orders/detail?id=${order.orderNumber}">Detail</a></td>`;
            html += "</tr>";
        })

        let data = await _handle.getTemplate('./views/order/index.html')
        data = data.replace('{order-list}', html)
        res.writeHead(200, {'Content-type': 'text/html'});
        res.write(data);
        res.end();
    }

    async getDetail(req, res, id) {
        const sql = `call get_order_detail_customer(${id})`;
        let results = await this.querySQL(sql);
        let dataSQL = results[0];

        let data = await _handle.getTemplate('./views/order/detail.html')
        data = data.replace('{order_number}', dataSQL[0].orderNumber);
        data = data.replace('{customer_name}', dataSQL[0].customerName);

        let html = "";

        dataSQL.forEach((item, index) => {
            html += "<tr>";
            html += `<td>${index + 1}</td>`;
            html += `<td>${item.productCode}</td>`;
            html += `<td>${item.productName}</td>`;
            html += `<td>${item.quantityOrdered}</td>`;
            html += `<td>${item.priceEach}</td>`;
            html += "</tr>";
        })

        data = data.replace('{list_products}', html);
        res.writeHead(200, {'Content-type': 'text/html'});
        res.write(data);
        res.end();
    }
}

module.exports = OrderController;
