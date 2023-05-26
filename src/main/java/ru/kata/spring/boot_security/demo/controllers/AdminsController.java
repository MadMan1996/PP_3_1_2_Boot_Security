package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
    @GetMapping("/users/new")
    public String newUserForm(Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("roles", rolesRepository.findAll());
        return("user/newUserForm");
    }

    @GetMapping("/users")
    public String listOfUsers(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        return "user/listOfUsers";
    }

    @PostMapping("/users/delete/{id}")
    public String deleteUserProfile(@PathVariable(name = "id") Long id) {
        userService.removeUserById(id);
        return "redirect:/admin/users";
    }

    @PostMapping("/users")
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
        return "redirect:/admin/users";
    }

}
