# 爬取中国行政区域
### 数据源
[全国行政区化代码管理系统]http://cnis.7east.com/
爬取地区数据落入mysql数据库，具有全拼、简拼、首字母等字段
sql建表语句如 region.sql

使用js爬取数据比较快，因为不需要等待，可以并发，因为发出第二个请求不需要等第一个请求结束

### json地址
*省级*
> http://cnis.7east.com/widget.do?type=service&ajax=yes&action=cnislist

*市区级*
> http://cnis.7east.com/widget.do?type=service&action=cnischildlist&a=2&ajax=yes&pid=22

### installation
*依赖安装*
> cnpm install request
> cnpm install mysql
> cnpm install node-querybuilder

### configure
> 需要数据库连接配置，connection.json

### 特殊说明
地级市 的地名由于行政划分后缀一般有市，为了网站友好展示，地级市中包含的尾部市去除

### 执行命令
> node index.js
> 用node 获取省市区一共花费14秒，非常快，
> 不用顺序等待，相当于并发而且不需要考虑竞争死锁等，太方便强大 