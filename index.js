const request = require('request');
const settings = {
    host: "127.0.0.1",
    user: "emma",
    password: "shaoruijuan",
    database: "car"
};
const qb = require('node-querybuilder').QueryBuilder(settings, 'mysql');
const table = 'k_region';

// 爬取省级
var shengUrl = 'http://cnis.7east.com/widget.do?type=service&ajax=yes&action=cnislist';
var subUrl = 'http://cnis.7east.com/widget.do?type=service&action=cnischildlist&a=2&ajax=yes&pid=';


request.get(shengUrl, function(error, response, body) {
    if (response && response.statusCode == 200) {
        console.log('省级获取');
        var json = JSON.parse(body);
        if (json.rows.length) {
            for (var i=0; i<json.rows.length; i++) {
                var layer1 = json.rows[i];
                insertRegion(layer1);

                // 获取对应的下辖市
                request.get(subUrl + layer1.region_id, function(error, response, body){
                    if (response && response.statusCode == 200) {
                        console.log('地级市获取');
                        var json = JSON.parse(body);
                        if (json.rows.length) {
                            for (var i=0; i<json.rows.length; i++) {
                                var layer2 = json.rows[i];
                                insertRegion(layer2);

                                // 获取对应的下辖区
                                request.get(subUrl + layer2.region_id, function(error, response, body){
                                    if (response && response.statusCode == 200) {
                                        console.log('区级获取');
                                        var json = JSON.parse(body);
                                        if (json.rows.length) {
                                            for (var i=0; i<json.rows.length; i++) {
                                                var layer3 = json.rows[i];
                                                insertRegion(layer3);
                                            }
                                        }
                                    } else {
                                        console.log('errror:', error);
                                        console.log('statusCode:', response && response.statusCode);
                                        console.log('body:', body);
                                    }
                                });
                            }
                        }
                    } else {
                        console.log('errror:', error);
                        console.log('statusCode:', response && response.statusCode);
                        console.log('body:', body);
                    }
                });
            }
        }
    } else {
        console.log('errror:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
    }
});

// 插入地区
function insertRegion(row) {
    name = row.name.replace(/市$/, '');
    fullspell = row.fullspell.replace(/_shi$/, '');

    var data = {
        id: row.region_id,
        name: name,
        code: row.code,
        fullspell: fullspell,
        thinspell: row.thinspell,
        parent_id: row._parentId,
        path: row.region_path,
        luoma: row.luoma,
        initial: row.fullspell.charAt(0),
        layer: row.layer,
        local_name: row.local_name
    };
    qb.insert(table, data, (err, res)=>{
        if (err) { // 如果是重复的错误，可进行更新
            throw err;
        } else { // 插入成功
            // console.log(res.affectedRows + '条记录插入成功');
        }
    });
}