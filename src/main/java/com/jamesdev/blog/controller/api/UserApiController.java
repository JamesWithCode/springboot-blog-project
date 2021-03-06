package com.jamesdev.blog.controller.api;

import com.jamesdev.blog.dto.EmailDupCheckDto;
import com.jamesdev.blog.dto.ResponseDto;
import com.jamesdev.blog.dto.UserEditRequestDto;
import com.jamesdev.blog.dto.UserSignUpRequestDto;
import com.jamesdev.blog.model.User;
import com.jamesdev.blog.service.UserService;
import lombok.RequiredArgsConstructor;
import net.minidev.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserApiController {

    private final UserService userService;

    @PostMapping("/auth/api/checkEmailUsed")
    private ResponseDto<Integer> checkEmailUsed(@RequestBody EmailDupCheckDto emailDupCheckDto){
        System.out.println(emailDupCheckDto.toString());
        User user = userService.findUserByEmail(emailDupCheckDto.getEmail());
        if (user.equals(new User())){
            //빈 객체면 회원가입 계속 진행
            return new ResponseDto<>(HttpStatus.OK.value(), 1);
        }else{
            //빈 객체가 아니면 기존에 존재하던 회원이니까 로그인 창으로 이동
            return new ResponseDto<>(HttpStatus.OK.value(),2);
        }
    }
    @PostMapping("/auth/api/signUp")
    private ResponseDto<JSONObject>signUp(@Valid @RequestBody UserSignUpRequestDto userSignUpRequestDto, Errors errors){
        //유효성 검사 통과못함
        if(errors.hasErrors()){
            Map<String,String> validatorResult = userService.validateHandling(errors);
            JSONObject validatorResultJson=new JSONObject(validatorResult);
            return new ResponseDto<>(HttpStatus.SERVICE_UNAVAILABLE.value(), validatorResultJson);
        }
        //유효성 검사 통과
        userService.signUp(userSignUpRequestDto);
        return new ResponseDto<>(HttpStatus.OK.value(), new JSONObject());
    }

    @PutMapping("/auth/api/editUser")
    private ResponseDto<JSONObject> editUser(@Valid @RequestBody UserEditRequestDto userEditRequestDto, Errors errors, Model model){

        if(errors.hasErrors()){
           Map<String,String> validatorResult = userService.validateHandling(errors);
           JSONObject validatorResultJson = new JSONObject(validatorResult);
           return new ResponseDto<>(HttpStatus.SERVICE_UNAVAILABLE.value(), validatorResultJson);
        }
        Map<String,String> resultMap=new HashMap<>();
        if(!userService.editUser(userEditRequestDto)){
            resultMap.put("message","기존 비밀번호가 일치하지 않습니다.");
        }
        JSONObject resultJson= new JSONObject(resultMap);


        return new ResponseDto<>(HttpStatus.OK.value(),resultJson);
    }


}

