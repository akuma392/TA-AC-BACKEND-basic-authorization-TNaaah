  <li class="category">
    <h4>List of Podcasts</h4>
    <%if(categories.length && user) { %> <% categories.forEach((category)=>{ %>
    <div>
      <a href="/items/category/<%= category%>"> <%= category%> </a>
    </div>
    <% }) } %>
  </li>
