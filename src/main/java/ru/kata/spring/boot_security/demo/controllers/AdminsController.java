package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.DAO.RolesRepository;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;
import javax.validation.Valid;
@RequestMapping("admin")
@Controller
public class AdminsController {
    @Autowired
    private UserService userService;
    @Autowired
    private RolesRepository rolesRepository;
    @GetMapping("/new")
    public String newUserForm(Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("roles", rolesRepository.findAll());
        return("user/newUserForm");
    }

    @GetMapping()
    public String listOfUsers(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        return "user/listOfUsers";
    }

    @DeleteMapping("/{id}")
    public String deleteUserProfile(@PathVariable(name = "id") Long id) {
        userService.removeUserById(id);
        return "redirect:/admin/";
    }
    @GetMapping("/{id}")
    public String editUserProfile(@PathVariable("id") Long id, Model model){
        model.addAttribute("user", userService.getById(id));
        return "user/editUserForm";
    }
    @PatchMapping("/{id}")
    public String updateUserProfile(@Valid User user, BindingResult bindingResult){
        if(userService.isUserExistsWithEmail(user.getEmail()) && !userService.getById(user.getId()).getEmail().equals(user.getEmail())){
            bindingResult.rejectValue("email", "error.user", "An account already exists for this email.");
        }
        if(bindingResult.hasErrors()){
            return "user/editUserForm";
        }
        userService.updateUserProfile(user);
        return"redirect:/admin/";
    }
    @PostMapping("/")
    public String createNewUserProfile(@Valid User user, BindingResult bindingResult, Model model){
        model.addAttribute("roles", rolesRepository.findAll());
        if(userService.isUserExistsWithEmail(user.getUsername())){
            bindingResult.rejectValue("email", "error.user", "An account already exists for this email.");
        }
        userService.checkUserProfile(user, bindingResult);
        if(bindingResult.hasErrors()){
            return "user/newUserForm";
        }
        userService.saveNewUserProfile(user);
        return "redirect:/admin/";
    }

}
