package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    @GetMapping("/users")
    public String listOfUsers(Model model, @AuthenticationPrincipal User user) {
        model.addAttribute("authUser", userService.getById(user.getId()));
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("roles", rolesRepository.findAll());
        return "user/bootstrapAdminPage";
    }

    @PatchMapping("users/{id}")
    public String updateUserProfile(@AuthenticationPrincipal User authUser, @Valid User updatedUser, BindingResult bindingResult, Model model){

        if(userService.isUserExistsWithEmail(updatedUser.getEmail()) && !userService.getById(updatedUser.getId()).getEmail().equals(updatedUser.getEmail())){
            bindingResult.rejectValue("email", "error.user", "An account already exists for this email.");
        }
        userService.checkUserProfile(updatedUser, bindingResult);

        if(bindingResult.hasErrors()){
            throw new UserProfileExcetion(bindingResult.getAllErrors().toString());
        }
        userService.updateUserProfile(updatedUser);
        return "redirect:/admin/users";
    }


    @DeleteMapping("/users/{id}")
    public String deleteUserProfile(@PathVariable(name = "id") Long id) {
        userService.removeUserById(id);
        return "redirect:/admin/users";
    }

    @PostMapping("/users")
    public String createNewUserProfile(@Valid User updatedUser, BindingResult bindingResult){;;

        if(userService.isUserExistsWithEmail(updatedUser.getUsername())){
            bindingResult.rejectValue("email", "error.user", "An account already exists for this email.");
        }
        userService.checkUserProfile(updatedUser, bindingResult);
        if(bindingResult.hasErrors()){
            throw new UserProfileExcetion(bindingResult.getAllErrors().toString());
        }
        userService.saveNewUserProfile(updatedUser);
        return "redirect:/admin/users";
    }
    @ExceptionHandler({UserProfileExcetion.class})
    @ResponseBody
    public String handleUserProfileExceptoin(Throwable ex) {
        return ex.toString();
    }



    static class UserProfileExcetion extends IllegalArgumentException {
        public UserProfileExcetion(String s) {
            super(s);
        }

        public UserProfileExcetion(String message, Throwable cause) {
            super(message, cause);
        }

        public UserProfileExcetion(Throwable cause) {
            super(cause);
        }
    }

}
