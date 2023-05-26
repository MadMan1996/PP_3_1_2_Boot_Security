package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import javax.validation.Valid;

@Controller
public class UsersController {
    private UserService userService;
    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("user/{id}")
    public String updateUserProfile(@Valid User user, BindingResult bindingResult){
        if(userService.isUserExistsWithEmail(user.getEmail()) && !userService.getById(user.getId()).getEmail().equals(user.getEmail())){
            bindingResult.rejectValue("email", "error.user", "An account already exists for this email.");
        }
        if(bindingResult.hasErrors()){
            return "user/editUserForm";
        }
        userService.updateUserProfile(user);
        return"redirect:/user";
    }
    @GetMapping("/user/edit")
    public String editUserProfile(@AuthenticationPrincipal User user, Model model){
        model.addAttribute("user", userService.getById(user.getId()));
        return "user/editUserForm";
    }

    @GetMapping("/user")
    public String showUserProfile(@AuthenticationPrincipal User user, Model model){
        model.addAttribute("user", userService.getById(user.getId()));
        return "user/userProfile";
    }

}
