export default {
    /**
     *获取指定类型的图表信息option
     @param {arrary} dataSource 数据源
     * @param {string} type 所需获取图表信息对象类型
     * @returns {Object} 返回图表对象
     */
    getOptionObj(type, dataSource) {
        //console.log(dataSource)
        let [tempSeries, tempeles, theRate, numLength, cnUnit] = [
            [],
            [],
            1,
            0,
            ''
        ]
        if (dataSource != undefined && dataSource.series != null) {
            //计算数据中的最大值
            dataSource.series.forEach(ele => {
                tempeles = tempeles.concat(ele)
            })
            numLength = Math.ceil(Math.max.apply(null, tempeles)).toString()
                .length
            if (numLength > 4 && numLength < 9) {
                //单位为：万
                cnUnit = '(万)'
                theRate = 10000
            } else if (numLength > 8) {
                //单位为：亿
                cnUnit = '(亿)'
                theRate = 100000000
            } else {
                //小于一万不作处理
                cnUnit = ''
                theRate = 1
            }
            dataSource.series.forEach((element, index) => {
                element = element.map(obj => {
                    return obj / theRate
                })
                tempSeries.push({
                    name: dataSource.legend[index],
                    barWidth: 20, //柱子宽度
                    barGap: 0.5, //柱子之间间距
                    type: type,
                    data: element
                })
            })
        }
        return {
            backgroundColor: '#fff',
            color: [
                '#53A7F8',
                '#F9DC71',
                '#51C291',
                '#BD93DF',
                '#F28666',
                '#6CC0D6'
            ],
            tooltip: {
                trigger: 'axis',
                //trigger: 'item',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    },
                    label: {
                        formatter: '{value}' + cnUnit
                    }
                }
            },
            legend: {
                data: dataSource.legend,
                //icon: 'rect',
                icon: type,
                type: 'scroll',
                top: 0,
                left: 5,
                itemWidth: 8,
                itemHeight: 8
            },
            grid: {
                top: 50,
                left: 10,
                right: 50,
                bottom: 0,
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    axisLine: {
                        lineStyle: {
                            color: '#DCDCDC'
                        }
                    },
                    axisLabel: {
                        color: '#444F61'
                    },
                    data: dataSource.xAxis == null ? [] : dataSource.xAxis
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: '#ebebeb'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#000'
                        }
                    },
                    axisLabel: {
                        color: '#444F61',
                        formatter: '{value}' + cnUnit
                    }
                }
            ],
            series: tempSeries
        }
    }
}
