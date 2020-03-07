<%--
  Created by IntelliJ IDEA.
  User: HoldN
  Date: 2017-08-13
  Time: 11:24
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    session.invalidate();
    response.sendRedirect(application.getInitParameter("casServerLogoutUrl"));
%>
<html>
<body>
</body>
</html>
