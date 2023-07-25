<template>
    <div class="right-board">
        <el-tabs v-model="currentTab" class="center-tabs">
            <el-tab-pane label="组件属性" name="field" />
            <el-tab-pane label="表单属性" name="form" />
        </el-tabs>
        <div class="field-box" v-if="activeData.__config__">
            <!--<a class="document-link" target="_blank" :href="documentLink" title="查看组件文档">-->
            <!--<i class="el-icon-link" />-->
            <!--</a>-->
            <!--<el-scrollbar class="right-scrollbar">-->
            <!-- 组件属性 -->
            <el-form
                v-show="currentTab === 'field' && showField"
                size="small"
                label-width="80px"
                :label-position="'left'"
            >
                <!--                <el-form-item v-if="activeData.__config__.changeTag" label="组件类型">-->
                <!--                    <el-select-->
                <!--                        v-model="activeData.__config__.tagIcon"-->
                <!--                        placeholder="请选择组件类型"-->
                <!--                        :style="{ width: '100%' }"-->
                <!--                        @change="tagChange"-->
                <!--                    >-->
                <!--                        <el-option-group v-for="group in tagList" :key="group.label" :label="group.label">-->
                <!--                            <el-option-->
                <!--                                v-for="item in group.options"-->
                <!--                                :key="item.__config__.label"-->
                <!--                                :label="item.__config__.label"-->
                <!--                                :value="item.__config__.tagIcon"-->
                <!--                            >-->
                <!--                                &lt;!&ndash;<svg-icon class="node-icon" :icon-class="item.__config__.tagIcon" />&ndash;&gt;-->
                <!--                                <span> {{ item.__config__.label }}</span>-->
                <!--                            </el-option>-->
                <!--                        </el-option-group>-->
                <!--                    </el-select>-->
                <!--                </el-form-item>-->
                <!--时间范围组件-->
                <template v-if="activeData.__config__.isRange">
                    <el-form-item
                        :label="activeData.__config__.tag === 'el-time-picker' ? '开始时间字段名' : '开始日期字段名'"
                    >
                        <div v-if="fieldList && fieldList.length > 0">
                            <el-select
                                v-model="activeData.__vModel__"
                                placeholder="请选择字段名"
                                :style="{ width: '100%' }"
                                clearable
                                filterable
                            >
                                <el-option
                                    v-for="(item, index) in fieldList"
                                    :key="index"
                                    :label="item.columnName"
                                    :value="item.columnName"
                                    :disabled="item.disabled"
                                >
                                    <div style="width: 100%">
                                        <span style="float: left">{{ item.columnName }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 13px">{{
                                            item.columnComment
                                        }}</span>
                                    </div>
                                </el-option>
                            </el-select>
                        </div>
                        <div v-else>
                            <el-input
                                v-model.trim="activeData.__vModel__"
                                placeholder="请输入字段名（v-model.trim）"
                                clearable
                            />
                        </div>
                    </el-form-item>
                    <el-form-item
                        v-if="activeData.__config__.isRange"
                        :label="activeData.__config__.tag === 'el-time-picker' ? '结束时间字段名' : '结束日期字段名'"
                    >
                        <div v-if="fieldList && fieldList.length > 0">
                            <el-select
                                v-model="activeData.__vModel_1__"
                                placeholder="请选择字段名"
                                :style="{ width: '100%' }"
                                clearable
                                filterable
                            >
                                <el-option
                                    v-for="(item, index) in fieldList"
                                    :key="index"
                                    :label="item.columnName"
                                    :value="item.columnName"
                                    :disabled="item.disabled"
                                >
                                    <div style="width: 100%">
                                        <span style="float: left">{{ item.columnName }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 13px">{{
                                            item.columnComment
                                        }}</span>
                                    </div>
                                </el-option>
                            </el-select>
                        </div>
                        <div v-else>
                            <el-input
                                v-model.trim="activeData.__vModel_1__"
                                placeholder="请输入字段名（v-model.trim）"
                                clearable
                            />
                        </div>
                    </el-form-item>
                </template>
                <!--非时间范围组件-->
                <template v-else>
                    <el-form-item label="字段名">
                        <div v-if="fieldList && fieldList.length > 0">
                            <el-select
                                v-model="activeData.__vModel__"
                                placeholder="请选择字段名"
                                :style="{ width: '100%' }"
                                clearable
                                filterable
                            >
                                <el-option
                                    v-for="(item, index) in fieldList"
                                    :key="index"
                                    :label="item.columnName"
                                    :value="item.columnName"
                                    :disabled="item.disabled"
                                >
                                    <div style="width: 100%">
                                        <span style="float: left">{{ item.columnName }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 13px">{{
                                            item.columnComment
                                        }}</span>
                                    </div>
                                </el-option>
                            </el-select>
                        </div>
                        <div v-else>
                            <el-input
                                v-model.trim="activeData.__vModel__"
                                placeholder="请输入字段名（v-model.trim）"
                                clearable
                            />
                        </div>
                    </el-form-item>
                </template>
                <el-form-item v-if="activeData.__config__.componentName !== undefined" label="组件名">
                    {{ activeData.__config__.componentName }}
                </el-form-item>
                <el-form-item v-if="activeData.__config__.label !== undefined" label="标题">
                    <el-input
                        v-model.trim="activeData.__config__.label"
                        placeholder="请输入标题"
                        ref="title"
                        @input="changeRenderKey, $refs.title.focus()"
                        clearable
                    />
                </el-form-item>
                <el-form-item v-if="activeData.placeholder !== undefined" label="占位提示">
                    <el-input
                        v-model.trim="activeData.placeholder"
                        placeholder="请输入占位提示"
                        ref="placeholder"
                        @input="changeRenderKey, $refs.placeholder.focus()"
                        clearable
                    />
                </el-form-item>
                <el-form-item v-if="activeData['start-placeholder'] !== undefined" label="开始占位">
                    <el-input v-model.trim="activeData['start-placeholder']" placeholder="请输入占位提示" />
                </el-form-item>
                <el-form-item v-if="activeData['end-placeholder'] !== undefined" label="结束占位">
                    <el-input v-model.trim="activeData['end-placeholder']" placeholder="请输入占位提示" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.span !== undefined" label="表单栅格">
                    <el-slider
                        v-model="activeData.__config__.span"
                        :max="24"
                        :min="1"
                        :marks="{ 12: '' }"
                        @change="spanChange"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeData.__config__.layout === 'rowFormItem' && activeData.gutter !== undefined"
                    label="栅格间隔"
                >
                    <el-input-number v-model.trim="activeData.gutter" :min="0" placeholder="栅格间隔" />
                </el-form-item>
                <el-form-item
                    v-if="activeData.__config__.layout === 'rowFormItem' && activeData.type !== undefined"
                    label="布局模式"
                >
                    <el-radio-group v-model="activeData.type">
                        <el-radio-button label="default" />
                        <el-radio-button label="flex" />
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="activeData.justify !== undefined && activeData.type === 'flex'" label="水平排列">
                    <el-select v-model="activeData.justify" placeholder="请选择水平排列" :style="{ width: '100%' }">
                        <el-option
                            v-for="(item, index) in justifyOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="activeData.align !== undefined && activeData.type === 'flex'" label="垂直排列">
                    <el-radio-group v-model="activeData.align">
                        <el-radio-button label="top" />
                        <el-radio-button label="middle" />
                        <el-radio-button label="bottom" />
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="activeData.__config__.labelWidth !== undefined" label="标签宽度">
                    <el-input
                        v-model.trim.number="activeData.__config__.labelWidth"
                        type="number"
                        placeholder="请输入标签宽度"
                    />
                </el-form-item>
                <el-form-item v-if="activeData.style && activeData.style.width !== undefined" label="组件宽度">
                    <el-input v-model.trim="activeData.style.width" placeholder="请输入组件宽度" clearable />
                </el-form-item>
                <el-form-item v-if="activeData.__vModel__ !== undefined" label="默认值">
                    <el-input
                        :value="setDefaultValue(activeData.__config__.defaultValue)"
                        placeholder="请输入默认值"
                        @input="onDefaultValueInput"
                    />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag === 'el-checkbox-group'" label="至少应选">
                    <el-input-number
                        :value="activeData.min"
                        :min="0"
                        placeholder="至少应选"
                        @input="$set(activeData, 'min', $event ? $event : undefined)"
                    />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag === 'el-checkbox-group'" label="最多可选">
                    <el-input-number
                        :value="activeData.max"
                        :min="0"
                        placeholder="最多可选"
                        @input="$set(activeData, 'max', $event ? $event : undefined)"
                    />
                </el-form-item>
                <el-form-item v-if="activeData.__slot__ && activeData.__slot__.prepend !== undefined" label="前缀">
                    <el-input v-model.trim="activeData.__slot__.prepend" placeholder="请输入前缀" />
                </el-form-item>
                <el-form-item v-if="activeData.__slot__ && activeData.__slot__.append !== undefined" label="后缀">
                    <el-input v-model.trim="activeData.__slot__.append" placeholder="请输入后缀" />
                </el-form-item>
                <el-form-item v-if="activeData['prefix-icon'] !== undefined" label="前图标">
                    <el-input v-model.trim="activeData['prefix-icon']" placeholder="请输入前图标名称">
                        <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('prefix-icon')">
                            选择
                        </el-button>
                    </el-input>
                </el-form-item>
                <el-form-item v-if="activeData['suffix-icon'] !== undefined" label="后图标">
                    <el-input v-model.trim="activeData['suffix-icon']" placeholder="请输入后图标名称">
                        <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('suffix-icon')">
                            选择
                        </el-button>
                    </el-input>
                </el-form-item>
                <el-form-item
                    v-if="activeData['icon'] !== undefined && activeData.__config__.tag === 'el-button'"
                    label="按钮图标"
                >
                    <el-input v-model.trim="activeData['icon']" placeholder="请输入按钮图标名称">
                        <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('icon')">
                            选择
                        </el-button>
                    </el-input>
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="选项分隔符">
                    <el-input v-model.trim="activeData.separator" placeholder="请输入选项分隔符" />
                </el-form-item>
                <el-form-item v-if="activeData.autosize !== undefined" label="最小行数">
                    <el-input-number v-model.trim="activeData.autosize.minRows" :min="1" placeholder="最小行数" />
                </el-form-item>
                <el-form-item v-if="activeData.autosize !== undefined" label="最大行数">
                    <el-input-number v-model.trim="activeData.autosize.maxRows" :min="1" placeholder="最大行数" />
                </el-form-item>
                <el-form-item v-if="isShowMin" label="最小值">
                    <el-input-number v-model.trim="activeData.min" placeholder="最小值" />
                </el-form-item>
                <el-form-item v-if="isShowMax" label="最大值">
                    <el-input-number v-model.trim="activeData.max" placeholder="最大值" />
                </el-form-item>
                <el-form-item v-if="activeData.height !== undefined" label="组件高度">
                    <el-input-number v-model.trim="activeData.height" placeholder="高度" @input="changeRenderKey" />
                </el-form-item>
                <el-form-item v-if="isShowStep" label="步长">
                    <el-input-number v-model.trim="activeData.step" placeholder="步数" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" label="精度">
                    <el-input-number v-model.trim="activeData.precision" :min="0" placeholder="精度" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" label="按钮位置">
                    <el-radio-group v-model="activeData['controls-position']">
                        <el-radio-button label=""> 默认</el-radio-button>
                        <el-radio-button label="right"> 右侧</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="activeData.maxlength !== undefined" label="最多输入">
                    <el-input v-model.trim="activeData.maxlength" placeholder="请输入字符长度">
                        <template slot="append"> 个字符</template>
                    </el-input>
                </el-form-item>
                <el-form-item v-if="activeData['active-text'] !== undefined" label="开启提示">
                    <el-input v-model.trim="activeData['active-text']" placeholder="请输入开启提示" />
                </el-form-item>
                <el-form-item v-if="activeData['inactive-text'] !== undefined" label="关闭提示">
                    <el-input v-model.trim="activeData['inactive-text']" placeholder="请输入关闭提示" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.activeName != undefined" label="开启名">
                    <el-input v-model.trim="activeData.__config__.activeName" placeholder="请输入需要展示的名称" />
                </el-form-item>
                <el-form-item v-if="activeData['active-value'] !== undefined" label="开启值">
                    <el-input
                        :value="setDefaultValue(activeData['active-value'])"
                        placeholder="请输入开启值"
                        @input="onSwitchValueInput($event, 'active-value')"
                    />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.inactiveName != undefined" label="关闭名">
                    <el-input v-model.trim="activeData.__config__.inactiveName" placeholder="请输入需要展示的名称" />
                </el-form-item>
                <el-form-item v-if="activeData['inactive-value'] !== undefined" label="关闭值">
                    <el-input
                        :value="setDefaultValue(activeData['inactive-value'])"
                        placeholder="请输入关闭值"
                        @input="onSwitchValueInput($event, 'inactive-value')"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeData.type !== undefined && 'el-date-picker' === activeData.__config__.tag"
                    label="时间类型"
                >
                    <el-select
                        v-model="activeData.type"
                        placeholder="请选择时间类型"
                        :style="{ width: '100%' }"
                        @change="dateTypeChange"
                    >
                        <el-option
                            v-for="(item, index) in dateOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="activeData.name !== undefined" label="文件字段名">
                    <el-input v-model.trim="activeData.name" disabled placeholder="请输入上传文件字段名" />
                </el-form-item>
                <el-form-item v-if="activeData.accept !== undefined" label="文件类型">
                    <el-select
                        v-model="activeData.accept"
                        placeholder="请选择文件类型"
                        :style="{ width: '100%' }"
                        clearable
                    >
                        <el-option label="图片" value="image/*" />
                        <el-option label="视频" value="video/*" />
                        <el-option label="音频" value="audio/*" />
                        <el-option label="excel" value=".xls,.xlsx" />
                        <el-option label="word" value=".doc,.docx" />
                        <el-option label="pdf" value=".pdf" />
                        <el-option label="txt" value=".txt" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="activeData.__config__.fileSize !== undefined" label="文件大小">
                    <el-input v-model.trim.number="activeData.__config__.fileSize" placeholder="请输入文件大小">
                        <el-select slot="append" v-model="activeData.__config__.sizeUnit" :style="{ width: '66px' }">
                            <el-option label="KB" value="KB" />
                            <el-option label="MB" value="MB" />
                            <el-option label="GB" value="GB" />
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item v-if="activeData.action !== undefined" label="上传地址">
                    <el-input v-model.trim="activeData.action" placeholder="请输入上传地址" clearable />
                </el-form-item>
                <el-form-item v-if="activeData['list-type'] !== undefined" label="列表类型">
                    <el-radio-group v-model="activeData['list-type']" size="small">
                        <el-radio-button label="text"> text</el-radio-button>
                        <el-radio-button label="picture"> picture</el-radio-button>
                        <el-radio-button label="picture-card"> picture-card</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    v-if="activeData.type !== undefined && activeData.__config__.tag === 'el-button'"
                    label="按钮类型"
                >
                    <el-select v-model="activeData.type" :style="{ width: '100%' }">
                        <el-option label="primary" value="primary" />
                        <el-option label="success" value="success" />
                        <el-option label="warning" value="warning" />
                        <el-option label="danger" value="danger" />
                        <el-option label="info" value="info" />
                        <el-option label="text" value="text" />
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="activeData.__config__.buttonText !== undefined"
                    v-show="'picture-card' !== activeData['list-type']"
                    label="按钮文字"
                >
                    <el-input v-model.trim="activeData.__config__.buttonText" placeholder="请输入按钮文字" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag === 'el-button'" label="按钮文字">
                    <el-input v-model.trim="activeData.__slot__.default" placeholder="请输入按钮文字" />
                </el-form-item>
                <el-form-item v-if="activeData['range-separator'] !== undefined" label="分隔符">
                    <el-input v-model.trim="activeData['range-separator']" placeholder="请输入分隔符" />
                </el-form-item>
                <el-form-item v-if="activeData['picker-options'] !== undefined" label="时间段">
                    <el-input v-model.trim="activeData['picker-options'].selectableRange" placeholder="请输入时间段" />
                </el-form-item>
                <el-form-item v-if="activeData.format !== undefined" label="时间格式">
                    <el-input :value="activeData.format" placeholder="请输入时间格式" @input="setTimeValue($event)" />
                </el-form-item>

                <template
                    v-if="['el-select', 'el-checkbox-group', 'el-radio-group'].indexOf(activeData.__config__.tag) > -1"
                >
                    <el-divider>选项</el-divider>
                    <el-radio-group
                        v-model="activeData.__config__.dataType"
                        class="select-data-sources"
                        @change="changeSelectItem"
                    >
                        <el-radio-button label="static">静态数据</el-radio-button>
                        <el-radio-button label="dynamic">远端数据</el-radio-button>
                    </el-radio-group>
                    <template v-if="activeData.__config__.dataType === 'static'">
                        <draggable :list="activeData.options" :animation="340" group="selectItem" handle=".option-drag">
                            <div v-for="(item, index) in activeData.options" :key="index" class="select-item">
                                <div class="select-line-icon option-drag">
                                    <i class="el-icon-s-operation" />
                                </div>
                                <el-input
                                    v-model.trim="item.label"
                                    placeholder="选项名"
                                    size="small"
                                    maxlength="20"
                                    show-word-limit
                                />
                                <el-input
                                    placeholder="选项值"
                                    size="small"
                                    :value="item.value"
                                    maxlength="20"
                                    show-word-limit
                                    @input="setOptionValue(item, $event)"
                                />
                                <div class="close-btn select-line-icon" @click="delSelectItem(index)">
                                    <i class="el-icon-remove-outline" />
                                </div>
                            </div>
                        </draggable>
                        <div>
                            <el-button
                                style="padding-bottom: 0"
                                icon="el-icon-circle-plus-outline"
                                type="text"
                                @click="addSelectItem"
                            >
                                添加选项
                            </el-button>
                        </div>
                    </template>
                    <template v-else>
                        <div class="">
                            <el-form-item label="接口地址">
                                <el-input
                                    v-model.trim="activeData.__config__.url"
                                    :title="activeData.__config__.url"
                                    placeholder="请输入接口地址"
                                    clearable
                                >
                                    <el-select
                                        slot="prepend"
                                        v-model="activeData.__config__.method"
                                        :style="{ width: '85px' }"
                                    >
                                        <el-option label="get" value="get" />
                                        <!--<el-option label="post" value="post" />-->
                                        <!--<el-option label="put" value="put" />-->
                                        <!--<el-option label="delete" value="delete" />-->
                                    </el-select>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="数据位置">
                                <el-input
                                    v-model.trim="activeData.__config__.dataPath"
                                    placeholder="请输入数据位置"
                                    clearable
                                />
                            </el-form-item>
                            <el-form-item label="值">
                                <el-input
                                    placeholder=""
                                    v-model.trim="activeData.props.props.value"
                                    clearable
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="标签">
                                <el-input
                                    placeholder=""
                                    v-model.trim="activeData.props.props.label"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </div>
                    </template>
                    <el-divider />
                </template>

                <template v-if="['el-cascader', 'el-table', 'table-component'].includes(activeData.__config__.tag)">
                    <el-divider>选项</el-divider>
                    <template v-if="['el-cascader'].includes(activeData.__config__.tag)">
                        <el-form-item v-if="activeData.__config__.dataType" label="数据类型">
                            <el-radio-group
                                v-model="activeData.__config__.dataType"
                                size="small"
                                @change="cascaderChange"
                            >
                                <el-radio-button label="static"> 静态数据</el-radio-button>
                                <el-radio-button label="dynamic"> 动态数据</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </template>
                    <template v-if="['el-table', 'table-component'].includes(activeData.__config__.tag)">
                        <el-form-item label="设计表头">
                            <el-button size="mini" type="primary" @click="isShowTableHeaderDialog = true"
                                >设计表头</el-button
                            >
                        </el-form-item>
                        <el-form-item v-if="activeData.__config__.dataType" label="数据类型">
                            <el-radio-group
                                v-model="activeData.__config__.dataType"
                                size="small"
                                @change="cascaderChange"
                            >
                                <el-radio-button label="static"> 静态数据</el-radio-button>
                                <el-radio-button label="dynamic"> 接口数据</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </template>
                    <template v-if="activeData.__config__.dataType === 'dynamic'">
                        <el-form-item label="请求方式">
                            <el-select v-model="activeData.__config__.method" @change="$emit('fetch-data', activeData)">
                                <el-option label="get" value="get" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="接口地址">
                            <el-input
                                v-model.trim="activeData.__config__.url"
                                :title="activeData.__config__.url"
                                placeholder="请输入接口地址"
                                type="textarea"
                                autosize
                                clearable
                            >
                            </el-input>
                        </el-form-item>
                        <!--                        <el-form-item label="数据位置">-->
                        <!--                            <el-input v-model.trim="activeData.__config__.dataPath" placeholder="请输入数据位置" clearable />-->
                        <!--                        </el-form-item>-->
                        <!--表格的请求参数-->
                        <template v-if="activeData.__config__.tag === 'table-component'">
                            <el-divider>请求参数</el-divider>
                            <div
                                v-for="(item, index) in activeData.__config__.parameter"
                                :key="index"
                                class="select-item"
                            >
                                <div class="select-line-icon option-drag">
                                    <i class="el-icon-s-operation" />
                                </div>
                                <el-input v-model.trim="item.label" placeholder="字段名" size="small" />
                                <template v-if="index === 1">
                                    <el-select v-model="item.value" class="rowsSelect">
                                        <el-option label="10" :value="10" />
                                        <el-option label="20" :value="20" />
                                        <el-option label="30" :value="30" />
                                        <el-option label="40" :value="40" />
                                        <el-option label="50" :value="50" />
                                        <el-option label="100" :value="100" />
                                    </el-select>
                                </template>
                                <template v-else>
                                    <el-input
                                        placeholder="字段值"
                                        size="small"
                                        :value="item.value"
                                        @input="setTableRequestValue(item, $event)"
                                    />
                                </template>
                                <div
                                    class="close-btn select-line-icon"
                                    v-if="index >= 2"
                                    @click="delTableRequestItem(index)"
                                >
                                    <i class="el-icon-remove-outline" title="删除参数" />
                                </div>
                            </div>
                            <el-button
                                style="padding-bottom: 0"
                                icon="el-icon-circle-plus-outline"
                                type="text"
                                @click="addTableRequestItem"
                            >
                                添加参数
                            </el-button>
                        </template>

                        <template v-if="activeData.props && activeData.props.props">
                            <el-form-item label="标签键名">
                                <el-input
                                    v-model.trim="activeData.props.props.label"
                                    placeholder="请输入标签键名"
                                    clearable
                                />
                            </el-form-item>
                            <el-form-item label="值键名">
                                <el-input
                                    v-model.trim="activeData.props.props.value"
                                    placeholder="请输入值键名"
                                    clearable
                                />
                            </el-form-item>
                            <el-form-item label="子级键名">
                                <el-input
                                    v-model.trim="activeData.props.props.children"
                                    placeholder="请输入子级键名"
                                    clearable
                                />
                            </el-form-item>
                        </template>
                    </template>
                    <!-- 级联选择静态树 select-data-item-->
                    <template
                        v-if="
                            activeData.__config__.dataType === 'static' &&
                            !['el-table', 'table-component'].includes(activeData.__config__.tag)
                        "
                    >
                        <el-tree
                            draggable
                            :data="activeData.options"
                            node-key="value"
                            :expand-on-click-node="false"
                            :render-content="renderContent"
                        />
                        <div style="margin-left: 20px">
                            <el-button
                                style="padding-bottom: 0"
                                icon="el-icon-circle-plus-outline"
                                type="text"
                                @click="addTreeItem('options')"
                            >
                                添加父级
                            </el-button>
                        </div>
                    </template>
                    <el-divider />
                </template>

                <el-form-item v-if="activeData.__config__.optionType !== undefined" label="选项样式">
                    <el-radio-group v-model="activeData.__config__.optionType">
                        <el-radio-button label="default"> 默认</el-radio-button>
                        <el-radio-button label="button"> 按钮</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="activeData['active-color'] !== undefined" label="开启颜色">
                    <el-color-picker v-model="activeData['active-color']" />
                </el-form-item>
                <el-form-item v-if="activeData['inactive-color'] !== undefined" label="关闭颜色">
                    <el-color-picker v-model="activeData['inactive-color']" />
                </el-form-item>
                <!--有些字段不需要新增时生成时后台生成的。但是列表展示是根据表单字段展示的。所以在设计表单时需要此字段。新增、编辑表单时影藏。查看时显示-->
                <!--                <el-form-item label="是否需要展示">-->
                <!--                    <el-switch v-model="activeData.__config__.showItem" />-->
                <!--                </el-form-item>-->
                <el-form-item
                    v-if="
                        activeData.__config__.showLabel !== undefined && activeData.__config__.labelWidth !== undefined
                    "
                    label="显示标签"
                >
                    <el-switch v-model="activeData.__config__.showLabel" />
                </el-form-item>
                <el-form-item v-if="activeData.branding !== undefined" label="品牌烙印">
                    <el-switch v-model="activeData.branding" @input="changeRenderKey" />
                </el-form-item>
                <el-form-item v-if="activeData['allow-half'] !== undefined" label="允许半选">
                    <el-switch v-model="activeData['allow-half']" />
                </el-form-item>
                <el-form-item v-if="activeData['show-text'] !== undefined" label="辅助文字">
                    <el-switch v-model="activeData['show-text']" @change="rateTextChange" />
                </el-form-item>
                <el-form-item v-if="activeData['show-score'] !== undefined" label="显示分数">
                    <el-switch v-model="activeData['show-score']" @change="rateScoreChange" />
                </el-form-item>
                <el-form-item v-if="activeData['show-stops'] !== undefined" label="显示间断点">
                    <el-switch v-model="activeData['show-stops']" />
                </el-form-item>
                <el-form-item v-if="activeData.range !== undefined" label="范围选择">
                    <el-switch v-model="activeData.range" @change="rangeChange" />
                </el-form-item>
                <el-form-item
                    v-if="activeData.__config__.border !== undefined && activeData.__config__.optionType === 'default'"
                    label="是否带边框"
                >
                    <el-switch v-model="activeData.__config__.border" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag === 'el-color-picker'" label="颜色格式">
                    <el-select
                        v-model="activeData['color-format']"
                        placeholder="请选择颜色格式"
                        :style="{ width: '100%' }"
                        clearable
                        @change="colorFormatChange"
                    >
                        <el-option
                            v-for="(item, index) in colorFormatOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="
                        activeData.size !== undefined &&
                        (activeData.__config__.optionType === 'button' ||
                            activeData.__config__.border ||
                            activeData.__config__.tag === 'el-color-picker' ||
                            activeData.__config__.tag === 'el-button')
                    "
                    label="组件尺寸"
                >
                    <el-radio-group v-model="activeData.size">
                        <el-radio-button label="medium"> 中等</el-radio-button>
                        <el-radio-button label="small"> 较小</el-radio-button>
                        <el-radio-button label="mini"> 迷你</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="activeData['show-word-limit'] !== undefined" label="输入统计">
                    <el-switch v-model="activeData['show-word-limit']" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" label="严格步数">
                    <el-switch v-model="activeData['step-strictly']" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="任选层级">
                    <el-switch v-model="activeData.props.props.checkStrictly" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="是否多选">
                    <el-switch v-model="activeData.props.props.multiple" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="展示全路径">
                    <el-switch v-model="activeData['show-all-levels']" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="可否筛选">
                    <el-switch v-model="activeData.filterable" />
                </el-form-item>
                <el-form-item v-if="activeData.clearable !== undefined" label="能否清空">
                    <el-switch v-model="activeData.clearable" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.showTip !== undefined" label="显示提示">
                    <el-switch v-model="activeData.__config__.showTip" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag === 'el-upload'" label="多选文件">
                    <el-switch v-model="activeData.multiple" />
                </el-form-item>
                <el-form-item v-if="activeData['auto-upload'] !== undefined" label="自动上传">
                    <el-switch v-model="activeData['auto-upload']" />
                </el-form-item>
                <el-form-item v-if="activeData.readonly !== undefined" label="是否只读">
                    <el-switch v-model="activeData.readonly" />
                </el-form-item>
                <el-form-item v-if="activeData.disabled !== undefined" label="是否禁用">
                    <el-switch v-model="activeData.disabled" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag === 'el-select'" label="能否搜索">
                    <el-switch v-model="activeData.filterable" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag === 'el-select'" label="是否多选">
                    <el-switch v-model="activeData.multiple" @change="multipleChange" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.required !== undefined" label="是否必填">
                    <el-switch v-model="activeData.__config__.required" />
                </el-form-item>

                <!--tabs-->
                <el-form-item v-if="activeData.__config__.tag == 'el-tabs'" label="标签的位置">
                    <el-radio-group v-model="activeData['tab-position']">
                        <el-radio-button label="top">top</el-radio-button>
                        <el-radio-button label="right">right</el-radio-button>
                        <el-radio-button label="bottom">bottom</el-radio-button>
                        <el-radio-button label="left">left</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag == 'el-tabs'" label="选项卡样式">
                    <el-radio-group v-model="activeData.type">
                        <el-radio-button label="">默认</el-radio-button>
                        <el-radio-button label="card">选项卡</el-radio-button>
                        <el-radio-button label="border-card">标签页</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag == 'el-tabs'" label="增加标签页">
                    <draggable
                        :list="activeData.__slot__.options"
                        :animation="340"
                        group="selectItem"
                        handle=".option-drag"
                    >
                        <div v-for="(item, index) in activeData.__slot__.options" :key="index" class="select-item">
                            <div class="select-line-icon option-drag">
                                <i class="el-icon-s-operation" />
                            </div>
                            <el-input v-model.trim="item.label" placeholder="选项名" size="small" />
                            <el-input
                                placeholder="选项值"
                                size="small"
                                :value="item.name"
                                @input="setTabsValue(item, $event)"
                            />
                            <div class="close-btn select-line-icon" @click="delTabsItem(index)">
                                <i class="el-icon-remove-outline" />
                            </div>
                        </div>
                    </draggable>
                    <div style="margin-left: 20px">
                        <el-button
                            style="padding-bottom: 0"
                            icon="el-icon-circle-plus-outline"
                            type="text"
                            @click="addTabsItem"
                        >
                            添加选项
                        </el-button>
                    </div>
                </el-form-item>

                <!--树形组件-->
                <el-form-item v-if="activeData.__config__.tag == 'el-tree'" label="唯一标识">
                    <el-input v-model.trim="activeData['node-key']" placeholder="请输入node-key的值" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag == 'el-tree'" label="树形名">
                    <el-input v-model.trim="activeData.ref" placeholder="请输入ref名" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag == 'el-tree'" label="是否可选择">
                    <el-switch v-model="activeData['show-checkbox']" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag == 'el-tree'" label="是否单选">
                    <el-switch @change="treeIsSingleChoice" v-model="activeData.__config__.isSingleChoice" />
                </el-form-item>
                <!--<el-form-item v-if="activeData.__config__.tag == 'el-tree'" label="是否懒加载">-->
                <!--<el-switch v-model="activeData.lazy" />-->
                <!--</el-form-item>-->
                <el-form-item v-if="activeData.__config__.tag == 'el-tree'" label="是否清空所选">
                    <el-switch
                        v-model="activeData.__config__.isResetChecked"
                        @change="$refs[activeData.ref].setCheckedKeys([])"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeData.__config__.tag == 'el-tree'"
                    label="显示复选框的情况下，父子是否不互相关联的"
                >
                    <el-switch v-model="activeData['check-strictly']" />
                </el-form-item>
                <template v-if="['el-tree'].includes(activeData.__config__.tag)">
                    <el-divider>选项</el-divider>
                    <el-form-item v-if="activeData.__config__.dataType" label="数据类型">
                        <el-radio-group
                            v-model="activeData.__config__.dataType"
                            size="small"
                            @change="activeData.data = []"
                        >
                            <el-radio-button label="static"> 静态数据</el-radio-button>
                            <el-radio-button label="dynamic"> 动态数据</el-radio-button>
                        </el-radio-group>
                    </el-form-item>

                    <template v-if="activeData.__config__.dataType === 'dynamic'">
                        <el-form-item label="接口地址">
                            <el-input
                                v-model.trim="activeData.__config__.url"
                                :title="activeData.__config__.url"
                                placeholder="请输入接口地址"
                                clearable
                            >
                                <el-select
                                    slot="prepend"
                                    v-model="activeData.__config__.method"
                                    :style="{ width: '85px' }"
                                >
                                    <el-option label="get" value="get" />
                                    <el-option label="post" value="post" />
                                </el-select>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="数据位置">
                            <el-input
                                v-model.trim="activeData.__config__.dataPath"
                                placeholder="请输入数据位置"
                                clearable
                            />
                        </el-form-item>
                    </template>
                    <template>
                        <el-form-item label="标签键名">
                            <el-input
                                v-model.trim="activeData.props.props.label"
                                placeholder="请输入标签键名"
                                maxlength="20"
                                show-word-limit
                                clearable
                            />
                        </el-form-item>
                        <el-form-item label="标签键值">
                            <el-input
                                v-model.trim="activeData.props.props.value"
                                placeholder="请输入标签键值"
                                maxlength="20"
                                show-word-limit
                                clearable
                            />
                        </el-form-item>
                        <el-form-item label="子级键名">
                            <el-input
                                v-model.trim="activeData.props.props.children"
                                placeholder="请输入子级键名"
                                maxlength="20"
                                show-word-limit
                                clearable
                            />
                        </el-form-item>
                    </template>
                    <el-tree
                        :data="activeData.data"
                        :props="activeData.props.props"
                        :node-key="activeData['node-key']"
                        :expand-on-click-node="false"
                        :render-content="renderContent"
                        draggable
                    />
                    <div v-if="activeData.__config__.dataType === 'static'" style="margin-left: 20px">
                        <el-button
                            style="padding-bottom: 0"
                            icon="el-icon-circle-plus-outline"
                            type="text"
                            @click="addTreeItem('data')"
                        >
                            添加父级
                        </el-button>
                    </div>
                    <el-divider />
                </template>

                <template v-if="activeData.__config__.layoutTree">
                    <el-divider>布局结构树</el-divider>
                    <el-tree
                        :data="[activeData.__config__]"
                        :props="layoutTreeProps"
                        node-key="renderKey"
                        default-expand-all
                        draggable
                    >
                        <span slot-scope="{ node, data }">
                            <span class="node-label">
                                <!--<svg-icon-->
                                <!--class="node-icon"-->
                                <!--:icon-class="data.__config__ ? data.__config__.tagIcon : data.tagIcon"-->
                                <!--/>-->
                                {{ node.label }}
                            </span>
                        </span>
                    </el-tree>
                </template>

                <template v-if="Array.isArray(activeData.__config__.regList)">
                    <el-divider>正则校验</el-divider>
                    <div v-for="(item, index) in activeData.__config__.regList" :key="index" class="reg-item">
                        <span class="close-btn" @click="activeData.__config__.regList.splice(index, 1)">
                            <i class="el-icon-close" />
                        </span>
                        <el-form-item label="表达式">
                            <el-input v-model.trim="item.pattern" placeholder="请输入正则" clearable />
                        </el-form-item>
                        <el-form-item label="错误提示">
                            <el-input v-model.trim="item.message" placeholder="请输入错误提示" clearable />
                        </el-form-item>
                    </div>
                    <div>
                        <el-button icon="el-icon-circle-plus-outline" type="text" @click="addReg"> 添加规则</el-button>
                    </div>
                </template>
            </el-form>
            <!-- 表单属性 -->
            <el-form v-show="currentTab === 'form'" size="small" label-width="80px" :label-position="'left'">
                <el-form-item label="表单名">
                    <el-input v-model.trim="formConf.formRef" placeholder="请输入表单名（ref）" />
                </el-form-item>
                <el-form-item label="表单模型">
                    <el-input v-model.trim="formConf.formModel" placeholder="请输入数据模型" />
                </el-form-item>
                <el-form-item label="校验模型">
                    <el-input v-model.trim="formConf.formRules" placeholder="请输入校验模型" />
                </el-form-item>
                <el-form-item label="表单尺寸">
                    <el-radio-group v-model="formConf.size">
                        <el-radio-button label="medium"> 中等</el-radio-button>
                        <el-radio-button label="small"> 较小</el-radio-button>
                        <el-radio-button label="mini"> 迷你</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="标签对齐">
                    <el-radio-group v-model="formConf.labelPosition" style="white-space: nowrap">
                        <el-radio-button label="left"> 左对齐</el-radio-button>
                        <el-radio-button label="right"> 右对齐</el-radio-button>
                        <el-radio-button label="top"> 顶部对齐</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="标签宽度">
                    <el-input v-model.trim.number="formConf.labelWidth" type="number" placeholder="请输入标签宽度" />
                </el-form-item>
                <el-form-item label="栅格间隔">
                    <el-input-number v-model.trim="formConf.gutter" :min="0" placeholder="栅格间隔" />
                </el-form-item>
                <el-form-item label="禁用表单">
                    <el-switch v-model="formConf.disabled" />
                </el-form-item>
                <el-form-item label="表单按钮">
                    <el-switch v-model="formConf.formBtns" />
                </el-form-item>
                <el-form-item label="显示未选中组件边框">
                    <el-switch v-model="formConf.unFocusedComponentBorder" />
                </el-form-item>
            </el-form>
            <!--</el-scrollbar>-->
        </div>

        <table-header-dialog
            v-if="isShowTableHeaderDialog"
            :visible.sync="isShowTableHeaderDialog"
            title="设计表头"
            @commit="addTableHeader"
            :activeData="activeData"
        />
        <treeNode-dialog :visible.sync="dialogVisible" title="添加选项" @commit="addNode" :activeData="activeData" />
        <icons-dialog :visible.sync="iconsVisible" :current="activeData[currentIconModel]" @select="setIcon" />
    </div>
</template>

<script>
import { isArray } from 'util';
import TreeNodeDialog from '~/views/index/TreeNodeDialog';
import tableHeaderDialog from '~/views/index/tableHeaderDialog';
import { isNumberStr } from '~/utils/index';
import IconsDialog from './IconsDialog';
import { inputComponents, selectComponents } from '~/components/generator/config';

const dateTimeFormat = {
    date: 'yyyy-MM-dd',
    week: 'yyyy 第 WW 周',
    month: 'yyyy-MM',
    year: 'yyyy',
    datetime: 'yyyy-MM-dd HH:mm:ss',
    daterange: 'yyyy-MM-dd',
    monthrange: 'yyyy-MM',
    datetimerange: 'yyyy-MM-dd HH:mm:ss',
};

// 使changeRenderKey在目标组件改变时可用
const needRerenderList = ['tinymce'];

export default {
    components: {
        TreeNodeDialog,
        IconsDialog,
        tableHeaderDialog,
    },
    props: ['showField', 'activeData', 'formConf', 'fieldList', 'formCode'],
    data() {
        return {
            currentTab: 'field',
            currentNode: null,
            treeValues: [], //新增树形结构的所有value值的集合
            isShowTableHeaderDialog: false,
            dialogVisible: false,
            iconsVisible: false,
            currentIconModel: null,
            dateTypeOptions: [
                {
                    label: '日(date)',
                    value: 'date',
                },
                {
                    label: '周(week)',
                    value: 'week',
                },
                {
                    label: '月(month)',
                    value: 'month',
                },
                {
                    label: '年(year)',
                    value: 'year',
                },
                {
                    label: '日期时间(datetime)',
                    value: 'datetime',
                },
            ],
            dateRangeTypeOptions: [
                {
                    label: '日期范围(daterange)',
                    value: 'daterange',
                },
                {
                    label: '月范围(monthrange)',
                    value: 'monthrange',
                },
                {
                    label: '日期时间范围(datetimerange)',
                    value: 'datetimerange',
                },
            ],
            colorFormatOptions: [
                {
                    label: 'hex',
                    value: 'hex',
                },
                {
                    label: 'rgb',
                    value: 'rgb',
                },
                {
                    label: 'rgba',
                    value: 'rgba',
                },
                {
                    label: 'hsv',
                    value: 'hsv',
                },
                {
                    label: 'hsl',
                    value: 'hsl',
                },
            ],
            justifyOptions: [
                {
                    label: 'start',
                    value: 'start',
                },
                {
                    label: 'end',
                    value: 'end',
                },
                {
                    label: 'center',
                    value: 'center',
                },
                {
                    label: 'space-around',
                    value: 'space-around',
                },
                {
                    label: 'space-between',
                    value: 'space-between',
                },
            ],
            layoutTreeProps: {
                label(data, node) {
                    const config = data.__config__;
                    return data.componentName || `${config.label}: ${data.__vModel__}`;
                },
            },
        };
    },
    computed: {
        documentLink() {
            return this.activeData.__config__.document || 'https://element.eleme.cn/#/zh-CN/component/installation';
        },
        dateOptions() {
            if (this.activeData.type !== undefined && this.activeData.__config__.tag === 'el-date-picker') {
                if (this.activeData['start-placeholder'] === undefined) {
                    return this.dateTypeOptions;
                }
                return this.dateRangeTypeOptions;
            }
            return [];
        },
        tagList() {
            return [
                {
                    label: '输入型组件',
                    options: inputComponents,
                },
                {
                    label: '选择型组件',
                    options: selectComponents,
                },
            ];
        },
        activeTag() {
            return this.activeData.__config__.tag;
        },
        isShowMin() {
            return ['el-input-number', 'el-slider'].indexOf(this.activeTag) > -1;
        },
        isShowMax() {
            return ['el-input-number', 'el-slider', 'el-rate'].indexOf(this.activeTag) > -1;
        },
        isShowStep() {
            return ['el-input-number', 'el-slider'].indexOf(this.activeTag) > -1;
        },
    },
    watch: {
        formConf: {
            handler(val) {},
            deep: true,
        },
        activeData: {
            handler(val) {
                if (val.__config__.tag === 'el-upload') {
                    val.data.formCode = this.formCode;
                }
            },
            deep: true,
        },
    },
    methods: {
        addReg() {
            this.activeData.__config__.regList.push({
                pattern: '',
                message: '',
            });
        },
        addSelectItem() {
            this.activeData.options.push({
                label: '',
                value: '',
            });
        },
        delSelectItem(index) {
            this.activeData.options.splice(index, 1);
            this.activeData.__config__.defaultValue = this.activeData.multiple ? [] : ''; //下拉选项是否是多选
        },
        changeSelectItem() {
            // this.activeData.options = [];
            this.activeData.__config__.defaultValue = this.activeData.multiple ? [] : ''; //下拉选项是否是多选
        },
        addTreeItem(opstion) {
            /*级联选择组件时*/
            if (opstion === 'options') {
                this.cascaderChange();
            }
            ++this.idGlobal;
            this.dialogVisible = true;
            this.currentNode = this.activeData[opstion];
        },
        cascaderChange() {
            this.activeData.props.props.label = 'label';
            this.activeData.props.props.value = 'value';
            this.activeData.props.props.children = 'children';
        },
        renderContent(h, { node, data, store }) {
            return (
                <div class="custom-tree-node">
                    <span>{node.label}</span>
                    <span class="node-operation">
                        <i on-click={() => this.append(data)} class="el-icon-plus" title="添加"></i>
                        <i on-click={() => this.remove(node, data)} class="el-icon-delete" title="删除"></i>
                    </span>
                </div>
            );
        },
        append(data) {
            this.cascaderChange();
            if (!data.children) {
                this.$set(data, 'children', []);
            }
            this.dialogVisible = true;
            this.currentNode = data.children;
        },
        remove(node, data) {
            this.activeData.__config__.defaultValue = []; // 避免删除时报错
            const { parent } = node;
            const children = parent.data.children || parent.data;
            const index = children.findIndex((d) => d.id === data.id);
            children.splice(index, 1);
        },
        addNode(data) {
            this.treeValues = [];
            this.getTreeValues(this.activeData.options || this.activeData.data); //获取级联组件、树形组件所有的value集合
            if (this.treeValues.indexOf(data.value) == -1) {
                this.currentNode.push(data);
                this.dialogVisible = false;
            } else {
                this.$AudaqueToast.error({
                    template: `选项值重复请重新输入`,
                    methods: {
                        okEvent() {},
                    },
                });
            }
        },
        getTreeValues(treeData) {
            treeData.forEach((item) => {
                this.treeValues.push(item.value);
                if (item.children && item.children.length > 0) {
                    this.getTreeValues(item.children);
                }
            });
        },
        /*设计表格头部*/
        addTableHeader(data) {
            // this.$set(this.activeData.__config__, 'children', data);
            this.$set(this.activeData, 'headerList', data);
        },

        setOptionValue(item, val) {
            item.value = isNumberStr(val) ? +val : val;
        },
        setDefaultValue(val) {
            if (Array.isArray(val)) {
                return val.join(',');
            }
            // if (['string', 'number'].indexOf(typeof val) > -1) {
            //   return val
            // }
            if (typeof val === 'boolean') {
                return `${val}`;
            }
            return val;
        },
        /*树形是否是单选*/
        treeIsSingleChoice(val) {
            if (val) {
                this.activeData['check-strictly'] = true; //单选的话让树形，父子是不互相关联
            }
        },
        onDefaultValueInput(str) {
            if (isArray(this.activeData.__config__.defaultValue)) {
                // 数组
                this.$set(
                    this.activeData.__config__,
                    'defaultValue',
                    str.split(',').map((val) => (isNumberStr(val) ? +val : val))
                );
            } else if (['true', 'false'].indexOf(str) > -1) {
                // 布尔
                this.$set(this.activeData.__config__, 'defaultValue', JSON.parse(str));
            } else {
                // 字符串和数字
                this.$set(this.activeData.__config__, 'defaultValue', isNumberStr(str) ? +str : str);
            }
        },
        onSwitchValueInput(val, name) {
            if (['true', 'false'].indexOf(val) > -1) {
                this.$set(this.activeData, name, JSON.parse(val));
            } else {
                this.$set(this.activeData, name, isNumberStr(val) ? +val : val);
            }
        },
        setTimeValue(val, type) {
            const valueFormat = type === 'week' ? dateTimeFormat.date : val;
            this.$set(this.activeData.__config__, 'defaultValue', null);
            this.$set(this.activeData, 'value-format', valueFormat);
            this.$set(this.activeData, 'format', val);
        },
        spanChange(val) {
            this.formConf.span = val;
        },
        multipleChange(val) {
            this.$set(this.activeData.__config__, 'defaultValue', val ? [] : '');
        },
        dateTypeChange(val) {
            this.setTimeValue(dateTimeFormat[val], val);
        },
        rangeChange(val) {
            this.$set(
                this.activeData.__config__,
                'defaultValue',
                val ? [this.activeData.min, this.activeData.max] : this.activeData.min
            );
        },
        rateTextChange(val) {
            if (val) this.activeData['show-score'] = false;
        },
        rateScoreChange(val) {
            if (val) this.activeData['show-text'] = false;
        },
        colorFormatChange(val) {
            this.activeData.__config__.defaultValue = null;
            this.activeData['show-alpha'] = val.indexOf('a') > -1;
            this.activeData.__config__.renderKey = +new Date(); // 更新renderKey,重新渲染该组件
        },
        openIconsDialog(model) {
            this.iconsVisible = true;
            this.currentIconModel = model;
        },
        setIcon(val) {
            this.activeData[this.currentIconModel] = val;
        },
        tagChange(tagIcon) {
            let target = inputComponents.find((item) => item.__config__.tagIcon === tagIcon);
            if (!target) target = selectComponents.find((item) => item.__config__.tagIcon === tagIcon);
            this.$emit('tag-change', target);
        },
        changeRenderKey() {
            if (needRerenderList.includes(this.activeData.__config__.tag)) {
                this.activeData.__config__.renderKey = +new Date();
            }
        },
        setTabsValue(item, val) {
            item.name = isNumberStr(val) ? +val : val;
        },
        delTabsItem(index) {
            this.activeData.__slot__.options.splice(index, 1);
            this.activeData.__slot__.defaultValue = '';
        },
        addTabsItem() {
            this.activeData.__slot__.options.push({
                label: '',
                name: '',
            });
        },

        /*增加-表格请求参数 值*/
        setTableRequestValue(item, val) {
            this.$set(item, 'value', isNumberStr(val) ? +val : val);
            // item.value = isNumberStr(val) ? +val : val;
        },
        /*删除-增加-表格请求参数*/
        delTableRequestItem(index) {
            this.activeData.__config__.parameter.splice(index, 1);
        },
        /*增加-表格请求参数 行*/
        addTableRequestItem() {
            this.activeData.__config__.parameter.push({
                label: '',
                name: '',
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.right-board {
    width: 300px;
    position: absolute;
    right: 0;
    top: 0;
    padding-top: 3px;
    height: 100%;
    .field-box {
        position: relative;
        height: calc(100% - 50px);
        /*height: 100%;*/
        box-sizing: border-box;
        overflow: auto;
    }
    .el-scrollbar {
        height: 100%;
        padding: 0 20px 0 0;
    }
    /deep/ .el-form {
        padding: 0 15px;
    }
    /deep/ .el-form-item__label {
        line-height: 28px;
        padding-bottom: 0;
        color: #333;
        font-size: 12px;
        padding-right: 8px;
    }
    /deep/.el-input__inner {
        border: 1px solid #e0e0e0;
    }
}

.select-item {
    display: flex;
    border: 1px dashed #fff;
    box-sizing: border-box;
    & .close-btn {
        cursor: pointer;
        color: #f56c6c;
    }
    & .el-input + .el-input {
        margin-left: 4px;
    }
}

.select-item + .select-item {
    margin-top: 4px;
}

.select-item.sortable-chosen {
    border: 1px dashed #409eff;
}

.select-line-icon {
    line-height: 32px;
    font-size: 22px;
    padding: 0 4px;
    color: #777;
}

.option-drag {
    cursor: move;
}

.time-range {
    .el-date-editor {
        width: 227px;
    }
    ::v-deep .el-icon-time {
        display: none;
    }
}

.document-link {
    position: absolute;
    display: block;
    width: 26px;
    height: 26px;
    top: 0;
    left: 0;
    cursor: pointer;
    background: #409eff;
    z-index: 1;
    border-radius: 0 0 6px 0;
    text-align: center;
    line-height: 26px;
    color: #fff;
    font-size: 18px;
}

.node-label {
    font-size: 14px;
}

.node-icon {
    color: #bebfc3;
}

.select-data-sources {
    padding: 0 0 15px 15px;
}

.select-data-item {
    margin-top: 15px;
    /deep/.el-form-item__label {
        width: 40px !important;
        padding-right: 0;
    }
    /deep/.el-form-item__content {
        margin-left: 40px !important;
    }
}
/deep/.rowsSelect {
    .el-input__inner {
        height: 32px;
        line-height: 32px;
    }
}
</style>
