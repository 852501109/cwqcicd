export default {
    options(h, conf, key) {
        const list = [];
        /*静态数据 key  value统一用label 和 value*/
        if (conf.__config__.dataType === 'static') {
            conf.options.forEach((item) => {
                if (conf.optionType === 'button') {
                    list.push(<el-checkbox-button label={item.value}>{item.label}</el-checkbox-button>);
                } else {
                    list.push(
                        <el-checkbox label={item.value} border={conf.border}>
                            {item.label}
                        </el-checkbox>
                    );
                }
            });
        } else {
            conf.options.forEach((item) => {
                if (conf.optionType === 'button') {
                    list.push(
                        <el-checkbox-button label={item[conf.props.props.value]}>
                            {item[conf.props.props.label]}
                        </el-checkbox-button>
                    );
                } else {
                    list.push(
                        <el-checkbox label={item[conf.props.props.value]} border={conf.border}>
                            {item[conf.props.props.label]}
                        </el-checkbox>
                    );
                }
            });
        }
        return list;
    },
};
