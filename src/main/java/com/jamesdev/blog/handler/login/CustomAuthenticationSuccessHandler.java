package com.jamesdev.blog.handler.login;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jamesdev.blog.dto.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class CustomAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    //로그인이 잘 됐을 때 보내는 핸들러


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        Map<String,String> dataMap= new HashMap<>();
        dataMap.put("url","/"); //나중에는 원래 있던 곳으로 돌아갈 수 잇게 세션에서  기존 url 받아옴
        ObjectMapper mapper= new ObjectMapper(); //JSON에 담을 매퍼

        request.getSession().setMaxInactiveInterval(20);
        ResponseDto<Map<String,String>> responseDto = new ResponseDto<>(HttpStatus.OK.value(), dataMap);
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().print(mapper.writeValueAsString(responseDto));
        response.getWriter().flush();

    }
}
