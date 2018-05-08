console.log('开始时间(ms): ' + Date.now());
const request = require('request');
const settings = require('./connection.json');

const qb = require('node-querybuilder').QueryBuilder(require('./connection.json'), 'mysql');
const table = 'k_region';

// 爬取省级
var shengUrl = 'http://cnis.7east.com/widget.do?type=service&ajax=yes&action=cnislist';
var subUrl = 'http://cnis.7east.com/widget.do?type=service&action=cnischildlist&a=2&ajax=yes&pid=';

request.get(shengUrl, function(error, response, body) {
    if (response && response.statusCode == 200) {
        var json = JSON.parse(body);
        if (json.rows.length) {
            for (var i=0; i<json.rows.length; i++) {
                var layer1 = json.rows[i];
                updateOrCreate(layer1);

                // 获取对应的下辖市
                request.get(subUrl + layer1.region_id, function(error, response, body){
                    if (response && response.statusCode == 200) {
                        var json = JSON.parse(body);
                        if (json.rows.length) {
                            for (var i=0; i<json.rows.length; i++) {
                                var layer2 = json.rows[i];
                                updateOrCreate(layer2);

                                // 获取对应的下辖区
                                getUrl(layer2);
                            }
                        }
                    } else {
                        console.log(layer1 + '下的市级获取errror:', error);
                    }
                });
            }
        }
    } else {
        console.log('省级获取error:', error);
    }
});

// 插入地区
function updateOrCreate(row) {
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

    qb.select('id').where({id: data.id}).get(table, (err,res)=>{
        if(err) {
            console.log(data);
            throw err;
        }
        if (res.length) { // 存在进行更新
            qb.update(table, data, {id: data.id}, (err, res)=>{
                if(err) {
                    console.log(data);
                    throw err;
                } else {
                    console.log(data.id + '更新 时间(ms):' + Date.now());
                }
            });
        } else { // 不存在进行新增
            qb.insert(table, data, (err, res)=>{
                if(err) {
                    console.log(data);
                    throw err;
                } else {
                    console.log(data.id + '新增 时间(ms):' + Date.now());
                }
            });
        }
    });
}

/**
 * 获取市级城市下的区级信息
 * @param  json layer2 地级市信息
 * @return 无
 */
function getUrl(layer2) {
    request.get(subUrl + layer2.region_id, function(error, response, body){
        if (response && response.statusCode == 200) {
            var json = JSON.parse(body);
            if (json.rows.length) {
                for (var i=0; i<json.rows.length; i++) {
                    var layer3 = json.rows[i];
                    updateOrCreate(layer3);
                }
            }
        } else {
            console.log( layer2 + '下的区级获取errror:', error);
        }
    });
}