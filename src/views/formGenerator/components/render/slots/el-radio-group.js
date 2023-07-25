export default {
    options(h, conf, key) {
        const list = [];
        /*静态数据 key  value统一用label 和 value*/
        if (conf.__config__.dataType === 'static') {
            conf.options.forEach((item) => {
                if (conf.__config__.optionType === 'button') {
                    list.push(<el-radio-button label={item.value}>{item.label}</el-radio-button>);
                } else {
                    list.push(
                        <el-radio label={item.value} border={conf.border}>
                            {item.label}
                        </el-radio>
                    );
                }
            });
        } else {
            conf.options.forEach((item) => {
                if (conf.__config__.optionType === 'button') {
                    list.push(
                        <el-radio-button label={item[conf.props.props.value]}>
                            {item[conf.props.props.label]}
                        </el-radio-button>
                    );
                } else {
                    list.push(
                        <el-radio label={item[conf.props.props.value]} border={conf.border}>
                            {item[conf.props.props.label]}
                        </el-radio>
                    );
                }
            });
        }

        return list;
    },
};
