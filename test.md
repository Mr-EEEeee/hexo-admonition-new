admonition 警告；告诫 [.ædmə'nɪʃ(ə)n]
https://github.com/Mr-EEEeee/hexo-admonition-new
anote | info | todo | warning | attention | caution | failure | missing | fail | error | danger | bug | tip | success | question | example | quote

# Admonition 功能测试

!!! info "自定义标题"
    这是基于 hexo-admonition-new 插件渲染的一条提示信息。类型为 info，并设置了自定义标题。
    支持多行内容。

---

## 折叠块

!!!+ tip "点击可折叠"
    这个提示块默认展开，可以点击标题折叠它。
    适合包含重要但可选的补充信息。

!!!- danger "点击展开查看危险"
    这个危险块默认折叠，需要点击才能看到内容。
    适合包含详细的技术细节或不常用的信息。

---

## 内容设置

!!! warning
    这是一条采用默认标题的警告信息。

!!! warning "小心！"
    这是自定义标题的警告信息。

!!! warning ""
    这是不带标题的警告信息。

!!! warning "这是只有标题的提示信息"

---

## 嵌套支持

!!! warning "小心！"
    这是一个警告内容。

    > 嵌套引用内容

    - 列表项 1
    - 列表项 2

        ```js
        console.log("支持代码块");
        ```
    你好

    !!! info "内层块"
        这是内层嵌套的提示内容
            !!!+ danger "内层块"
                这是内层嵌套的提示内容

---

## 其他

!!! anote "你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好"

!!! todo ""
    你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好

---

# Admonition 样式测试

## ✅ anote
!!! anote 
    内容可以是多行的。
    你可以像这样换行。

## ℹ️ info
!!! info 
    用于一般的信息展示。

## 📝 todo
!!! todo 
    - [x] 已完成任务
    - [ ] 待办任务

## ⚠️ warning
!!! warning 
    小心！这可能会带来问题。

## 🚨 attention
!!! attention 
    请特别注意这一段内容！

## ⚠️ caution
!!! caution 
    使用时请保持谨慎。

## ❌ failure
!!! failure 
    操作失败了，请检查错误信息。

## 🛑 missing
!!! missing 
    某个关键内容缺失。

## ❗ fail
!!! fail 
    执行失败。

## ❗ error
!!! error 
    出现了错误，请修复。

## ☠️ danger
!!! danger 
    危险操作！后果自负。

## 🐛 bug
!!! bug 
    存在一个已知的 bug，等待修复。

## 💡 tip
!!! tip 
    小技巧：你可以使用快捷键 Ctrl + S 快速保存！

## ✅ success
!!! success 
    操作成功完成！

## ❓ question
!!! question 
    你确定要继续这个操作吗？

## 📘 example
!!! example 
    ```js
    console.log('Hello World');
    ```

## 💬 quote
!!! quote "这是一个 Quote 引用"
    “我们要有最朴素的生活和最遥远的梦想。” — 海子

---