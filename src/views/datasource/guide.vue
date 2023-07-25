<template>
    <div>
        <span>
            <div style="font-size: 14px; margin: 0; padding: 0; width: 100%;">
                <div style="line-height: 160%; box-sizing: content-box;">
                    <ul style="line-height: 160%; box-sizing: content-box; display: block; list-style-type: disc; padding-left: 30px; margin: 6px 0 10px; color: #333;">
                        <li style="line-height: 160%; box-sizing: content-box; position: relative;">
                            <a  @click="anchor('anchor_1')" style="line-height: 160%; box-sizing: content-box; text-decoration: underline; color: #5286bc;">平台自定义JDBC连接时，相关产品驱动包配置</a>
                            <ul style="line-height: 160%; box-sizing: content-box; display: block; list-style-type: disc; padding-left: 30px; margin: 6px 0 10px; color: #333; margin-top: 0; margin-bottom: 0;">
                                <li style="line-height: 160%; box-sizing: content-box; position: relative;"><a @click="anchor('anchor_2')" style="line-height: 160%; box-sizing: content-box; text-decoration: underline; color: #5286bc;">1. 常见关系型数据库JDBC驱动</a></li>
                                <li style="line-height: 160%; box-sizing: content-box; position: relative;"><a @click="anchor('anchor_3')" style="line-height: 160%; box-sizing: content-box; text-decoration: underline; color: #5286bc;">2.华为大数据平台-Loader</a>
                                    <ul style="line-height: 160%; box-sizing: content-box; display: block; list-style-type: disc; padding-left: 30px; margin: 6px 0 10px; color: #333; margin-top: 0; margin-bottom: 0;">
                                        <li style="line-height: 160%; box-sizing: content-box; position: relative;"><a @click="anchor('anchor_21')" style="line-height: 160%; box-sizing: content-box; text-decoration: underline; color: #5286bc;">2.1 获取驱动存放路径</a></li>
                                        <li style="line-height: 160%; box-sizing: content-box; position: relative;"><a @click="anchor('anchor_22')" style="line-height: 160%; box-sizing: content-box; text-decoration: underline; color: #5286bc;">2.2 修改驱动权限</a></li>
                                        <li style="line-height: 160%; box-sizing: content-box; position: relative;"><a @click="anchor('anchor_23')" style="line-height: 160%; box-sizing: content-box; text-decoration: underline; color: #5286bc;">2.3 重启服务</a></li>
                                    </ul>
                                </li>
                                <li style="line-height: 160%; box-sizing: content-box; position: relative;"><a style="line-height: 160%; box-sizing: content-box; text-decoration: underline; color: #5286bc;" @click="anchor('anchor_30')">3.其他大数据平台-Sqoop2</a>
                                    <ul style="line-height: 160%; box-sizing: content-box; display: block; list-style-type: disc; padding-left: 30px; margin: 6px 0 10px; color: #333; margin-top: 0; margin-bottom: 0;">
                                        <li style="line-height: 160%; box-sizing: content-box; position: relative;"><a @click="anchor('anchor_31')" style="line-height: 160%; box-sizing: content-box; text-decoration: underline; color: #5286bc;">3.1 获取驱动存放路径</a></li>
                                        <li style="line-height: 160%; box-sizing: content-box; position: relative;"><a @click="anchor('anchor_32')" style="line-height: 160%; box-sizing: content-box; text-decoration: underline; color: #5286bc;">3.2 修改驱动权限</a></li>
                                        <li style="line-height: 160%; box-sizing: content-box; position: relative;"><a @click="anchor('anchor_33')" style="line-height: 160%; box-sizing: content-box; text-decoration: underline; color: #5286bc;">3.3 重启服务</a></li>
                                    </ul>
                                </li>
                                <li style="line-height: 160%; box-sizing: content-box; position: relative;"><a style="line-height: 160%; box-sizing: content-box; text-decoration: underline; color: #5286bc;" @click="anchor('anchor_40')">4.ETL工具-kettle</a>
                                    <ul style="line-height: 160%; box-sizing: content-box; display: block; list-style-type: disc; padding-left: 30px; margin: 6px 0 10px; color: #333; margin-top: 0; margin-bottom: 0;">
                                        <li style="line-height: 160%; box-sizing: content-box; position: relative;"><a @click="anchor('anchor_41')" style="line-height: 160%; box-sizing: content-box; text-decoration: underline; color: #5286bc;">4.1 获取驱动存放路径</a></li>
                                        <li style="line-height: 160%; box-sizing: content-box; position: relative;"><a @click="anchor('anchor_42')" style="line-height: 160%; box-sizing: content-box; text-decoration: underline; color: #5286bc;">4.2 修改驱动权限</a></li>
                                        <li style="line-height: 160%; box-sizing: content-box; position: relative;"><a @click="anchor('anchor_43')" style="line-height: 160%; box-sizing: content-box; text-decoration: underline; color: #5286bc;">4.3 重启服务</a></li>
                                    </ul>
                                </li>
                                <li style="line-height: 160%; box-sizing: content-box; position: relative;"><a @click="anchor('anchor_50')" style="line-height: 160%; box-sizing: content-box; text-decoration: underline; color: #5286bc;">5.ETL工具-datax</a>
                                    <ul style="line-height: 160%; box-sizing: content-box; display: block; list-style-type: disc; padding-left: 30px; margin: 6px 0 10px; color: #333; margin-top: 0; margin-bottom: 0;"><li style="line-height: 160%; box-sizing: content-box; position: relative;"><a @click="anchor('anchor_51')" style="line-height: 160%; box-sizing: content-box; text-decoration: underline; color: #5286bc;">5.1 获取驱动存放路径</a></li>
                                        <li style="line-height: 160%; box-sizing: content-box; position: relative;"><a @click="anchor('anchor_52')" style="line-height: 160%; box-sizing: content-box; text-decoration: underline; color: #5286bc;">5.2 修改驱动权限</a></li>
                                        <li style="line-height: 160%; box-sizing: content-box; position: relative;"><a @click="anchor('anchor_53')" style="line-height: 160%; box-sizing: content-box; text-decoration: underline; color: #5286bc;">5.3 重启服务</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div style="padding: 0 25px;">
                    <h1 id="anchor_1" style="line-height: 160%; box-sizing: content-box; font-weight: 700; font-size: 28px; border-bottom: 3px double #999; color: #000; margin-top: 14px;">平台自定义JDBC连接时，相关产品驱动包配置</h1>
    <p style="line-height: 160%; box-sizing: content-box; margin: 10px 0; color: #333;">清洗融合产品和共享交换产品，如果使用了自定义JDBC连接，在任务执行时，需要将相应的JDBC驱动包，上传到ETL服务器或大数据平台Sqoop的指定位置，并重启相应的服务。否则，任务执行过程中将会遇到找不到驱动类的错误，最终导致任务失败。</p>
    <h2 id="anchor_2" style="line-height: 160%; box-sizing: content-box; font-weight: 700; font-size: 34px; border-bottom: 1px solid #dbdbdb; color: #333;">1. 常见关系型数据库JDBC驱动</h2>
    <p style="line-height: 160%; box-sizing: content-box; margin: 10px 0; color: #333;">以下驱动是在开发测试环境验证过的，如有新的JDBC驱动，以实际测试为准</p>
    <table style="margin: 2px 0 14px; color: #333; width: auto; border-collapse: collapse; box-sizing: border-box;"><thead
        style="line-height: 160%; box-sizing: content-box;"><tr style="line-height: 160%; box-sizing: content-box;"><th
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #72777b; border-top: 0; background-color: #7b8184; font-weight: 300; color: #fff; padding-top: 6px;">序号</th><th
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #72777b; border-top: 0; background-color: #7b8184; font-weight: 300; color: #fff; padding-top: 6px;">数据库类型</th><th
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #72777b; border-top: 0; background-color: #7b8184; font-weight: 300; color: #fff; padding-top: 6px;">驱动包名称</th><th
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #72777b; border-top: 0; background-color: #7b8184; font-weight: 300; color: #fff; padding-top: 6px;">驱动类</th></tr></thead><tbody
        style="line-height: 160%; box-sizing: content-box;"><tr style="line-height: 160%; box-sizing: content-box;"><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">1</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">gaussdb100</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">com.huawei.gauss.jdbc.ZenithDriver-GaussDB_100_1.0.0.B019.jar</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">com.huawei.gauss.jdbc.ZenithDriver</td></tr><tr
        style="line-height: 160%; box-sizing: content-box;"><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;"></td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">连接示例:</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">jdbc:zenith:@host:4000</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;"></td></tr><tr
        style="line-height: 160%; box-sizing: content-box;"><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">2</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">gaussdb200</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">驱动1：gsjdbc200.jar</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">com.huawei.gauss200.jdbc.Driver</td></tr><tr
        style="line-height: 160%; box-sizing: content-box;"><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;"></td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">连接示例:</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">jdbc:gaussdb://host:25308/postgres</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;"></td></tr><tr
        style="line-height: 160%; box-sizing: content-box;"><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;"></td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;"></td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">驱动2：gsjdbc4.jar</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">org.postgresql.Driver</td></tr><tr
        style="line-height: 160%; box-sizing: content-box;"><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;"></td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">连接示例:</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">jdbc:postgresql://host:25308/postgres</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;"></td></tr><tr
        style="line-height: 160%; box-sizing: content-box;"><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">3</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">sqlserver</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">jtds.jar</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">net.sourceforge.jtds.jdbc.Driver</td></tr><tr
        style="line-height: 160%; box-sizing: content-box;"><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;"></td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">连接示例：</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">jdbc:jtds:sqlserver://host:1433</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;"></td></tr><tr
        style="line-height: 160%; box-sizing: content-box;"><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">4</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">mysql</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">mysql-connector-java-5.1.34.jar</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">com.mysql.jdbc.Driver</td></tr><tr
        style="line-height: 160%; box-sizing: content-box;"><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;"></td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">连接示例：</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">jdbc:mysql://host:3306/database_name</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;"></td></tr><tr
        style="line-height: 160%; box-sizing: content-box;"><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">5</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">oracle</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">ojdbc7.jar</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">oracle.jdbc.OracleDriver</td></tr><tr
        style="line-height: 160%; box-sizing: content-box;"><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;"></td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">连接示例：</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">jdbc:oracle:thin:@host:1521/sid</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;"></td></tr><tr
        style="line-height: 160%; box-sizing: content-box;"><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">6</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">gbase8</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">gbase-connector-java-8.8.jar</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">com.gbase.jdbc.Driver</td></tr><tr
        style="line-height: 160%; box-sizing: content-box;"><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;"></td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">连接示例：</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">jdbc:gbase://host:5258/database_name</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;"></td></tr><tr
        style="line-height: 160%; box-sizing: content-box;"><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">7</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">postgresql</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">postgresql.jar</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">org.postgresql.Driver</td></tr><tr
        style="line-height: 160%; box-sizing: content-box;"><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;"></td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">连接示例：</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;">jdbc:postgresql://host:5432/database_name</td><td
        style="line-height: 160%; box-sizing: content-box; padding: 5px 14px 5px 12px; border: 1px solid #eaeaea;"></td></tr></tbody></table>
    <p style="line-height: 160%; box-sizing: content-box; margin: 10px 0; color: #333;">具体从以下几类组件说明如何新增JDBC驱动包，当产品使用到相关组件时，按此操作配置即可。</p>
    <h2 id="anchor_3" style="line-height: 160%; box-sizing: content-box; font-weight: 700; font-size: 34px; border-bottom: 1px solid #dbdbdb; color: #333;">2.华为大数据平台-Loader</h2>
    <h3 id="anchor_21" style="line-height: 160%; box-sizing: content-box; font-weight: 700; font-size: 27px; color: #333;">2.1 获取驱动存放路径</h3>
    <p style="line-height: 160%; box-sizing: content-box; margin: 10px 0; color: #333;">获取关系型数据库对应的驱动jar包保存在Loader服务主备节点的lib路径：</p>
    <pre style="line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; margin: 2px 0 8px; background-color: #f5f7f8;"><code
        style="display: block; overflow-x: auto; background: #1e1e1e; line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; letter-spacing: -.3px; padding: 18px; color: #f4f4f4; white-space: pre-wrap;">HDC60:
    /opt/huawei/Bigdata/FusionInsight_V100R002C60U20/FusionInsight-Sqoop-1.99.3/FusionInsight-Sqoop-1.99.3/server/webapps/loader/WEB-INF/lib

    HDC80:
    /opt/huawei/Bigdata/FusionInsight_Porter_V100R002C80SPC200/install/FusionInsight-Sqoop-1.99.3/FusionInsight-Sqoop-1.99.3/server/webapps/loader/WEB-INF/lib

    HD6.5：
    /opt/huawei/Bigdata/FusionInsight_Porter_6.5.1/install/FusionInsight-Sqoop-1.99.3/FusionInsight-Sqoop-1.99.3/server/webapps/loader/WEB-INF/lib
    </code></pre>
    <h3 id="anchor_22" style="line-height: 160%; box-sizing: content-box; font-weight: 700; font-size: 27px; color: #333;">2.2 修改驱动权限</h3>
    <p style="line-height: 160%; box-sizing: content-box; margin: 10px 0; color: #333;">使用root用户在主备节点分别执行以下命令修改权限：</p>
    <pre style="line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; margin: 2px 0 8px; background-color: #f5f7f8;"><code
        style="display: block; overflow-x: auto; background: #1e1e1e; line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; letter-spacing: -.3px; padding: 18px; color: #f4f4f4; white-space: pre-wrap;">chown omm:wheel jar包文件名
    chmod 600 jar包文件名
    </code></pre>
    <h3 id="anchor_23" style="line-height: 160%; box-sizing: content-box; font-weight: 700; font-size: 27px; color: #333;">2.3 重启服务</h3>
    <p style="line-height: 160%; box-sizing: content-box; margin: 10px 0; color: #333;">登录FusionInsight Manager系统，选择“服务管理 &gt; Loader &gt; 更多操作 &gt; 重启服务”输入管理员密码重启Loader服务。</p>
    <h2 id="anchor_30" style="line-height: 160%; box-sizing: content-box; font-weight: 700; font-size: 34px; border-bottom: 1px solid #dbdbdb; color: #333;">3.其他大数据平台-Sqoop2</h2>
    <h3 id="anchor_31" style="line-height: 160%; box-sizing: content-box; font-weight: 700; font-size: 27px; color: #333;">3.1 获取驱动存放路径</h3>
    <p style="line-height: 160%; box-sizing: content-box; margin: 10px 0; color: #333;">sqoop2安装后，专门指定了目录存放第三方JDBC驱动包：</p>
    <pre style="line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; margin: 2px 0 8px; background-color: #f5f7f8;"><code
        style="display: block; overflow-x: auto; background: #1e1e1e; line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; letter-spacing: -.3px; padding: 18px; color: #f4f4f4; white-space: pre-wrap;">/var/lib/sqoop2
    </code></pre>
    <h3 id="anchor_32" style="line-height: 160%; box-sizing: content-box; font-weight: 700; font-size: 27px; color: #333;">3.2 修改驱动权限</h3>
    <p style="line-height: 160%; box-sizing: content-box; margin: 10px 0; color: #333;">使用root用户分别执行以下命令修改权限：</p>
    <pre style="line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; margin: 2px 0 8px; background-color: #f5f7f8;"><code
        style="display: block; overflow-x: auto; background: #1e1e1e; line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; letter-spacing: -.3px; padding: 18px; color: #f4f4f4; white-space: pre-wrap;">chmod 600 jar包文件名
    </code></pre>
    <h3 id="anchor_33" style="line-height: 160%; box-sizing: content-box; font-weight: 700; font-size: 27px; color: #333;">3.3 重启服务</h3>
    <p style="line-height: 160%; box-sizing: content-box; margin: 10px 0; color: #333;">在sqoop2服务器上，执行命令：</p>
    <pre style="line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; margin: 2px 0 8px; background-color: #f5f7f8;"><code
        style="display: block; overflow-x: auto; background: #1e1e1e; line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; letter-spacing: -.3px; padding: 18px; color: #f4f4f4; white-space: pre-wrap;"><span
        style="color: #4ec9b0; line-height: 160%; box-sizing: content-box;">cd</span> <span
        style="color: #bd63c5; line-height: 160%; box-sizing: content-box;">${SQOOP2_HOME}</span>
    ./sqoop2-server stop
    ./sqoop2-server start
    </code></pre>
    <h2 id="anchor_40" style="line-height: 160%; box-sizing: content-box; font-weight: 700; font-size: 34px; border-bottom: 1px solid #dbdbdb; color: #333;">4.ETL工具-kettle</h2>
    <h3 id="anchor_41" style="line-height: 160%; box-sizing: content-box; font-weight: 700; font-size: 27px; color: #333;">4.1 获取驱动存放路径</h3>
    <p style="line-height: 160%; box-sizing: content-box; margin: 10px 0; color: #333;">在ETL服务器上的路径：</p>
    <pre style="line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; margin: 2px 0 8px; background-color: #f5f7f8;"><code
        style="display: block; overflow-x: auto; background: #1e1e1e; line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; letter-spacing: -.3px; padding: 18px; color: #f4f4f4; white-space: pre-wrap;"><span
        style="color: #bd63c5; line-height: 160%; box-sizing: content-box;">${KETTLE_HOME}</span>/lib/
    </code></pre>
    <h3 id="anchor_42" style="line-height: 160%; box-sizing: content-box; font-weight: 700; font-size: 27px; color: #333;">4.2 修改驱动权限</h3>
    <p style="line-height: 160%; box-sizing: content-box; margin: 10px 0; color: #333;">使用root用户执行以下命令修改权限：</p>
    <pre style="line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; margin: 2px 0 8px; background-color: #f5f7f8;"><code
        style="display: block; overflow-x: auto; background: #1e1e1e; line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; letter-spacing: -.3px; padding: 18px; color: #f4f4f4; white-space: pre-wrap;">chmod 600 jar包文件名
    </code></pre>
    <h3 id="anchor_43" style="line-height: 160%; box-sizing: content-box; font-weight: 700; font-size: 27px; color: #333;">4.3 重启服务</h3>
    <pre style="line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; margin: 2px 0 8px; background-color: #f5f7f8;"><code
        style="display: block; overflow-x: auto; background: #1e1e1e; line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; letter-spacing: -.3px; padding: 18px; color: #f4f4f4; white-space: pre-wrap;">sh <span
        style="color: #bd63c5; line-height: 160%; box-sizing: content-box;">${KETTLE_BASE}</span>/stop-carte.sh
    sh <span style="color: #bd63c5; line-height: 160%; box-sizing: content-box;">${KETTLE_BASE}</span>/start-carte.sh
    </code></pre>
    <h2 id="anchor_50" style="line-height: 160%; box-sizing: content-box; font-weight: 700; font-size: 34px; border-bottom: 1px solid #dbdbdb; color: #333;">5.ETL工具-datax</h2>
    <h3 id="anchor_51" style="line-height: 160%; box-sizing: content-box; font-weight: 700; font-size: 27px; color: #333;">5.1 获取驱动存放路径</h3>
    <p style="line-height: 160%; box-sizing: content-box; margin: 10px 0; color: #333;">在ETL服务器上的路径：</p>
    <pre style="line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; margin: 2px 0 8px; background-color: #f5f7f8;"><code
        style="display: block; overflow-x: auto; background: #1e1e1e; line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; letter-spacing: -.3px; padding: 18px; color: #f4f4f4; white-space: pre-wrap;">/datax解压目录/lib
    </code></pre>
    <h3 id="anchor_52" style="line-height: 160%; box-sizing: content-box; font-weight: 700; font-size: 27px; color: #333;">5.2 修改驱动权限</h3>
    <p style="line-height: 160%; box-sizing: content-box; margin: 10px 0; color: #333;">使用root用户执行以下命令修改权限：</p>
    <pre style="line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; margin: 2px 0 8px; background-color: #f5f7f8;"><code
        style="display: block; overflow-x: auto; background: #1e1e1e; line-height: 160%; box-sizing: content-box; border: 0; border-radius: 0; letter-spacing: -.3px; padding: 18px; color: #f4f4f4; white-space: pre-wrap;">chmod 600 jar包文件名
    </code></pre>
    <h3 id="anchor_53" style="line-height: 160%; box-sizing: content-box; font-weight: 700; font-size: 27px; color: #333;">5.3 重启服务</h3>
    <p style="line-height: 160%; box-sizing: content-box; margin: 10px 0; color: #333;">无需重启</p>
                </div>
            </div>
            <center style="display:none !important;visibility:collapse !important;height:0 !important;white-space:nowrap;width:100%;overflow:hidden">%5BTOC%5D%0A%23%20%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%AE%9A%E4%B9%89JDBC%E8%BF%9E%E6%8E%A5%E6%97%B6%EF%BC%8C%E7%9B%B8%E5%85%B3%E4%BA%A7%E5%93%81%E9%A9%B1%E5%8A%A8%E5%8C%85%E9%85%8D%E7%BD%AE%0A%E6%B8%85%E6%B4%97%E8%9E%8D%E5%90%88%E4%BA%A7%E5%93%81%E5%92%8C%E5%85%B1%E4%BA%AB%E4%BA%A4%E6%8D%A2%E4%BA%A7%E5%93%81%EF%BC%8C%E5%A6%82%E6%9E%9C%E4%BD%BF%E7%94%A8%E4%BA%86%E8%87%AA%E5%AE%9A%E4%B9%89JDBC%E8%BF%9E%E6%8E%A5%EF%BC%8C%E5%9C%A8%E4%BB%BB%E5%8A%A1%E6%89%A7%E8%A1%8C%E6%97%B6%EF%BC%8C%E9%9C%80%E8%A6%81%E5%B0%86%E7%9B%B8%E5%BA%94%E7%9A%84JDBC%E9%A9%B1%E5%8A%A8%E5%8C%85%EF%BC%8C%E4%B8%8A%E4%BC%A0%E5%88%B0ETL%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%88%96%E5%A4%A7%E6%95%B0%E6%8D%AE%E5%B9%B3%E5%8F%B0Sqoop%E7%9A%84%E6%8C%87%E5%AE%9A%E4%BD%8D%E7%BD%AE%EF%BC%8C%E5%B9%B6%E9%87%8D%E5%90%AF%E7%9B%B8%E5%BA%94%E7%9A%84%E6%9C%8D%E5%8A%A1%E3%80%82%E5%90%A6%E5%88%99%EF%BC%8C%E4%BB%BB%E5%8A%A1%E6%89%A7%E8%A1%8C%E8%BF%87%E7%A8%8B%E4%B8%AD%E5%B0%86%E4%BC%9A%E9%81%87%E5%88%B0%E6%89%BE%E4%B8%8D%E5%88%B0%E9%A9%B1%E5%8A%A8%E7%B1%BB%E7%9A%84%E9%94%99%E8%AF%AF%EF%BC%8C%E6%9C%80%E7%BB%88%E5%AF%BC%E8%87%B4%E4%BB%BB%E5%8A%A1%E5%A4%B1%E8%B4%A5%E3%80%82%0A%0A%23%23%201.%20%E5%B8%B8%E8%A7%81%E5%85%B3%E7%B3%BB%E5%9E%8B%E6%95%B0%E6%8D%AE%E5%BA%93JDBC%E9%A9%B1%E5%8A%A8%0A%E4%BB%A5%E4%B8%8B%E9%A9%B1%E5%8A%A8%E6%98%AF%E5%9C%A8%E5%BC%80%E5%8F%91%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E9%AA%8C%E8%AF%81%E8%BF%87%E7%9A%84%EF%BC%8C%E5%A6%82%E6%9C%89%E6%96%B0%E7%9A%84JDBC%E9%A9%B1%E5%8A%A8%EF%BC%8C%E4%BB%A5%E5%AE%9E%E9%99%85%E6%B5%8B%E8%AF%95%E4%B8%BA%E5%87%86%0A%E5%BA%8F%E5%8F%B7%7C%E6%95%B0%E6%8D%AE%E5%BA%93%E7%B1%BB%E5%9E%8B%7C%E9%A9%B1%E5%8A%A8%E5%8C%85%E5%90%8D%E7%A7%B0%7C%E9%A9%B1%E5%8A%A8%E7%B1%BB%0A---%7C---%7C---%7C---%0A1%7Cgaussdb100%7Ccom.huawei.gauss.jdbc.ZenithDriver-GaussDB_100_1.0.0.B019.jar%7Ccom.huawei.gauss.jdbc.ZenithDriver%0A%7C%7C%E8%BF%9E%E6%8E%A5%E7%A4%BA%E4%BE%8B%3A%7Cjdbc%3Azenith%3A%40host%3A4000%0A2%7Cgaussdb200%7C%E9%A9%B1%E5%8A%A81%EF%BC%9Agsjdbc200.jar%7Ccom.huawei.gauss200.jdbc.Driver%0A%7C%7C%E8%BF%9E%E6%8E%A5%E7%A4%BA%E4%BE%8B%3A%7Cjdbc%3Agaussdb%3A%2F%2Fhost%3A25308%2Fpostgres%0A%7C%7C%7C%E9%A9%B1%E5%8A%A82%EF%BC%9Agsjdbc4.jar%7Corg.postgresql.Driver%0A%7C%7C%E8%BF%9E%E6%8E%A5%E7%A4%BA%E4%BE%8B%3A%7Cjdbc%3Apostgresql%3A%2F%2Fhost%3A25308%2Fpostgres%0A3%7Csqlserver%7Cjtds.jar%7Cnet.sourceforge.jtds.jdbc.Driver%0A%7C%7C%E8%BF%9E%E6%8E%A5%E7%A4%BA%E4%BE%8B%EF%BC%9A%7Cjdbc%3Ajtds%3Asqlserver%3A%2F%2Fhost%3A1433%0A4%7Cmysql%7Cmysql-connector-java-5.1.34.jar%7Ccom.mysql.jdbc.Driver%0A%7C%7C%E8%BF%9E%E6%8E%A5%E7%A4%BA%E4%BE%8B%EF%BC%9A%7Cjdbc%3Amysql%3A%2F%2Fhost%3A3306%2Fdatabase_name%0A5%7Coracle%7Cojdbc7.jar%7Coracle.jdbc.OracleDriver%0A%7C%7C%E8%BF%9E%E6%8E%A5%E7%A4%BA%E4%BE%8B%EF%BC%9A%7Cjdbc%3Aoracle%3Athin%3A%40host%3A1521%2Fsid%0A6%7Cgbase8%7Cgbase-connector-java-8.8.jar%7Ccom.gbase.jdbc.Driver%0A%7C%7C%E8%BF%9E%E6%8E%A5%E7%A4%BA%E4%BE%8B%EF%BC%9A%7Cjdbc%3Agbase%3A%2F%2Fhost%3A5258%2Fdatabase_name%0A7%7Cpostgresql%7Cpostgresql.jar%7Corg.postgresql.Driver%0A%7C%7C%E8%BF%9E%E6%8E%A5%E7%A4%BA%E4%BE%8B%EF%BC%9A%7Cjdbc%3Apostgresql%3A%2F%2Fhost%3A5432%2Fdatabase_name%0A%0A%0A%0A%E5%85%B7%E4%BD%93%E4%BB%8E%E4%BB%A5%E4%B8%8B%E5%87%A0%E7%B1%BB%E7%BB%84%E4%BB%B6%E8%AF%B4%E6%98%8E%E5%A6%82%E4%BD%95%E6%96%B0%E5%A2%9EJDBC%E9%A9%B1%E5%8A%A8%E5%8C%85%EF%BC%8C%E5%BD%93%E4%BA%A7%E5%93%81%E4%BD%BF%E7%94%A8%E5%88%B0%E7%9B%B8%E5%85%B3%E7%BB%84%E4%BB%B6%E6%97%B6%EF%BC%8C%E6%8C%89%E6%AD%A4%E6%93%8D%E4%BD%9C%E9%85%8D%E7%BD%AE%E5%8D%B3%E5%8F%AF%E3%80%82%0A%23%23%202.%E5%8D%8E%E4%B8%BA%E5%A4%A7%E6%95%B0%E6%8D%AE%E5%B9%B3%E5%8F%B0-Loader%0A%23%23%23%202.1%20%E8%8E%B7%E5%8F%96%E9%A9%B1%E5%8A%A8%E5%AD%98%E6%94%BE%E8%B7%AF%E5%BE%84%0A%E8%8E%B7%E5%8F%96%E5%85%B3%E7%B3%BB%E5%9E%8B%E6%95%B0%E6%8D%AE%E5%BA%93%E5%AF%B9%E5%BA%94%E7%9A%84%E9%A9%B1%E5%8A%A8jar%E5%8C%85%E4%BF%9D%E5%AD%98%E5%9C%A8Loader%E6%9C%8D%E5%8A%A1%E4%B8%BB%E5%A4%87%E8%8A%82%E7%82%B9%E7%9A%84lib%E8%B7%AF%E5%BE%84%EF%BC%9A%0A%60%60%60bash%0AHDC60%3A%0A%2Fopt%2Fhuawei%2FBigdata%2FFusionInsight_V100R002C60U20%2FFusionInsight-Sqoop-1.99.3%2FFusionInsight-Sqoop-1.99.3%2Fserver%2Fwebapps%2Floader%2FWEB-INF%2Flib%0A%0AHDC80%3A%0A%2Fopt%2Fhuawei%2FBigdata%2FFusionInsight_Porter_V100R002C80SPC200%2Finstall%2FFusionInsight-Sqoop-1.99.3%2FFusionInsight-Sqoop-1.99.3%2Fserver%2Fwebapps%2Floader%2FWEB-INF%2Flib%0A%0AHD6.5%EF%BC%9A%0A%2Fopt%2Fhuawei%2FBigdata%2FFusionInsight_Porter_6.5.1%2Finstall%2FFusionInsight-Sqoop-1.99.3%2FFusionInsight-Sqoop-1.99.3%2Fserver%2Fwebapps%2Floader%2FWEB-INF%2Flib%0A%60%60%60%0A%0A%23%23%23%202.2%20%E4%BF%AE%E6%94%B9%E9%A9%B1%E5%8A%A8%E6%9D%83%E9%99%90%0A%E4%BD%BF%E7%94%A8root%E7%94%A8%E6%88%B7%E5%9C%A8%E4%B8%BB%E5%A4%87%E8%8A%82%E7%82%B9%E5%88%86%E5%88%AB%E6%89%A7%E8%A1%8C%E4%BB%A5%E4%B8%8B%E5%91%BD%E4%BB%A4%E4%BF%AE%E6%94%B9%E6%9D%83%E9%99%90%EF%BC%9A%0A%60%60%60bash%0Achown%20omm%3Awheel%20jar%E5%8C%85%E6%96%87%E4%BB%B6%E5%90%8D%0Achmod%20600%20jar%E5%8C%85%E6%96%87%E4%BB%B6%E5%90%8D%0A%60%60%60%0A%0A%23%23%23%202.3%20%E9%87%8D%E5%90%AF%E6%9C%8D%E5%8A%A1%0A%E7%99%BB%E5%BD%95FusionInsight%20Manager%E7%B3%BB%E7%BB%9F%EF%BC%8C%E9%80%89%E6%8B%A9%E2%80%9C%E6%9C%8D%E5%8A%A1%E7%AE%A1%E7%90%86%20%3E%20Loader%20%3E%20%E6%9B%B4%E5%A4%9A%E6%93%8D%E4%BD%9C%20%3E%20%E9%87%8D%E5%90%AF%E6%9C%8D%E5%8A%A1%E2%80%9D%E8%BE%93%E5%85%A5%E7%AE%A1%E7%90%86%E5%91%98%E5%AF%86%E7%A0%81%E9%87%8D%E5%90%AFLoader%E6%9C%8D%E5%8A%A1%E3%80%82%0A%0A%23%23%203.%E5%85%B6%E4%BB%96%E5%A4%A7%E6%95%B0%E6%8D%AE%E5%B9%B3%E5%8F%B0-Sqoop2%0A%23%23%23%203.1%20%E8%8E%B7%E5%8F%96%E9%A9%B1%E5%8A%A8%E5%AD%98%E6%94%BE%E8%B7%AF%E5%BE%84%20%0Asqoop2%E5%AE%89%E8%A3%85%E5%90%8E%EF%BC%8C%E4%B8%93%E9%97%A8%E6%8C%87%E5%AE%9A%E4%BA%86%E7%9B%AE%E5%BD%95%E5%AD%98%E6%94%BE%E7%AC%AC%E4%B8%89%E6%96%B9JDBC%E9%A9%B1%E5%8A%A8%E5%8C%85%EF%BC%9A%0A%60%60%60%0A%2Fvar%2Flib%2Fsqoop2%0A%60%60%60%0A%23%23%23%203.2%20%E4%BF%AE%E6%94%B9%E9%A9%B1%E5%8A%A8%E6%9D%83%E9%99%90%0A%E4%BD%BF%E7%94%A8root%E7%94%A8%E6%88%B7%E5%88%86%E5%88%AB%E6%89%A7%E8%A1%8C%E4%BB%A5%E4%B8%8B%E5%91%BD%E4%BB%A4%E4%BF%AE%E6%94%B9%E6%9D%83%E9%99%90%EF%BC%9A%0A%60%60%60bash%0Achmod%20600%20jar%E5%8C%85%E6%96%87%E4%BB%B6%E5%90%8D%0A%60%60%60%0A%0A%23%23%23%203.3%20%E9%87%8D%E5%90%AF%E6%9C%8D%E5%8A%A1%0A%E5%9C%A8sqoop2%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%EF%BC%8C%E6%89%A7%E8%A1%8C%E5%91%BD%E4%BB%A4%EF%BC%9A%0A%60%60%60bash%0Acd%20%24%7BSQOOP2_HOME%7D%0A.%2Fsqoop2-server%20stop%0A.%2Fsqoop2-server%20start%0A%60%60%60%0A%0A%23%23%204.ETL%E5%B7%A5%E5%85%B7-kettle%0A%0A%23%23%23%204.1%20%E8%8E%B7%E5%8F%96%E9%A9%B1%E5%8A%A8%E5%AD%98%E6%94%BE%E8%B7%AF%E5%BE%84%20%0A%E5%9C%A8ETL%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E7%9A%84%E8%B7%AF%E5%BE%84%EF%BC%9A%0A%60%60%60bash%0A%24%7BKETTLE_HOME%7D%2Flib%2F%0A%60%60%60%0A%23%23%23%204.2%20%E4%BF%AE%E6%94%B9%E9%A9%B1%E5%8A%A8%E6%9D%83%E9%99%90%0A%E4%BD%BF%E7%94%A8root%E7%94%A8%E6%88%B7%E6%89%A7%E8%A1%8C%E4%BB%A5%E4%B8%8B%E5%91%BD%E4%BB%A4%E4%BF%AE%E6%94%B9%E6%9D%83%E9%99%90%EF%BC%9A%0A%60%60%60bash%0Achmod%20600%20jar%E5%8C%85%E6%96%87%E4%BB%B6%E5%90%8D%0A%60%60%60%0A%0A%23%23%23%204.3%20%E9%87%8D%E5%90%AF%E6%9C%8D%E5%8A%A1%0A%60%60%60bash%0Ash%20%24%7BKETTLE_BASE%7D%2Fstop-carte.sh%0Ash%20%24%7BKETTLE_BASE%7D%2Fstart-carte.sh%0A%60%60%60%0A%0A%0A%23%23%205.ETL%E5%B7%A5%E5%85%B7-datax%0A%23%23%23%205.1%20%E8%8E%B7%E5%8F%96%E9%A9%B1%E5%8A%A8%E5%AD%98%E6%94%BE%E8%B7%AF%E5%BE%84%20%0A%E5%9C%A8ETL%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E7%9A%84%E8%B7%AF%E5%BE%84%EF%BC%9A%0A%60%60%60bash%0A%2Fdatax%E8%A7%A3%E5%8E%8B%E7%9B%AE%E5%BD%95%2Flib%0A%60%60%60%0A%23%23%23%205.2%20%E4%BF%AE%E6%94%B9%E9%A9%B1%E5%8A%A8%E6%9D%83%E9%99%90%0A%E4%BD%BF%E7%94%A8root%E7%94%A8%E6%88%B7%E6%89%A7%E8%A1%8C%E4%BB%A5%E4%B8%8B%E5%91%BD%E4%BB%A4%E4%BF%AE%E6%94%B9%E6%9D%83%E9%99%90%EF%BC%9A%0A%60%60%60sh%0Achmod%20600%20jar%E5%8C%85%E6%96%87%E4%BB%B6%E5%90%8D%0A%60%60%60%0A%0A%23%23%23%205.3%20%E9%87%8D%E5%90%AF%E6%9C%8D%E5%8A%A1%0A%E6%97%A0%E9%9C%80%E9%87%8D%E5%90%AF
            </center>
        </span>
    </div>
</template>
<style lang="scss" scoped>
    h1{font-size: 28px !important;}
    h2{font-size: 24px !important;}
    h3{font-size: 22px !important;}
</style>
<script>
    export default {
        data() {
            return {}
        },

        created() {},

        methods: {
            anchor(id) {
                const returnEle = document.querySelector("#" + id);
                if (!!returnEle) {
                    returnEle.scrollIntoView(true); // true 是默认的
                }
            }
        }
    }
</script>
