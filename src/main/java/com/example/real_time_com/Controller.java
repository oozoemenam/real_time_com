package com.example.real_time_com;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@org.springframework.stereotype.Controller
public class Controller {

    @GetMapping
    public String index(Model model) {
        return "index";
    }
}