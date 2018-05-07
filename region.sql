CREATE TABLE `k_region` (
  `id` int(11) NOT NULL COMMENT '区域id',
  `name` varchar(11) NOT NULL COMMENT '名字',
  `thinspell` varchar(22) NOT NULL COMMENT '简拼',
  `fullspell` varchar(55) NOT NULL COMMENT '全拼',
  `parent_id` int(11) NOT NULL COMMENT '父级区域ID',
  `layer` tinyint(4) NOT NULL COMMENT '层级',
  `local_name` varchar(55) NOT NULL COMMENT '本土名字',
  `luoma` varchar(55) NOT NULL COMMENT '罗马标识',
  `path` varchar(15) NOT NULL COMMENT '路径',
  `code` varchar(6) NOT NULL COMMENT '邮政编码',
  `initial` char(1) NOT NULL COMMENT '首字母',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
