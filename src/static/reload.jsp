<%@ page import="org.jasig.cas.client.authentication.AttributePrincipal" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.lang.Exception" %>
<%@ page import="java.io.OutputStream" %>
<%@ page import="java.io.IOException" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
	try{
		request.setCharacterEncoding("UTF-8");
		AttributePrincipal principal = (AttributePrincipal) request.getUserPrincipal();
		Map attributes = principal.getAttributes();
		String userinfo = (String) attributes.get("userinfo");
		if(userinfo!=null&&userinfo!=""){
			Cookie cookie=new Cookie("userinfo",userinfo);
			cookie.setMaxAge(1*60*60);
			cookie.setPath(request.getContextPath());
			response.addCookie(cookie);
			
			response.sendRedirect("index.html");
		}else{
			String msg = "please login first!";
			throw new Exception(msg);
		}
	}catch(Exception e){
		e.printStackTrace();
	}
%>
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <title>
        正在跳转...
    </title>
    <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
    <meta name="renderer" content="webwebkit|ie-standkit|ie-comp">
    <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
</head>
<body>    
</body>
</html>