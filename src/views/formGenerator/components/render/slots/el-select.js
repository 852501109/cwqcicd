export default {
    options(h, conf, key) {
        const list = [];
        /*静态数据 key  value统一用label 和 value*/
        if (conf.__config__.dataType === 'static') {
            conf.options.forEach((item) => {
                list.push(
                    <el-option
                        label={item.label}
                        value={item.value}
                        disabled={item.disabled}
                    ></el-option>
                );
            });
        } else {
            conf.options.forEach((item) => {
                list.push(
                    <el-option
                        label={item[conf.props.props.label]}
                        value={item[conf.props.props.value]}
                        disabled={item.disabled}
                    ></el-option>
                );
            });
        }
        return list;
    },
};
