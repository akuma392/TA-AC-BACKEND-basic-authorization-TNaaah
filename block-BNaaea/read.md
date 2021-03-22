<a href="/articles">blog</a>
<% if(user) { %>
<a href="/articles/new">Add article</a>
<a id="user-header" href="/users/articles"> <%= user.name%></a>
<a href="/users/logout">Logout</a>
<% } else{ %>
<a href="/users/login">login</a>
<a href="/users/signup">Sign up</a>
<%}%>
