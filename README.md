# 拼图验证插件
> 支持Vue3
### props
| 参数 | 说明 | 类型 | 默认值 |
|----|---|---|---|
| imgSrc | 图片链接 | string | - |
| wrapperClass | 容器类名 | string | - |
| width | 宽度 | number | 360 |
| tip | 提示文字 | string | '拖动滑块完成验证' |
| successTip | 验证成功后的提示文字 | string | '验证成功' |
| showRefresh | 是否显示刷新按钮 | boolean | true |
| diffDistance | 允许的误差范围，在此范围内表示验证成功 | number | 5 |
|  |  |  |  |
|  |  |  |  |

### callbacks
| 名称 | 说明 | 参数 |
|----|---|---|
| success | 验证成功后的回调函数 | type: object <br />{ moveDistance: '移动距离', pointX: '拼块的横坐标x位置'} |
| fail | 验证失败后的回调函数 | 同success |
|  |  |  |