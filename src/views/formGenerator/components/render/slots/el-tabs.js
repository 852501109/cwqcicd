import draggable from 'vuedraggable';
export default {
    components: {
        draggable,
    },
    options(h, conf, key) {
        const list = [];
        conf.__slot__.options.forEach((item) => {
            list.push(
                <el-tab-pane label={item.label} name={item.name}>
                    <el-form>
                        <draggable
                            class="drawing-board"
                            style="height:100px"
                            list={conf.children || []}
                            animation={340}
                            group="componentsGroup"
                            className="drag-wrapper"
                        ></draggable>
                    </el-form>
                </el-tab-pane>
            );
        });
        return list;
    },
    render(h) {
        return '';
    },
};
