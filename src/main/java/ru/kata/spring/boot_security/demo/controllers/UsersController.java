package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import ru.kata.spring.boot_security.demo.DAO.RolesRepository;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UsersController {
    private UserService userService;
    private RolesRepository rolesRepository;
    @Autowired
    public void setUserService(UserService userService, RolesRepository rolesRepository) {
        this.userService = userService;
        this.rolesRepository = rolesRepository;
    }


    @GetMapping("/user")
    public String showUserProfile(@AuthenticationPrincipal User user, Model model){
        model.addAttribute("authUser", userService.getById(user.getId()));
        return "user/bootstrapAdminPage";
    }

}
