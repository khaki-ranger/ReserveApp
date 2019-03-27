extends layout

block content
  section.register
    .dialog
      form.ui-component(action="/register" method="post")
        div.userid.ui-block
          label.ui-component(id="username") ユーザーネーム
          input.ui-component(type="text" name="username" for="username" placeholder="username")
        div.password.ui-block
          label.ui-component パスワード
          input.ui-component(type="password" name="password" placeholder="password")
        div.role.ui-block
          select.ui-component(name="role")
            each role in roles
              option(value="#{role.num}") #{role.name}
        div.ui-block
          button.ui-component 登録
