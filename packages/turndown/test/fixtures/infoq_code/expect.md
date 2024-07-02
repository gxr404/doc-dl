```
module github.com/renhongcai/gomodule

go 1.14

require (
  github.com/google/uuid v1.1.1
  golang.org/x/text v0.3.2
)

replace github.com/google/uuid v1.1.1 => github.com/google/uuid v1.1.0
```

```
download    download modules to local cache 常用，下载依赖包
edit        edit go.mod from tools or scripts   ide编辑就行
graph       print module requirement graph  查看使用而已
init        initialize new module in current directory  常用
tidy        add missing and remove unused modules   常用
vendor      make vendored copy of dependencies  从mod cache中拷贝到项目的vendor
verify      verify dependencies have expected content
why         explain why packages or modules are needed
```