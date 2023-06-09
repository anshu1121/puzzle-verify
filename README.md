# 拼图验证
> puzzle for Vue3
### props
| 参数 | 说明 | 类型 | 默认值 |
|----|---|---|---|
| imgSrc | 图片链接 | string | - |
| wrapper | 容器类名 | string | - |
| width | 宽度 | number | 360 |
| tip | 提示文字 | string | '拖动滑块完成验证' |
| successTip | 验证成功后的提示文字 | string | '验证成功' |
| showRefresh | 是否显示刷新按钮 | boolean | true |
| diffDistance | 允许的误差范围，在此范围内表示验证成功 | number | 5 |
| autoRefresh | 验证失败后重新加载图片，需要在fail回调时修改新的imgSrc | boolean | false |

### callbacks
| 名称 | 说明 | 参数 |
|----|---|---|
| success | 验证成功后的回调函数 | type: object <br />{ moveDistance: '移动距离', pointX: '缺失的横坐标x位置'} |
| fail | 验证失败后的回调函数。如果开启autoRefresh，需要修改新的imgSrc | 同success |
| refresh | 刷新拼图，需要传入新的imgSrc | - |

### methods
| 名称 | 说明 | 参数 |
|----|---|---|
| reset | 重置验证状态 | - |